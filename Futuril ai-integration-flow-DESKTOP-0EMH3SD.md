# Futuril — AI Integration Flow

Every AI feature in Futuril (Career DNA, Career Compass, Learning Hub transforms, Kiki, project mentor, interview simulation) shares one request pipeline. Building it once as shared middleware, rather than per-feature, is what makes the cost-governance strategy from the Tech Stack doc actually enforceable.

## 1. Standard AI request lifecycle

```
sequenceDiagram
  participant C as Client
  participant API as API route
  participant Cap as Cost cap check
  participant Cache as Response cache
  participant Router as Model router
  participant LLM as Claude API
  participant DB as Postgres (ai_usage_log)

  C->>API: POST (e.g. /learning-materials/:id/transform)
  API->>Cap: check daily request count for user
  alt over daily cap
    Cap-->>C: 429 too many AI requests today
  else within cap
    API->>Cache: lookup hash(content + mode + params)
    alt cache hit
      Cache-->>API: cached response
      API-->>C: 200 (no LLM call, no cost)
    else cache miss
      API->>Router: select model tier for this feature
      Router->>LLM: call with tiered model + assembled context
      LLM-->>Router: response
      Router->>DB: insert ai_usage_log (model, tokens, est_cost)
      Router->>Cache: store response keyed by content hash
      Router-->>C: 200 + response
    end
  end
```

## 2. Model tiering logic

| Task | Tier | Reasoning |
|---|---|---|
| Quiz/flashcard generation from known content | Cheap (Haiku-tier) | Structured, low-ambiguity transform |
| Skill-gap classification, resume-JD match scoring | Cheap | Deterministic-ish comparison task |
| Career DNA synthesis | Capable (Sonnet-tier) | Needs to weigh multiple weak signals into a coherent profile |
| AI Pathway generation | Capable | Multi-step reasoning over skill graph + constraints |
| Kiki conversations (all modes) | Capable | Needs context continuity and nuanced tone, especially for minors |
| Project mentor / interview feedback | Capable | Judgment-heavy, high stakes for user trust |

Router implementation is a simple lookup by `feature` name — not a runtime "let the model decide its own tier" call, which would defeat the cost-control purpose.

## 3. Context assembly (what goes into the prompt)

Every capable-tier call assembles context from the DB before calling the model — this is what makes Kiki feel like it "knows" the student rather than being a generic chatbot:

```
sequenceDiagram
  participant API as API route
  participant DB as Postgres
  participant LLM as Claude API

  API->>DB: fetch career_dna (latest version)
  API->>DB: fetch user_pathway + current level
  API->>DB: fetch recent learning_progress, streak
  API->>DB: fetch last N kiki_messages (conversation continuity)
  API->>LLM: system prompt + assembled context + user message
  LLM-->>API: response
```

Keep the assembled context under a fixed token budget (e.g. summarize older progress rather than sending full history every call) — this is a second cost lever independent of model tier.

## 4. Learning Hub — RAG flow (uploaded content Q&A)

```
sequenceDiagram
  participant C as Client
  participant API as API route
  participant Emb as Embedding model
  participant PG as Postgres (pgvector)
  participant LLM as Claude API

  Note over C,API: On upload
  C->>API: POST /learning-materials (PDF/link/note)
  API->>Emb: generate embedding for extracted text
  API->>PG: store learning_material row + embedding vector

  Note over C,API: On "teach me this"
  C->>API: POST /learning-materials/:id/transform { mode }
  API->>PG: pgvector similarity search (top-k relevant chunks)
  API->>LLM: prompt = mode instructions + retrieved chunks
  LLM-->>API: explanation / quiz / flashcards / summary
  API-->>C: 200 + generated content
```

## 5. Kiki — streaming chat

```
sequenceDiagram
  participant C as Client
  participant API as API route (SSE)
  participant LLM as Claude API (streaming)
  participant Mod as Content moderation
  participant DB as Postgres

  C->>API: POST /kiki/conversations/:id/messages { text }
  API->>DB: insert kiki_message (sender: user)
  API->>LLM: stream request with assembled context
  loop token stream
    LLM-->>API: token chunk
    API-->>C: SSE chunk (real-time typing effect)
  end
  API->>Mod: check full response before/while committing (see below)
  API->>DB: insert kiki_message (sender: kiki), insert ai_usage_log
```

**Moderation placement:** for minor users, run a lightweight moderation pass on the assembled response before it's persisted as final — flag rather than silently block, and log flagged exchanges for review. This trades a small latency cost for a hard safety requirement; it isn't optional for this user base.

## 6. Failure and degradation handling

| Failure | Handling |
|---|---|
| LLM API timeout/error | Retry once with the same tier; on second failure, degrade to cached "try again in a moment" response rather than a raw error, and log the failure |
| Capable-tier call fails but cheap-tier could partially answer | No automatic silent downgrade for Kiki/mentor (quality matters for trust) — but safe for quiz/flashcard generation |
| pgvector similarity search returns nothing relevant | Fall back to a general (non-RAG) explanation, tell the user the upload didn't have matching content, don't hallucinate around an empty retrieval |
| User hits daily cost cap mid-conversation | Return 429 with a clear message and a reset time — never fail silently or degrade Kiki's persona mid-chat |

## 7. What must exist before Kiki ships (even the MVP text version)

- `ai_usage_log` writes on every call (already in schema)
- Per-user daily request cap enforced at the API layer
- Basic moderation pass on outbound content for `is_minor = true` users
- Context assembly capped to a fixed token budget

These four are the minimum bar — everything else (voice, long-term memory, weekly check-ins) is additive on top of this pipeline, not a redesign of it.

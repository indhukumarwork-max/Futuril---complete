# Futuril — API Design

REST over HTTPS, JSON bodies, JWT bearer auth (issued by Supabase Auth) on every route except `POST /auth/*`. Base path: `/api/v1`.

Conventions: `GET` list endpoints support `?limit=&cursor=`. All mutation endpoints return the created/updated resource. Errors return `{ "error": { "code", "message" } }` with standard HTTP status codes. Endpoints marked **(MVP)** correspond to Stages A–G in the Development Phases doc; everything else is post-MVP.

---

## 1. Auth & Profile **(MVP)**

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/signup` | Email/password signup |
| POST | `/auth/login` | Email/password login |
| GET | `/auth/oauth/:provider` | Google/GitHub OAuth redirect (Supabase-managed) |
| POST | `/auth/logout` | Invalidate session |
| GET | `/me` | Current user + profile + preferences |
| PATCH | `/me/profile` | Update `user_profile` |
| PATCH | `/me/preferences` | Update `user_preference` |
| POST | `/me/guardian-consent` | Record guardian consent (minors) |

---

## 2. Onboarding & Career DNA **(MVP)**

| Method | Path | Purpose |
|---|---|---|
| POST | `/onboarding/education-stage` | Save step 2 |
| POST | `/onboarding/skill-level` | Save step 3 |
| POST | `/onboarding/goals` | Save step 4 |
| POST | `/onboarding/time-availability` | Save step 5, completes onboarding |
| POST | `/career-dna/generate` | Triggers LLM synthesis → new `career_dna` row (versioned) |
| GET | `/career-dna/latest` | Current Career DNA |
| GET | `/career-dna/history` | Full evolution timeline |
| POST | `/career-dna/re-evaluate` | Re-run after milestones (triggers new version, "Your Career DNA has evolved") |

---

## 3. Career Compass **(MVP)**

| Method | Path | Purpose |
|---|---|---|
| GET | `/careers` | Browse career catalog (`?category=`) |
| GET | `/careers/:id` | Career detail card |
| GET | `/careers/:id/related` | Related careers |
| POST | `/careers/:id/try-experience` | Start a "Try Before You Commit" mini activity |
| POST | `/careers/:id/try-experience/:sessionId/feedback` | Submit enjoy/confused/continue feedback |
| GET | `/career-recommendations` | Personalized matches with `match_percentage` + `reasoning_text` |

---

## 4. Skill Graph **(MVP)**

| Method | Path | Purpose |
|---|---|---|
| GET | `/skills/:id` | Skill detail + prerequisites |
| GET | `/skills/:id/prerequisites` | Prerequisite chain |
| GET | `/me/skills` | Current user's skill scores |
| GET | `/me/skill-gap?careerId=` | Gap analysis vs a target career |

---

## 5. AI Pathway **(MVP)**

| Method | Path | Purpose |
|---|---|---|
| POST | `/pathways/generate?careerId=` | Generate/assign roadmap for chosen career |
| GET | `/me/pathway` | Active pathway + current level + progress |
| GET | `/pathways/:id/modules` | Level list for a pathway |
| GET | `/pathway-modules/:id` | Module detail (learn/practice/test/apply/reflect) |
| POST | `/pathway-modules/:id/complete` | Mark module complete, advance level |
| POST | `/me/pathway/adapt` | Trigger adaptive re-plan (post-MVP, missed goals/time change) |

---

## 6. Learning Hub **(MVP)**

| Method | Path | Purpose |
|---|---|---|
| POST | `/learning-materials` | Upload PDF/link/note (multipart or URL) |
| GET | `/learning-materials` | List user's materials |
| GET | `/learning-materials/:id` | Material detail + extracted text |
| POST | `/learning-materials/:id/transform` | `{ mode: "explain" \| "quiz" \| "flashcards" \| "summary" ... }` → AI-generated content |
| GET | `/learning-materials/:id/content?mode=` | Retrieve a specific generated transform |
| POST | `/quizzes/:id/attempt` | Submit quiz attempt, get score |

---

## 7. Dashboard **(MVP)**

| Method | Path | Purpose |
|---|---|---|
| GET | `/dashboard` | Aggregated: today's mission, career progress %, skill bars, weekly stats, streak |
| GET | `/me/streak` | Streak detail |
| GET | `/notifications` | List (unread filter via `?unread=true`) |
| PATCH | `/notifications/:id/read` | Mark read |

---

## 8. Practice Engine *(post-MVP)*

| Method | Path | Purpose |
|---|---|---|
| GET | `/practice/daily` | Today's challenge(s) |
| GET | `/practice/weekly` | This week's challenge |
| POST | `/practice-tasks/:id/attempt` | Submit attempt, get score |
| GET | `/me/practice-history` | Past attempts |

---

## 9. Project Lab *(post-MVP)*

| Method | Path | Purpose |
|---|---|---|
| GET | `/project-templates?difficulty=&careerId=` | Personalized project recommendations |
| POST | `/user-projects` | Start a project from a template |
| GET | `/user-projects/:id` | Detail + milestones |
| PATCH | `/user-projects/:id/milestones/:milestoneId` | Update milestone status |
| POST | `/user-projects/:id/mentor/ask` | Ask the AI project mentor a question at any pipeline stage |
| POST | `/user-projects/:id/feedback` | Request AI feedback (includes copy-paste comprehension check) |
| POST | `/user-projects/:id/complete` | Mark complete → feeds Skill Graph + Portfolio |

---

## 10. Portfolio, Resume & Interview *(post-MVP)*

| Method | Path | Purpose |
|---|---|---|
| GET | `/me/portfolio` | Full portfolio view |
| POST | `/me/portfolio/projects` | Add a completed project to portfolio |
| POST | `/resumes` | Generate resume for a target goal |
| GET | `/resumes/:id` | Retrieve resume |
| POST | `/resumes/:id/match-job` | Upload JD → skill-match breakdown (✓/△/✗) + % match |
| POST | `/interview-sessions` | Start mock interview (`mode`, `careerId`) |
| POST | `/interview-sessions/:id/respond` | Submit answer, get next question |
| GET | `/interview-sessions/:id/feedback` | Full session feedback |

---

## 11. Career Readiness & Opportunities *(post-MVP)*

| Method | Path | Purpose |
|---|---|---|
| GET | `/me/readiness-score` | Overall + per-category breakdown with gap notes |
| GET | `/opportunities?type=&location=` | Browse matched opportunities |
| POST | `/opportunities/:id/apply` | Create/update application |
| GET | `/me/applications` | Application tracker |

---

## 12. Kiki AI Companion *(text chat MVP'd early inside Stage F; full features post-MVP)*

| Method | Path | Purpose |
|---|---|---|
| POST | `/kiki/conversations` | Start conversation (`mode`) |
| POST | `/kiki/conversations/:id/messages` | Send message, get Kiki reply (streamed) |
| GET | `/kiki/conversations/:id/messages` | History |
| GET | `/kiki/memory` | Long-term memory entries (post-MVP) |
| POST | `/kiki/check-in` | Weekly check-in trigger (post-MVP) |

---

## Cross-cutting: AI cost governance

Every route that calls the LLM (`career-dna/generate`, `learning-materials/:id/transform`, `pathways/generate`, `kiki/conversations/:id/messages`, mentor/interview endpoints) must write one row to `ai_usage_log` per call — `model_used`, token counts, estimated cost. Enforce a per-user daily request cap at the API layer (429 on breach) before it hits the model provider. This is the enforcement mechanism for the cost-tiering strategy in the Tech Stack doc, not an afterthought.

## Auth & authorization notes

- All `/me/*` and mutation routes require a valid JWT; row-level security in Supabase should mirror this (`user_id = auth.uid()`) as a second layer, not a replacement for API checks.
- Minors (`users.is_minor = true`): gate Kiki's `voice` and unmoderated free-text modes behind stricter content filtering server-side; log flagged content for review rather than silently blocking.

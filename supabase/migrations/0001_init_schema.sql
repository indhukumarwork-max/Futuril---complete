-- Supabase migration generated from schema-DESKTOP-0EMH3SD.sql

-- =====================================================================
-- FUTURIL — DATABASE SCHEMA (validated & corrected from source ERD)
-- Target: PostgreSQL 15+ (Supabase), pgvector extension enabled
-- =====================================================================
-- Changes vs original ERD are marked with "-- FIX:" comments.

create extension if not exists "uuid-ossp";
create extension if not exists vector;
create extension if not exists pgcrypto;

-- Define uuid_generate_v4() using pgcrypto if not available
create or replace function uuid_generate_v4() returns uuid language sql as $$ select gen_random_uuid(); $$;

-- =====================================================================
-- 1. IDENTITY & PROFILE
-- =====================================================================

create table education_stage (
  id            smallserial primary key,
  category      text not null check (category in ('school','undergraduate','graduate_early_career')),
  name          text not null,
  unique (category, name)
);

create table users (
  id              uuid primary key default uuid_generate_v4(),
  email           text unique,
  password_hash   text,                         -- null if OAuth-only
  auth_provider   text not null default 'email' check (auth_provider in ('email','google','github')),
  name            text not null,
  role            text not null default 'student' check (role in ('student','admin')),
  status          text not null default 'active' check (status in ('active','suspended','deleted')),
  language_pref   text not null default 'en',    -- FIX: localization support
  is_minor        boolean not null default false, -- FIX: minor safety flag
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  last_active_at  timestamptz
);
create index idx_users_email on users(email);

-- FIX: consent/guardian tracking for minor users
create table guardian_consent (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references users(id) on delete cascade,
  guardian_name   text,
  guardian_email  text,
  consent_given   boolean not null default false,
  consent_at      timestamptz,
  created_at      timestamptz not null default now()
);

create table user_profile (
  user_id             uuid primary key references users(id) on delete cascade,
  education_stage_id  smallint references education_stage(id),
  bio                 text,
  avatar_url          text,
  phone               text,
  timezone            text default 'Asia/Kolkata',
  skill_level_self    text check (skill_level_self in ('starting','basics','some_practice','can_build','advanced')),
  updated_at          timestamptz not null default now()
);

create table user_preference (
  user_id                 uuid primary key references users(id) on delete cascade,
  work_environment        text check (work_environment in ('remote','office','hybrid','startup','large_company','research','freelance','entrepreneurial')),
  location                text,
  open_to_relocation      boolean default false,
  salary_expectation_min  integer,
  salary_expectation_max  integer,
  career_stability_pref   text check (career_stability_pref in ('stable','high_growth','entrepreneurial','creative','research')),
  time_availability       text check (time_availability in ('15min_day','30min_day','1hr_day','2plus_hr_day','weekends_only')),
  updated_at              timestamptz not null default now()
);

-- =====================================================================
-- 2. CAREER DNA & CAREER COMPASS
-- =====================================================================

-- FIX: append-only history instead of a single mutable row, per PRD's
-- "Career DNA evolves over time" requirement
create table career_dna (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references users(id) on delete cascade,
  version             integer not null default 1,
  archetype           text,
  interest_profile    jsonb not null default '{}',
  strength_profile    jsonb not null default '{}',
  growth_areas        jsonb not null default '[]',
  learning_style      text[],
  motivation_pattern  text[],
  risk_preference     text check (risk_preference in ('stable','high_growth','entrepreneurial','creative','research')),
  generated_by        text default 'ai',           -- 'ai' | 'evolved' | 'manual'
  created_at          timestamptz not null default now(),
  unique (user_id, version)
);
create index idx_career_dna_user_latest on career_dna(user_id, version desc);

create table career (
  id                       uuid primary key default uuid_generate_v4(),
  name                     text not null,
  category                 text,
  overview                 text,
  beginner_difficulty      text check (beginner_difficulty in ('easy','moderate','advanced')),
  avg_time_to_first_project_days integer,
  india_salary_range_min   integer,
  india_salary_range_max   integer,
  is_active                boolean not null default true,
  created_at               timestamptz not null default now()
);

create table skill (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null unique,
  category     text,
  description  text
);

-- FIX: encodes the actual "graph" in Skill Graph
create table skill_prerequisite (
  skill_id               uuid not null references skill(id) on delete cascade,
  prerequisite_skill_id  uuid not null references skill(id) on delete cascade,
  primary key (skill_id, prerequisite_skill_id),
  check (skill_id <> prerequisite_skill_id)
);

create table career_skill (
  career_id         uuid not null references career(id) on delete cascade,
  skill_id          uuid not null references skill(id) on delete cascade,
  importance_weight numeric(3,2) not null default 1.0,
  primary key (career_id, skill_id)
);

create table user_skill (
  user_id           uuid not null references users(id) on delete cascade,
  skill_id          uuid not null references skill(id) on delete cascade,
  score             numeric(5,2) not null default 0 check (score between 0 and 100),
  evidence_count    integer not null default 0,
  last_assessed_at  timestamptz not null default now(),
  primary key (user_id, skill_id)
);

create table career_recommendation (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references users(id) on delete cascade,
  career_id         uuid not null references career(id) on delete cascade,
  career_dna_id     uuid references career_dna(id),
  match_percentage  numeric(5,2) not null check (match_percentage between 0 and 100),
  reasoning_text    text not null,          -- powers "Why this recommendation"
  generated_at      timestamptz not null default now()
);
create index idx_career_reco_user on career_recommendation(user_id, generated_at desc);

-- =====================================================================
-- 3. PATHWAY & LEARNING PROGRESS
-- =====================================================================

create table pathway (
  id            uuid primary key default uuid_generate_v4(),
  career_id     uuid not null references career(id) on delete cascade,
  name          text not null,
  total_levels  integer not null,
  is_active     boolean not null default true
);

create table pathway_module (
  id            uuid primary key default uuid_generate_v4(),
  pathway_id    uuid not null references pathway(id) on delete cascade,
  level_number  integer not null,
  title         text not null,
  stage         text check (stage in ('orientation','foundations','core_skills','practice','real_projects','specialization','career_readiness')),
  skill_id      uuid references skill(id),
  unique (pathway_id, level_number)
);

create table user_pathway (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references users(id) on delete cascade,
  pathway_id     uuid not null references pathway(id) on delete cascade,
  current_level  integer not null default 1,
  status         text not null default 'active' check (status in ('active','paused','completed')),
  started_at     timestamptz not null default now(),
  adapted_at     timestamptz,                  -- last adaptive-roadmap re-plan
  unique (user_id, pathway_id)
);

create table learning_progress (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null references users(id) on delete cascade,
  pathway_module_id  uuid not null references pathway_module(id) on delete cascade,
  status             text not null default 'not_started' check (status in ('not_started','in_progress','completed')),
  completed_at       timestamptz,
  unique (user_id, pathway_module_id)
);

create table learning_resource (
  id                 uuid primary key default uuid_generate_v4(),
  pathway_module_id  uuid not null references pathway_module(id) on delete cascade,
  type               text check (type in ('article','video','pdf','external_link')),
  title              text,
  url                text,
  source             text
);

create table quiz (
  id                 uuid primary key default uuid_generate_v4(),
  pathway_module_id  uuid references pathway_module(id) on delete cascade,
  questions          jsonb not null            -- [{q, options, answer}]
);

create table quiz_attempt (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references users(id) on delete cascade,
  quiz_id      uuid not null references quiz(id) on delete cascade,
  answers      jsonb not null,
  score        numeric(5,2) not null,
  attempted_at timestamptz not null default now()
);

-- =====================================================================
-- 4. LEARNING HUB (user-uploaded content + AI transforms)
-- =====================================================================

create table learning_material (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references users(id) on delete cascade,
  type           text check (type in ('pdf','link','note','image','presentation')),
  title          text,
  source_url     text,
  extracted_text text,
  embedding      vector(1536),                 -- FIX: enables RAG via pgvector
  uploaded_at    timestamptz not null default now()
);
create index idx_learning_material_user on learning_material(user_id);

create table ai_generated_content (
  id                   uuid primary key default uuid_generate_v4(),
  learning_material_id uuid not null references learning_material(id) on delete cascade,
  mode                 text not null check (mode in ('explain','deep_dive','teach_me','challenge','exam','feynman','story','flashcards','quiz','mind_map','summary')),
  content              jsonb not null,
  model_used           text not null,          -- FIX: needed for cost tracking
  generated_at         timestamptz not null default now()
);

-- =====================================================================
-- 5. PRACTICE ENGINE
-- =====================================================================

create table practice_task (
  id          uuid primary key default uuid_generate_v4(),
  skill_id    uuid references skill(id),
  type        text check (type in ('daily','weekly','scenario','active_recall')),
  difficulty  text check (difficulty in ('easy','moderate','advanced')),
  content     jsonb not null,
  is_active   boolean not null default true
);

create table practice_attempt (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references users(id) on delete cascade,
  practice_task_id uuid not null references practice_task(id) on delete cascade,
  response         jsonb,
  score            numeric(5,2),
  attempted_at     timestamptz not null default now()
);

-- =====================================================================
-- 6. PROJECT LAB
-- =====================================================================
-- FIX: split template (catalog) from instance (per-user progress)

create table project_template (
  id               uuid primary key default uuid_generate_v4(),
  career_id        uuid references career(id) on delete set null,
  title            text not null,
  difficulty_tier  text check (difficulty_tier in ('safe','growth','challenge')),
  description      text,
  estimated_days   integer,
  is_active        boolean not null default true
);

create table project_skill (
  project_template_id uuid not null references project_template(id) on delete cascade,
  skill_id             uuid not null references skill(id) on delete cascade,
  primary key (project_template_id, skill_id)
);

create table user_project (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references users(id) on delete cascade,
  project_template_id  uuid not null references project_template(id),
  status               text not null default 'planning' check (status in ('planning','in_progress','completed','abandoned')),
  started_at           timestamptz not null default now(),
  completed_at         timestamptz
);

create table project_milestone (
  id              uuid primary key default uuid_generate_v4(),
  user_project_id uuid not null references user_project(id) on delete cascade,
  title           text not null,
  stage           text check (stage in ('idea','requirements','planning','architecture','implementation','debugging','testing','documentation','deployment','presentation')),
  status          text not null default 'pending' check (status in ('pending','in_progress','done')),
  order_index     integer not null
);

create table project_feedback (
  id              uuid primary key default uuid_generate_v4(),
  user_project_id uuid not null references user_project(id) on delete cascade,
  feedback_text   text not null,
  is_ai_generated boolean not null default true,
  flagged_copied  boolean not null default false,   -- "you copied this but may not understand it"
  created_at      timestamptz not null default now()
);

-- =====================================================================
-- 7. PORTFOLIO, RESUME & INTERVIEW
-- =====================================================================

create table portfolio (
  id                     uuid primary key default uuid_generate_v4(),
  user_id                uuid not null unique references users(id) on delete cascade,
  headline               text,
  summary                text,
  career_readiness_pct   numeric(5,2) default 0,
  updated_at             timestamptz not null default now()
);

create table portfolio_project (
  portfolio_id     uuid not null references portfolio(id) on delete cascade,
  user_project_id  uuid not null references user_project(id) on delete cascade,
  showcase_order   integer not null default 0,
  primary key (portfolio_id, user_project_id)
);

create table resume (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references users(id) on delete cascade,
  target_goal  text check (target_goal in ('internship','first_job','scholarship','freelancing','startup','masters')),
  template     text,
  generated_at timestamptz not null default now()
);

create table resume_project (
  resume_id        uuid not null references resume(id) on delete cascade,
  user_project_id  uuid not null references user_project(id) on delete cascade,
  primary key (resume_id, user_project_id)
);

create table resume_skill (
  resume_id  uuid not null references resume(id) on delete cascade,
  skill_id   uuid not null references skill(id) on delete cascade,
  primary key (resume_id, skill_id)
);

create table interview_session (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references users(id) on delete cascade,
  career_id   uuid references career(id),
  mode        text check (mode in ('mock_general','role_specific','behavioral')),
  started_at  timestamptz not null default now(),
  ended_at    timestamptz
);

create table interview_response (
  id                   uuid primary key default uuid_generate_v4(),
  interview_session_id uuid not null references interview_session(id) on delete cascade,
  question             text not null,
  answer_text          text,
  order_index          integer not null
);

create table interview_feedback (
  id                    uuid primary key default uuid_generate_v4(),
  interview_response_id uuid not null references interview_response(id) on delete cascade,
  feedback_text         text not null,
  score                 numeric(5,2)
);

-- =====================================================================
-- 8. CAREER READINESS & OPPORTUNITY ENGINE
-- =====================================================================

create table readiness_score (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references users(id) on delete cascade,
  overall_score  numeric(5,2) not null check (overall_score between 0 and 100),
  computed_at    timestamptz not null default now()
);

create table readiness_category (
  readiness_score_id uuid not null references readiness_score(id) on delete cascade,
  category            text not null check (category in ('skill','project','portfolio','resume','interview','application')),
  score               numeric(5,2) not null,
  gap_notes           text,
  primary key (readiness_score_id, category)
);

create table opportunity (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  type          text check (type in ('internship','job','hackathon','scholarship','freelance')),
  company       text,
  location      text,
  requirements  jsonb,
  posted_at     timestamptz not null default now(),
  is_active     boolean not null default true
);

create table application (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references users(id) on delete cascade,
  opportunity_id  uuid not null references opportunity(id) on delete cascade,
  status          text not null default 'saved' check (status in ('saved','applied','interviewing','offer','rejected')),
  applied_at      timestamptz,
  unique (user_id, opportunity_id)
);

-- =====================================================================
-- 9. KIKI AI COMPANION
-- =====================================================================

create table kiki_conversation (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references users(id) on delete cascade,
  mode        text check (mode in ('tutor','career_coach','project_mentor','interviewer','motivation','voice','focus')),
  started_at  timestamptz not null default now(),
  ended_at    timestamptz
);

create table kiki_message (
  id              uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references kiki_conversation(id) on delete cascade,
  sender          text not null check (sender in ('user','kiki')),
  content         text not null,
  created_at      timestamptz not null default now()
);
create index idx_kiki_message_conv on kiki_message(conversation_id, created_at);

create table kiki_memory (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references users(id) on delete cascade,
  memory_type   text check (memory_type in ('preference','milestone','struggle','goal_change','check_in')),
  content       text not null,
  importance    smallint default 1 check (importance between 1 and 5),
  embedding     vector(1536),
  created_at    timestamptz not null default now()
);

-- =====================================================================
-- 10. CROSS-CUTTING: NOTIFICATIONS, ACHIEVEMENTS, STREAKS, AI COST LOG
-- =====================================================================

create table notification (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references users(id) on delete cascade,
  type       text not null,
  content    text not null,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);
create index idx_notification_user_unread on notification(user_id) where read_at is null;

create table achievement (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references users(id) on delete cascade,
  type       text not null,
  title      text not null,
  earned_at  timestamptz not null default now()
);

-- FIX: dashboard explicitly needs "streak" data with no home before
create table user_streak (
  user_id             uuid primary key references users(id) on delete cascade,
  current_streak_days integer not null default 0,
  longest_streak_days integer not null default 0,
  last_active_date    date,
  updated_at          timestamptz not null default now()
);

-- FIX: makes AI cost-tiering strategy enforceable, not just aspirational
create table ai_usage_log (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid references users(id) on delete set null,
  feature        text not null,     -- 'career_dna' | 'kiki' | 'learning_hub' | 'pathway' ...
  model_used     text not null,
  input_tokens   integer,
  output_tokens  integer,
  estimated_cost numeric(10,5),
  created_at     timestamptz not null default now()
);
create index idx_ai_usage_user_date on ai_usage_log(user_id, created_at);

-- =====================================================================
-- 11. INTEREST DISCOVERY ENGINE
-- =====================================================================
-- Runs before career_dna generation. Modular/configurable per the feature
-- spec — activities are data (activity_template), not hardcoded screens,
-- so new discovery types can be added without touching the engine.

create table discovery_session (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references users(id) on delete cascade,
  status        text not null default 'in_progress' check (status in ('in_progress','completed','abandoned')),
  started_at    timestamptz not null default now(),
  completed_at  timestamptz
);

create table discovery_activity_template (
  id             uuid primary key default uuid_generate_v4(),
  type           text not null check (type in ('preference','scenario','logic_puzzle','pattern_recognition','creative_thinking','visual_preference','learning_style','motivation','decision_making','mini_game','problem_solving')),
  prompt_config  jsonb not null,       -- activity content: question/scenario/puzzle definition, options, assets
  measures       text[] not null,      -- which dimensions this activity signals, e.g. {'analytical_thinking','risk_preference'}
  order_hint     integer not null default 0,
  is_active      boolean not null default true
);

create table discovery_response (
  id                    uuid primary key default uuid_generate_v4(),
  session_id            uuid not null references discovery_session(id) on delete cascade,
  activity_template_id  uuid not null references discovery_activity_template(id),
  response              jsonb not null,     -- raw interaction data (selection, timing, sequence, free text)
  response_time_ms      integer,
  created_at            timestamptz not null default now()
);
create index idx_discovery_response_session on discovery_response(session_id);

-- =====================================================================
-- 12. CAREER DNA — NODE MODEL (Analysis Engine output)
-- =====================================================================
-- career_dna (table 2) remains the versioned summary row (
-- archetype,\n-- headline profile). dna_node is the granular, queryable, clickable\n-- breakdown that the double-helix visualization renders and that the\n-- Analysis Engine writes to — separated so Discovery/Analysis/DNA/\
-- Visualization stay independent layers per the feature spec.

create table dna_node (
  id                  uuid primary key default uuid_generate_v4(),
  career_dna_id       uuid not null references career_dna(id) on delete cascade,
  category            text not null check (category in ('interest','strength','growth_area','learning_style','motivation','creativity','leadership','communication','collaboration','risk_preference','problem_solving','work_preference')),
  title               text not null,
  description         text not null,
  confidence_score    numeric(5,2) not null check (confidence_score between 0 and 100),
  ai_interpretation   text not null,
  supporting_evidence jsonb not null default '[]',  -- references into discovery_response ids / activity types that informed this node
  helix_position      integer not null,             -- ordering along the double helix for consistent, stable animation
  created_at          timestamptz not null default now()
);
create index idx_dna_node_career_dna on dna_node(career_dna_id, helix_position);

-- End of schema

-- 0002_rls_policies.sql
-- Row Level Security policies for user-owned tables

-- Enable RLS on tables and create policy that only allows rows where user_id matches the JWT uid

-- user_profile
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_profile_owner" ON user_profile USING (user_id = auth.uid());

-- user_preference
ALTER TABLE user_preference ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_preference_owner" ON user_preference USING (user_id = auth.uid());

-- user_pathway
ALTER TABLE user_pathway ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_pathway_owner" ON user_pathway USING (user_id = auth.uid());

-- learning_progress
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "learning_progress_owner" ON learning_progress USING (user_id = auth.uid());

-- learning_material
ALTER TABLE learning_material ENABLE ROW LEVEL SECURITY;
CREATE POLICY "learning_material_owner" ON learning_material USING (user_id = auth.uid());

-- user_skill
ALTER TABLE user_skill ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_skill_owner" ON user_skill USING (user_id = auth.uid());

-- user_project
ALTER TABLE user_project ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_project_owner" ON user_project USING (user_id = auth.uid());

-- portfolio
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portfolio_owner" ON portfolio USING (user_id = auth.uid());

-- resume
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;
CREATE POLICY "resume_owner" ON resume USING (user_id = auth.uid());

-- interview_session
ALTER TABLE interview_session ENABLE ROW LEVEL SECURITY;
CREATE POLICY "interview_session_owner" ON interview_session USING (user_id = auth.uid());



-- kiki_conversation
ALTER TABLE kiki_conversation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "kiki_conversation_owner" ON kiki_conversation USING (user_id = auth.uid());

-- notification
ALTER TABLE notification ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notification_owner" ON notification USING (user_id = auth.uid());

-- achievement
ALTER TABLE achievement ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achievement_owner" ON achievement USING (user_id = auth.uid());

-- user_streak
ALTER TABLE user_streak ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_streak_owner" ON user_streak USING (user_id = auth.uid());

-- ai_usage_log
ALTER TABLE ai_usage_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_usage_log_owner" ON ai_usage_log USING (user_id = auth.uid());

-- discovery_session
ALTER TABLE discovery_session ENABLE ROW LEVEL SECURITY;
CREATE POLICY "discovery_session_owner" ON discovery_session USING (user_id = auth.uid());



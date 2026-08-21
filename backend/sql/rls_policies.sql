ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_ownership_policy" 
ON notes FOR ALL 
USING (user_id = NULLIF(current_setting('app.user_id', true), '')::UUID)
WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::UUID);
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own notes" 
ON notes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own notes" 
ON notes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own notes" 
ON notes FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own notes" 
ON notes FOR DELETE 
USING (auth.uid() = user_id);
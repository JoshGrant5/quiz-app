-- Drop and recreate Answers table

DROP TABLE IF EXISTS trivia_answers CASCADE;
CREATE TABLE trivia_answers (
  id SERIAL PRIMARY KEY NOT NULL,
  question_id INTEGER REFERENCES trivia_questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE
);

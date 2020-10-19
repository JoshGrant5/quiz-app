DROP TABLE IF EXISTS personality_questions CASCADE;

CREATE TABLE personality_questions (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL
);

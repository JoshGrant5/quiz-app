DROP TABLE IF EXISTS trivia_questions CASCADE;

CREATE TABLE trivia_questions (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL
);

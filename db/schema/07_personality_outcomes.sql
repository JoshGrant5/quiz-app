DROP TABLE IF EXISTS personality_outcomes CASCADE;

CREATE TABLE personality_outcomes (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  photo TEXT,
  description VARCHAR(255)
);

DROP TABLE IF EXISTS personality_answers CASCADE;

CREATE TABLE personality_answers (
  id SERIAL PRIMARY KEY NOT NULL,
  questions_id INTEGER REFERENCES personality_questions(id) ON DELETE CASCADE,
  result_id INTEGER REFERENCES personality_results(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  photo TEXT
);

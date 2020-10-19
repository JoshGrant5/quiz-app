DROP TABLE IF EXISTS personality_answers CASCADE;

CREATE TABLE personality_answers (
  id SERIAL PRIMARY KEY NOT NULL,
  question_id INTEGER REFERENCES personality_questions(id) ON DELETE CASCADE,
  outcome_id INTEGER REFERENCES personality_outcomes(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  photo TEXT
);

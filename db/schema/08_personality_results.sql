DROP TABLE IF EXISTS personality_results CASCADE;

CREATE TABLE personality_results (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  outcome_id INTEGER REFERENCES personality_outcomes(id) ON DELETE CASCADE,
  date_completed DATE NOT NULL
);

-- Drop and recreate Quizzes table

DROP TABLE IF EXISTS quizzes CASCADE;
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY NOT NULL,
  creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  photo TEXT,
  listed BOOLEAN DEFAULT true,
  url VARCHAR(25),
  category VARCHAR(255),
  date_created DATE,
  type VARCHAR(255) NOT NULL;
  description TEXT
);

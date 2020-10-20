INSERT INTO quizzes (creator_id, title, photo, listed, url, category, date_created,type,description)
VALUES (1, 'Pokemon Quiz', 'https://1000logos.net/wp-content/uploads/2017/05/Pokemon-Logo.png', true, 'pokemon', 'Video Games', '2020-10-17','trivia','Think you have what it takes to catch them all?');

INSERT INTO trivia_questions (quiz_id, question) VALUES (19, 'Which Pokémon is known for carrying a leek?');
INSERT INTO trivia_answers (question_id, answer, is_correct) VALUES (61, 'Farfetch''d', true);
INSERT INTO trivia_answers (question_id, answer) VALUES (61, 'Mr. Mime');
INSERT INTO trivia_answers (question_id, answer) VALUES (61, 'Jynx');
INSERT INTO trivia_answers (question_id, answer) VALUES (61, 'Fearow');

INSERT INTO trivia_questions (quiz_id, question) VALUES (19, 'Which of these Pokémon closely resembles a plesiosaur?');
INSERT INTO trivia_answers (question_id, answer) VALUES (62, 'Omanyte');
INSERT INTO trivia_answers (question_id, answer) VALUES (62, 'Aerodactyl');
INSERT INTO trivia_answers (question_id, answer, is_correct) VALUES (62, 'Lapras', true);
INSERT INTO trivia_answers (question_id, answer) VALUES (62, 'Scyther');

INSERT INTO trivia_questions (quiz_id, question) VALUES (19, 'Which of these Pokemon is NOT an electric type?');
INSERT INTO trivia_answers (question_id, answer, is_correct) VALUES (63, 'Porygon', true);
INSERT INTO trivia_answers (question_id, answer) VALUES (63, 'Voltorb');
INSERT INTO trivia_answers (question_id, answer) VALUES (63, 'Zapdos');
INSERT INTO trivia_answers (question_id, answer) VALUES (63, 'Plusle');

INSERT INTO trivia_questions (quiz_id, question) VALUES (19, 'In Pokémon Go, which of these Pokémon can only be caught in Europe');
INSERT INTO trivia_answers (question_id, answer) VALUES (64, 'Tauros');
INSERT INTO trivia_answers (question_id, answer) VALUES (64, 'Farfetch''d');
INSERT INTO trivia_answers (question_id, answer) VALUES (64, 'Kangaskhan');
INSERT INTO trivia_answers (question_id, answer, is_correct) VALUES (64, 'Mr. Mime', true);

INSERT INTO trivia_questions (quiz_id, question) VALUES (19, 'Pokémon games usually begin with the user choosing from three ''starter Pokémon.'' Which of these is the correct trio of starters found in Pokémon Gold and Silver?');
INSERT INTO trivia_answers (question_id, answer) VALUES (65, 'Bulbasaur, Charmander, Squirtle');
INSERT INTO trivia_answers (question_id, answer) VALUES (65, 'Treecko, Torchic, Mudkip');
INSERT INTO trivia_answers (question_id, answer, is_correct) VALUES (65, 'Chikorita, Cyndaquil, Totodile', true);
INSERT INTO trivia_answers (question_id, answer) VALUES (65, 'Snivy, Tepig, Oshawott');

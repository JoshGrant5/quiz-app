INSERT INTO quizzes (creator_id, title, photo, listed, url, category, date_created)
VALUES (1, 'Pokemon Quiz', 'https://1000logos.net/wp-content/uploads/2017/05/Pokemon-Logo.png', true, 'pokemon', 'Video Games', '2020-10-17');

INSERT INTO questions (quiz_id, question) VALUES (5, 'Which Pokémon is known for carrying a leek?');
INSERT INTO answers (question_id, answer, is_correct) VALUES (9, 'Farfetch''d', true);
INSERT INTO answers (question_id, answer) VALUES (9, 'Mr. Mime');
INSERT INTO answers (question_id, answer) VALUES (9, 'Jynx');
INSERT INTO answers (question_id, answer) VALUES (9, 'Fearow');

INSERT INTO questions (quiz_id, question) VALUES (5, 'Which of these Pokémon closely resembles a plesiosaur?');
INSERT INTO answers (question_id, answer) VALUES (10, 'Omanyte');
INSERT INTO answers (question_id, answer) VALUES (10, 'Aerodactyl');
INSERT INTO answers (question_id, answer, is_correct) VALUES (10, 'Lapras', true);
INSERT INTO answers (question_id, answer) VALUES (10, 'Scyther');

INSERT INTO questions (quiz_id, question) VALUES (5, 'Which of these Pokemon is NOT an electric type?');
INSERT INTO answers (question_id, answer, is_correct) VALUES (11, 'Porygon', true);
INSERT INTO answers (question_id, answer) VALUES (11, 'Voltorb');
INSERT INTO answers (question_id, answer) VALUES (11, 'Zapdos');
INSERT INTO answers (question_id, answer) VALUES (11, 'Plusle');

INSERT INTO questions (quiz_id, question) VALUES (5, 'In Pokémon Go, which of these Pokémon can only be caught in Europe');
INSERT INTO answers (question_id, answer) VALUES (12, 'Tauros');
INSERT INTO answers (question_id, answer) VALUES (12, 'Farfetch''d');
INSERT INTO answers (question_id, answer) VALUES (12, 'Kangaskhan');
INSERT INTO answers (question_id, answer, is_correct) VALUES (12, 'Mr. Mime', true);

INSERT INTO questions (quiz_id, question) VALUES (5, 'Pokémon games usually begin with the user choosing from three ''starter Pokémon.'' Which of these is the correct trio of starters found in Pokémon Gold and Silver?');
INSERT INTO answers (question_id, answer) VALUES (13, 'Bulbasaur, Charmander, Squirtle');
INSERT INTO answers (question_id, answer) VALUES (13, 'Treecko, Torchic, Mudkip');
INSERT INTO answers (question_id, answer, is_correct) VALUES (13, 'Chikorita, Cyndaquil, Totodile', true);
INSERT INTO answers (question_id, answer) VALUES (13, 'Snivy, Tepig, Oshawott');

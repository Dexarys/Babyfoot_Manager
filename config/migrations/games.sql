CREATE TABLE IF NOT EXISTS games (
	game_id serial PRIMARY KEY,
	game_name VARCHAR (255) NOT NULL,
    game_finished INT,
	created_on TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_on TIMESTAMP,
    deleted_on TIMESTAMP,
    status INT DEFAULT 1
);

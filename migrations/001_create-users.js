exports.up = (pgm) => {
    pgm.sql(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX idx_users_email ON users(email);
        `);
};

exports.down = (pgm) => {pgm.sql(`DROP TABLE IF EXISTS users`);};
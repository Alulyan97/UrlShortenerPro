exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE links(
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      short_code VARCHAR(20) NOT NULL UNIQUE,
      original_url TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX idx_links_short_code ON links(short_code);
    CREATE INDEX idx_links_user_id ON links(user_id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE IF EXISTS links CASCADE;`);
};
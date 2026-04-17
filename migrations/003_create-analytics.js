exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE analytics (
      id SERIAL PRIMARY KEY,
      link_id INTEGER NOT NULL REFERENCES links(id) ON DELETE CASCADE,
      clicked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ip_address VARCHAR(45),
      user_agent TEXT,
      referer TEXT,
      country VARCHAR(100),
      city VARCHAR(100)
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE IF EXISTS analytics CASCADE;`);
};
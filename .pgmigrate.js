require('dotenv').config();

module.exports = {
  databaseUrl: process.env.DATABASE_URL_DOCKER || process.env.DATABASE_URL,
  migrationsTable: 'pgmigrations',
  dir: 'migrations', 
  direction: 'up',
  checkOrder: true,
};
let dbParams = {};
if (process.env.DATABASE_URL) {
  dbParams.connectionString = process.env.DATABASE_URL;
} else {
  dbParams = {
    host: 'salt.db.elephantsql.com',
    port: 5432,
    user: 'gfpcrylm',
    password: 'esOm1hIQD7EUF1FGE49q-lMclD6WPeO9',
    database: 'gfpcrylm'
  };
}

module.exports = dbParams;

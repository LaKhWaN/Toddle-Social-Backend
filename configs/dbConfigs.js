const { Pool } = require("pg");

// This database is hosted on Supabase, so no need to import on localhost
const pool = new Pool({
  host: "aws-0-ap-south-1.pooler.supabase.com",
  user: "postgres.nobwtdjwlppmufoajdke",
  password: "RqxJyjQPXjJ9ZnR0ds5ZDb1DXLcT7Q8n",
  database: "postgres",
});

// create connection to database
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("🔒 Connected to the external database: ", pool.options.database);
  client.release();
});
module.exports = pool;

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  const sql = fs.readFileSync(path.resolve(__dirname, '../supabase-bibliotheca-setup.sql'), 'utf8');
  const client = new Client({
    host: 'aws-0-sa-east-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.prtxsvgpjpgzzoxyhmrf',
    password: '@VasilyFTW11337798',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  console.log('Connecting to Supabase PostgreSQL...');
  await client.connect();
  console.log('Executing supabase-bibliotheca-setup.sql...');
  await client.query(sql);
  console.log('Migration executed successfully!');

  const tables = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name LIKE 'bibliotheca_%'
    ORDER BY table_name;
  `);
  console.log('Created Bibliotheca tables:', tables.rows.map(r => r.table_name));

  const funcs = await client.query(`
    SELECT routine_name 
    FROM information_schema.routines 
    WHERE routine_schema = 'public' AND routine_name LIKE 'bibliotheca_%'
    ORDER BY routine_name;
  `);
  console.log('Created Bibliotheca RPCs:', funcs.rows.map(r => r.routine_name));

  await client.end();
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

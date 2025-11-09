import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres:admin@localhost:5432/vapi-analytics",
});

export default pool;

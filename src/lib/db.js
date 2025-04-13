import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // or your custom user
  password: 'Faris02#', // 🔐 enter your actual password here
  database: 'hk_database_local',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
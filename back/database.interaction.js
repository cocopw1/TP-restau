// back/database.interaction.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mariadb',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'db',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function get_all_Posts() {
  const [rows] = await pool.query('SELECT * FROM POSTS');
  return rows;
}
async function login(data) {
  const [rows] = await pool.query('SELECT * FROM USERS WHERE name = ?', [data.username]);
  return rows && rows.length ? rows[0] : undefined;
}
async function add_Posts(article, userId, username) {
  await pool.query('INSERT INTO POSTS (article, user_id, username) VALUES (?, ?, ?)', [article, userId, username]);
}
async function createUser(name, hashedPassword, isAdmin) {
  const [result] = await pool.query(
    'INSERT INTO USERS (name, password, admin) VALUES (?, ?, ?)', 
    [name, hashedPassword, isAdmin]
  );
  return result.insertId; 
}
async function delete_Post(id) {
  const [result] = await pool.query('DELETE FROM POSTS WHERE id = ?', [id]);
  return result;
}
module.exports = {
  login,
  get_all_Posts,
  add_Posts,
  createUser,
  delete_Post,
};
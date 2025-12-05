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

async function get_all_Dessert() {
  const [rows] = await pool.query('SELECT * FROM DESSERTS');
  return rows;
}

async function get_all_Boissons() {
  const [rows] = await pool.query('SELECT * FROM BOISSONS');
  return rows;
}

async function login(data) {
  const [rows] = await pool.query('SELECT * FROM user WHERE email = ? AND password = ?', [data.email, data.password]);
  return rows && rows.length ? rows[0] : undefined;
}

async function add_Plats(data) {
  await pool.query('INSERT INTO PLATS (nom, prix, imgsrc, descr) VALUES (?, ?, ?, ?)', [data.name, data.prix, data.imgsrc, data.descr]);
}

async function add_Boissons(data) {
  await pool.query('INSERT INTO BOISSONS (nom, prix, imgsrc, descr) VALUES (?, ?, ?, ?)', [data.name, data.prix, data.imgsrc, data.descr]);
}

async function add_Desserts(data) {
  await pool.query('INSERT INTO DESSERTS (nom, prix, imgsrc, descr) VALUES (?, ?, ?, ?)', [data.name, data.prix, data.imgsrc, data.descr]);
}

module.exports = {
  login,
  get_all_Plats,
  get_all_Boissons,
  get_all_Dessert,
  add_Plats,
  add_Desserts,
  add_Boissons
};
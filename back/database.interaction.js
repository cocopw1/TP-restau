// back/database.interaction.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

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
async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connecté à la base de données pour initialisation.");

    // 1. Création de la table USERS
    await connection.query(`
      CREATE TABLE IF NOT EXISTS USERS (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        admin BOOLEAN DEFAULT FALSE
      )
    `);

    // 2. Création de la table POSTS
    // J'ajoute une colonne 'date' car elle est utilisée dans le front (post.date)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS POSTS (
        id INT AUTO_INCREMENT PRIMARY KEY,
        article TEXT NOT NULL,
        user_id INT,
        username VARCHAR(255),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE SET NULL
      )
    `);

    // 3. Création de l'admin par défaut s'il n'existe pas
    const [rows] = await connection.query('SELECT * FROM USERS WHERE name = ?', ['admin']);
    
    if (rows.length === 0) {
      console.log("⚠️ Admin introuvable, création en cours...");
      const hashedPassword = await bcrypt.hash('admin', 10);
      await connection.query(
        'INSERT INTO USERS (name, password, admin) VALUES (?, ?, ?)',
        ['admin', hashedPassword, true]
      );
      console.log("✅ Utilisateur 'admin' (mdp: 'admin') créé avec succès !");
    } else {
      console.log("ℹ️ L'utilisateur 'admin' existe déjà.");
    }

    connection.release();
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation de la BDD :", error);
  }
}
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
  initDatabase,
};
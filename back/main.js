let express = require('express');
const app = express();
const bcrypt = require('bcrypt'); // Indispensable pour hasher et vérifier
const port = 3000;

const cors = require("cors");
let dbi = require('./database.interaction.js');

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const jwt = require('jsonwebtoken');
const secretKey = 'd2ba641298ec1028ad6a6f0c0bcf2cc8851268dbeef7694c822139eefe475b4422d36f369b87613198a336b3d6cb6b3fb833017cd7c0993cf69c12f1666ec7b5';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Le token est souvent envoyé comme "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ error: "Accès refusé, token manquant" });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token invalide" });
        }
        req.user = user; // On stocke les infos du token dans la requête
        next(); // On passe à la suite
    });
};


// --- ROUTES ---

// 1. Récupérer les posts
app.get('/Posts', (req, res) => {
  dbi.get_all_Posts().then((result) => {
    res.send(result);
  });
});
// --- NOUVELLE ROUTE POST /Posts ---
app.post('/Posts', authenticateToken, async (req, res) => {
    try {
        const { article } = req.body;
        
        // On récupère l'ID et le Nom depuis le token décodé par le middleware
        const userId = req.user.userId;
        const username = req.user.username || 'Anonyme'; // Sécurité si le username manque

        if (!article) {
            return res.status(400).json({ error: "Le contenu de l'article est vide" });
        }
        console.log(article)
        // On appelle la fonction DB corrigée
        await dbi.add_Posts(article, userId, username);

        res.status(201).json({ message: "Post ajouté avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de l'ajout du post" });
    }
});
// 2. INSCRIPTION (Register) + Auto-Login
app.post('/register', async (req, res) => {
    try {
        const { username, password, isAdmin } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: "Username et password requis" });
        }

        // A. On hashe le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // B. On insère dans la BDD via ta fonction dbi
        // Note: Assure-toi que ta fonction s'attend bien à (nom, passwordHash, admin)
        const newUserId = await dbi.createUser(username, hashedPassword, isAdmin);

        // C. On génère le token immédiatement
        const token = jwt.sign(
            { userId: newUserId, username: username, isAdmin: isAdmin }, 
            secretKey, 
            { expiresIn: '1h' }
        );

        // D. On renvoie le tout
        res.status(201).json({ token: token, message: "Utilisateur créé et connecté" });

    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
             return res.status(409).json({ error: "Utilisateur déjà existant" });
        }
        res.status(500).send('Erreur serveur');
    }
});

// 3. LOGIN (Mise à jour pour gérer le hachage)
app.post('/login', async (req, res) => {
  try {
      const { username, password } = req.body;

      // A. On cherche l'utilisateur par son nom SEULEMENT
      // (Attention: il faut que dbi.login fasse un "SELECT * WHERE name = ?" sans vérifier le password en SQL)
      const user = await dbi.login({ username: username }); 

      if (!user) {
        return res.status(401).send('Utilisateur inconnu');
      }

      // B. On compare le mot de passe envoyé avec le hash en BDD
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        // C. C'est bon, on crée le token
        // AVANT : const payload = { userId: user.id, isAdmin: user.admin };
// APRES :
        const payload = { userId: user.id, username: user.name, isAdmin: user.admin }; // J'ajoute isAdmin au token, c'est utile
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        
        console.log("Login succès pour :", username);
        res.json({ token: token });
      } else {
        // D. Mauvais mot de passe
        res.status(401).send('Mot de passe incorrect');
      }

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
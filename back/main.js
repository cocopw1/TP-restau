let express = require('express');
const app = express()
const port = 3000

const cors = require("cors");
let dbi = require('./database.interaction.js')
app.use(
  cors({
    origin: "http://localhost:4200", // Autorise uniquement ce domaine
    methods: ["GET","POST","PUT","DELETE"], // Spécifie les méthodes HTTP autorisées
    allowedHeaders: ["Content-Type","Authorization"], // Autorise ces en-têtes
    credentials: true, // Autorise l’envoi de cookies
  })
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.get('/plats', (req, res) => {
  dbi.get_all_Plats().then((result)=>{
    res.send(result)
  });
})
app.get('/Boissons', (req, res) => {
  dbi.get_all_Boissons().then((result)=>{
    res.send(result)
  });
})
app.get('/Desserts', (req, res) => {
  dbi.get_all_Dessert().then((result)=>{
    res.send(result)
  });
})
app.post('/Commande', (req, res) => {
  console.log(req.body)
  res.status(204).send();
})
const jwt = require('jsonwebtoken'); // Importation de jsonwebtoken

const secretKey = 'd2ba641298ec1028ad6a6f0c0bcf2cc8851268dbeef7694c822139eefe475b4422d36f369b87613198a336b3d6cb6b3fb833017cd7c0993cf69c12f1666ec7b5'; // Remplacez par une clé secrète que vous utiliserez pour signer vos tokens

app.post('/login', (req, res) => {
  console.log(req.body)
  dbi.login(req.body).then((result) => {
    if (result === undefined) {
      res.status(401).send('Invalid credentials'); // Envoie une erreur 401 si les identifiants sont incorrects
    } else {
      // Crée un payload pour le JWT (par exemple, l'ID de l'utilisateur)
      const payload = { userId: result.id };

      // Crée le token
      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Le token expire dans 1 heure

      // Renvoie le token au client
      console.log(token)
      res.json({ token: token });
    }
  }).catch(err => {
    res.status(500).send('Internal Server Error');
  });
});
app.post('/add', (req, res) => {
  console.log("Données reçues :", req.body); // ✅ Affiche le JSON envoyé
  dbi.add_Plats(req.body)
  res.send('Requête reçue');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
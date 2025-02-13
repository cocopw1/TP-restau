let express = require('express');
const app = express()
const port = 3000

const cors = require("cors");
let dbi = require('./database.interaction.js')
app.use(
  cors({
    origin: "http://localhost:4200", // Autorise uniquement ce domaine
    methods: "GET,POST,PUT,DELETE", // Spécifie les méthodes HTTP autorisées
    allowedHeaders: "Content-Type,Authorization", // Autorise ces en-têtes
    credentials: true, // Autorise l’envoi de cookies
  })
);

app.use(express.json())
app.get('/plats', (req, res) => {
  dbi.get_all_Plats().then((result)=>{
    res.send(result)
  });
})
app.get('/dessert', (req, res) => {
  dbi.get_all_Dessert().then((result)=>{
    res.send(result)
  });
})

app.post('/add', (req, res) => {
  console.log("Données reçues :", req.body); // ✅ Affiche le JSON envoyé
  dbi.add_Plats(req.body)
  res.send('Requête reçue');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
let express = require('express');
const app = express()
const port = 3000

let dbi = require('./database.interaction.js')

app.use(express.json())
app.get('/', (req, res) => {
  dbi.get_all_Plats().then((result)=>{
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
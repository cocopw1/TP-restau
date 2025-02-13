const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',  // Ou l'IP de ton conteneur
  user: 'root',
  password: 'toor',
  database: 'db',
  port: 3306
});

// connection.connect((err) => {
//   if (err) {
//     console.error('Erreur de connexion :', err);
//     return;
//   }
//   console.log('✅ Connecté à MariaDB !');

//   // Exemple : récupérer les tables de la base
//   connection.query('ALTER TABLE PLATS MODIFY COLUMN id INT AUTO_INCREMENT;', (err, results) => {
//     if (err) {
//       console.error('Erreur lors de la requête :', err);
//     } else {
//       console.log('Tables disponibles :', results);
//     }
//   });
//   connection.end();
// });
var get_all_Plats= async function(){
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err)
            }
            connection.query('SELECT * FROM PLATS', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        })
    })
}
var login = async function(data){
    let email = data.email;
    let password= data.password;
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                reject(err)
            }
            connection.query(`select * from user where email = "${email}" and password = "${password}";`, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        })
    })
}

var add_Plats = function(data){
    connection.connect((err) => {
        if (err) {
          console.error('Erreur de connexion :', err);
          return;
        }
        let name =data.name;
        let imgsrc =data.imgsrc;
        let descr =data.descr;
        let prix =data.prix;

        connection.query('INSERT INTO PLATS (nom, prix, imgsrc, descr) values ("${1}", ${2}, "${3}", "${4}" )'.replace("${1}",name).replace("${3}",imgsrc).replace("${2}",prix).replace("${4}",descr), (err, results) => {
            if (err) {
                console.error('Erreur lors de la requête :', err);
            } else {
                console.log(results);
            }
        });
    })
    
}
module.exports = {
    login,
    get_all_Plats,
    add_Plats
}
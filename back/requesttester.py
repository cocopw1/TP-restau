import requests

data = {
    "name": "Onion California roll",
    "prix": 13,
    "imgsrc": """https://gumisushi.com/wp-content/uploads/2023/05/california-roll-avocat-saumon-oignons-frits.jpg""",
    "descr": "un California roll au oignon frits"
}

response = requests.post('http://localhost:3000/add', json=data)

print("Statut de la requête :", response.status_code)
print("Réponse du serveur :", response.text)
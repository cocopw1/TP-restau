import requests

data = {
    "name": "Spagetti Maki",
    "prix": 17,
    "imgsrc": """https://truffle-assets.tastemadecontent.net/cdn-cgi/image/width=1080/6910df1c-_spaghettisushi_square2.jpg""",
    "descr": "un maki inspirer de la cuisine italienne"
}

response = requests.post('http://localhost:3000/add', json=data)

print("Statut de la requête :", response.status_code)
print("Réponse du serveur :", response.text)
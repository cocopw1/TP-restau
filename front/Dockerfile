# Étape 1 : Construction de l'application Angular
FROM node:20-alpine as build

WORKDIR /app

# Copie des dépendances
COPY package*.json ./
RUN npm ci

# Copie du code source
COPY . .

# Construction pour la production
# Cela va créer un dossier dist/nom-du-projet/browser
RUN npm run build -- --configuration production

# Étape 2 : Serveur Web Nginx
FROM nginx:stable-alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# CORRECTION ICI : Ajoutez "/browser" à la fin du chemin source
COPY --from=build /app/dist/projet-restau/browser /usr/share/nginx/html

EXPOSE 80

CMD ["/bin/sh", "-c", "echo '✅ Application Front-End démarrée ! Accessible sur http://localhost:80' && nginx -g 'daemon off;'"]
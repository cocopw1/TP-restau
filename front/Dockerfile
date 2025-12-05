# Étape 1 : Construction de l'application Angular
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Construction pour la production
RUN npm run build -- --configuration production

# Étape 2 : Serveur Web Nginx
FROM nginx:alpine

# 1. Nettoyage : On supprime la page "Welcome to Nginx" par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copie de la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers compilés (Notez bien le /browser)
COPY --from=build /app/dist/projet-restau/browser /usr/share/nginx/html

# 2. Correction Angular SSR/Prerender :
# Si index.html n'a pas été généré (à cause de la redirection), on utilise index.csr.html
RUN if [ ! -f /usr/share/nginx/html/index.html ] && [ -f /usr/share/nginx/html/index.csr.html ]; then \
        cp /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html; \
    fi

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
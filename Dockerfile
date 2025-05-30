# Utiliser une image de base officielle Node.js
FROM node:20.16.0

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier le package.json et le package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install --production


# Copier le reste du code de l'application
COPY . .

# Exposer le port sur lequel votre API est en écoute
EXPOSE 3000

# Démarrer l'application
CMD ["node", "app.js"]

# comm
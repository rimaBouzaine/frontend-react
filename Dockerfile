FROM node:alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier le package.json et le package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Définir le port sur lequel l'application va s'exécuter
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]

# Basisimage
FROM node:14-alpine

# Arbeitsverzeichnis im Container
WORKDIR /app

# Abhängigkeiten kopieren
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm install

# Quellcode kopieren
COPY . .

# Build durchführen
RUN npm run build

# Portnummer festlegen
EXPOSE 8080

# Startbefehl
CMD ["npm", "start"]

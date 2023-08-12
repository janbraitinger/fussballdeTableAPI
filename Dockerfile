# Verwenden Sie ein offizielles Node.js-Image als Basis
FROM node:18.16.0-alpine3.17

# Legen Sie das Arbeitsverzeichnis innerhalb des Containers fest
WORKDIR /app

# Kopieren Sie die Dateien aus dem aktuellen Verzeichnis in das Arbeitsverzeichnis des Containers
COPY . .

# Installieren Sie die Abhängigkeiten mit npm
RUN npm install

# Exponieren Sie den Port, auf dem die Anwendung ausgeführt wird
EXPOSE 3000

# Starten Sie die Anwendung
CMD ["node", "index.js"]

# Używamy lekkiej wersji Node.js
FROM node:20-slim

# Ustawiamy folder roboczy wewnątrz kontenera
WORKDIR /app

# Kopiujemy tylko pliki definicji bibliotek
COPY package*.json ./

# Instalujemy biblioteki (wewnątrz kontenera)
RUN npm install

# Kopiujemy resztę plików projektu
COPY . .

# Informujemy, na jakim porcie działa Vite
EXPOSE 5173

# Odpalamy serwer deweloperski z flagą --host
# Jest ona niezbędna, by Docker wystawił port na zewnątrz
CMD ["npm", "run", "dev", "--", "--host"]
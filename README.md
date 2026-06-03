# Costle

**Costle** to kompletna aplikacja webowa typu klient-serwer, która umożliwia grę polegającą na odgadywaniu ceny produktu na podstawie danych z bazy MongoDB. Projekt składa się z części frontendowej w React + Vite oraz backendowej w Node.js + Express.

## Funkcjonalność

- Wybór produktu dnia i pobieranie go z bazy danych MongoDB
- Logika zgadywania ceny z kolorowymi podpowiedziami:
  - `green` — trafiona cena
  - `yellow` — cena bliska (±10%)
  - `red` — cena daleka
- Szyfrowanie stanu gry w tokenie JWT, aby serwer mógł bezpiecznie walidować kolejne próby
- Ograniczenie liczby zgadnięć (rate limiting) w celu ochrony przed nadużyciami
- Obsługa żądań CORS tylko z frontendu

## Techniczny stack

### Backend

- Node.js
- Express
- MongoDB
- `cors` — obsługa zapytań między domenami
- `helmet` — podstawowe zabezpieczenia nagłówków HTTP
- `express-rate-limit` — ograniczanie liczby żądań do API
- `jose` — szyfrowanie i deszyfrowanie tokenów JWT
- `dotenv` — ładowanie zmiennych środowiskowych

### Frontend

- React 19
- Vite
- TypeScript
- Tailwind CSS
- `canvas-confetti` — efekt konfetti w UI
- `html-to-image` — generowanie obrazów z elementów strony
- `lucide-react` — ikony we frontendzie

### Inne narzędzia

- Docker / Docker Compose — szybkie uruchomienie serwisu w kontenerach

## Struktura projektu

- `backend/` — serwer Node.js i logika API
- `frontend/` — aplikacja React uruchamiana przez Vite
- `docker-compose.yaml` — konfiguracja kontenerów frontend-backend

## Uruchomienie lokalne

### 1. Skopiuj repozytorium

```bash
git clone https://github.com/your-user/your-repo.git
cd Costle
```

### 2. Przygotuj konfigurację backendu

Utwórz plik `backend/.env` z następującymi zmiennymi:

```env
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>/Costle
ENCRYPTION_KEY=<hexowa-wartość-klucza-32-bajtowego>
```

> `ENCRYPTION_KEY` musi być 32-bajtowym kluczem zapisanym w formacie heksadecymalnym.

### 3. Uruchom backend i frontend lokalnie

#### Opcja A: Docker Compose

```bash
docker compose up --build
```

- Backend będzie dostępny pod: `http://localhost:8080`
- Frontend będzie dostępny pod: `http://localhost:5173`

#### Opcja B: ręczne uruchomienie

1. Backend:

```bash
cd backend
npm install
npm start
```

2. Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Adresy URL

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`

## Wskazówki

- Upewnij się, że MongoDB jest dostępne i kolekcja `Products` zawiera dokumenty z polami `category`, `releaseDate` oraz `price`.
- Tokeny gry wygaśnię po 5 minutach, co pomaga zabezpieczyć stan gry.
- Zaktualizuj wartość `origin` w `backend/server.js`, jeśli frontend będzie działać na innym hoście.

## Link do projektu / demo

`https://your-deployment-link.example.com`

---

const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const dbUrl = process.env.DATABASE_URL;

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Połączono z bazą danych"))
  .catch((err) => console.error("Błąd połączenia z bazą danych:", err));

app.use(express.json({ limit: "10kb" }));
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173", // Pozwól na żądania tylko z Twojego frontendu
    methods: ["GET", "POST"], // Określ dozwolone metody
    allowedHeaders: ["Content-Type"], // I nagłówki
  }),
);
app.set("trust proxy", 1);

// Konfiguracja limitera dla gry
const guessLimiter = rateLimit({
  windowMs: 10 * 1000, // Okno czasowe: 10 sekund
  max: 5, // Maksymalnie 5 strzały w tym oknie
  message: {
    status: 429,
    error: "Zgadywałeś za szybko! Możesz podać tylko 5 liczby na 10 sekund.",
  },
  standardHeaders: true, // Zwraca informacje o limicie w nagłówkach RateLimit-*
  legacyHeaders: false, // Wyłącza stare nagłówki X-RateLimit-*
});

const Product = require("./product");
const GuessLogic = require("./guessLogic");

const mockProduct = {
  "2026-05-17": {
    id: 1,
    name: "Majonez (1L)",
    image: "majo.png",
    price: 7.5,
  },
};

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// 1. Pobieranie danych o produkcie dnia
app.post("/api/product", (req, res) => {
  const dateProduct = req.body.date;
  if (mockProduct[dateProduct]) {
    const { id, name, image } = mockProduct[dateProduct];
    res.json({
      id: id,
      name: name,
      image: image,
    });
  } else {
    res.status(404).json({ error: "Produkt nie znaleziony dla tej daty" });
  }
});

// 2. Logika sprawdzania strzału
app.post("/api/guess", guessLimiter, (req, res) => {
  const { date, guess } = req.body;
  if (typeof guess !== "number" || guess <= 0) {
    return res
      .status(400)
      .json({ error: "Nieprawidłowy typ lub wartość strzału" });
  }
  if (!mockProduct[date]) {
    return res
      .status(404)
      .json({ error: "Produkt nie znaleziony dla tej daty" });
  }
  const productData = mockProduct[date];
  const productInstance = new Product(
    productData.id,
    productData.name,
    productData.image,
    productData.price,
  );
  const { minYellow, maxYellow } = productInstance.scopeYellowGuess();
  const guessLogicInstance = new GuessLogic(
    productData.price,
    minYellow,
    maxYellow,
  );
  const result = guessLogicInstance.checkGuess(guess);
  res.json(result);
});

app.use((err, req, res, next) => {
  console.error("Bład serwera:", err.stack);

  // Zwracamy ładny JSON, zamiast wywalać cały serwer
  res.status(500).json({
    error: "Wystąpił wewnętrzny błąd serwera. Spróbuj ponownie później.",
  });
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Backend działa na porcie ${PORT}`));

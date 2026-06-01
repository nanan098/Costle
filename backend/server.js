const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const GuessLogic = require("./guessLogic");
const { getProductFromDatabase } = require("./databaseService");
const { szyfrujToken, odszyfrujToken } = require("./jwt");

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
  windowMs: 20 * 1000, // Okno czasowe: 20 sekund
  max: 10, // Maksymalnie 10 strzały w tym oknie
  message: {
    status: 429,
    error: "Zgadywałeś za szybko! Możesz podać tylko 10 liczby na 20 sekund.",
  },
  standardHeaders: true, // Zwraca informacje o limicie w nagłówkach RateLimit-*
  legacyHeaders: false, // Wyłącza stare nagłówki X-RateLimit-*
});
/**
 * Calculate the yellow hint range by +/-10% of the target price.
 * "Yellow" means the guessed price is close but not exact.
 */
const scopeYellowGuess = (price) => {
  const minYellow = Math.floor(price * 0.9);
  const maxYellow = Math.ceil(price * 1.1);
  return { minYellow, maxYellow };
};

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// 1. Pobieranie danych o produkcie dnia
app.post("/api/product", async (req, res) => {
  const dateProduct = req.body.date;
  const categoryProduct = req.body.category;
  if (typeof dateProduct !== "string" || typeof categoryProduct !== "string") {
    return res
      .status(400)
      .json({ error: "Nieprawidłowy typ danych dla daty lub kategorii" });
  }

  const requestedDate = new Date(dateProduct);
  if (isNaN(requestedDate.getTime())) {
    return res.status(400).json({ error: "Nieprawidłowa data" });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  requestedDate.setHours(0, 0, 0, 0);
  if (requestedDate > today) {
    return res
      .status(400)
      .json({ error: "Nie można brać produktów z przyszłości :)" });
  }

  let products;
  try {
    products = await getProductFromDatabase(categoryProduct, dateProduct);
  } catch (err) {
    console.error("Błąd podczas pobierania produktów z bazy danych:", err);
    return res.status(502).json({ error: "Błąd połączenia z bazą danych" });
  }

  if (!products || products.length === 0) {
    return res
      .status(404)
      .json({ error: "Produkt nie znaleziony dla tej daty" });
  }

  try {
    const productData = products[0];
    const price = productData.price;
    const { minYellow, maxYellow } = scopeYellowGuess(price);
    const encryptedToken = await szyfrujToken(price, minYellow, maxYellow, 0);
    productData.encryptedToken = encryptedToken;
    delete productData.price;
    return res.json(productData);
  } catch (err) {
    console.error("Błąd szyfrowania tokena produktu:", err);
    return res.status(500).json({ error: "Błąd przetwarzania produktu" });
  }
});

// 2. Logika sprawdzania strzału
app.post("/api/guess", guessLimiter, async (req, res) => {
  const { encryptedToken, guess } = req.body;

  if (typeof encryptedToken !== "string") {
    return res.status(400).json({ error: "Brak zaszyfrowanego tokena" });
  }
  if (typeof guess !== "number" || guess <= 0) {
    return res
      .status(400)
      .json({ error: "Nieprawidłowy typ lub wartość strzału" });
  }

  let decrypted;
  try {
    decrypted = await odszyfrujToken(encryptedToken);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Błąd tokena" });
  }

  const { cena, minYellow, maxYellow, attemptNumber } = decrypted;
  if (attemptNumber > 5) {
    return res
      .status(429)
      .json({ error: "Przekroczono limit prób", targetPrice: cena });
  }

  try {
    const guessLogic = new GuessLogic(cena, minYellow, maxYellow);
    const guessResult = guessLogic.checkGuess(guess);
    const responsePayload = { ...guessResult };

    const newEncryptedToken = await szyfrujToken(
      cena,
      minYellow,
      maxYellow,
      attemptNumber,
    );
    responsePayload.encryptedToken = newEncryptedToken;

    if (guessResult.status !== "green" && attemptNumber >= 5) {
      responsePayload.targetPrice = cena;
    }

    return res.json(responsePayload);
  } catch (err) {
    console.error("Błąd podczas przetwarzania strzału:", err);
    return res.status(500).json({ error: "Błąd przetwarzania strzału" });
  }
});

app.use((err, req, res, next) => {
  console.error("Bład serwera:", err.stack);
  res.status(500).json({
    error: "Wystąpił wewnętrzny błąd serwera. Spróbuj ponownie później.",
  });
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Backend działa na porcie ${PORT}`));

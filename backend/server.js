const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Pozwól na żądania tylko z Twojego frontendu
    methods: ["GET", "POST"], // Określ dozwolone metody
    allowedHeaders: ["Content-Type"], // I nagłówki
  }),
);

const Product = require("./product");
const GuessLogic = require("./guessLogic");

const mockProduct = {
  "2026-05-18": {
    id: 1,
    name: "Majonez (1L)",
    image: "majo.png",
    price: 7.5,
  },
  "2026-05-17": {
    id: 2,
    name: "Pizza Guseppe",
    image: "pizza.png",
    price: 12.3,
  },
  "2026-05-16": {
    id: 3,
    name: "Wojanek (0.5L)",
    image: "wojanek.png",
    price: 4,
  },
};

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// 1. Pobieranie danych o produkcie dnia
app.post("/api/product", (req, res) => {
  const dateProduct = req.body.date;
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
app.post("/api/guess", (req, res) => {
  const { date, guess, attemptNumber } = req.body;
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
  if (result.status !== "green" && attemptNumber >= 5) {
    result.correctPrice = productData.price;
  }
  res.json(result);
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Backend działa na porcie ${PORT}`));

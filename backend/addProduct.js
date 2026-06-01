const MongoClient = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();
const dbUrl = process.env.DATABASE_URL;
const client = new MongoClient(dbUrl);

const mockProduct = [
  {
    name: "Majonez (1L)",
    category: "Spożywcze",
    image: "majo.png",
    price: 7.5,
    releaseDate: "2026-05-18",
  },
  {
    name: "Pizza Guseppe",
    category: "Spożywcze",
    image: "pizza.png",
    price: 12.3,
    releaseDate: "2026-05-17",
  },
  {
    name: "Wojanek (0.5L)",
    category: "Spożywcze",
    image: "wojanek.png",
    price: 4,
    releaseDate: "2026-05-16",
  },
];

async function connectToDatabase() {
  try {
    await client.connect();
    const db = client.db("Costle");
    const col = db.collection("Products");
    console.log("Połączono z bazą danych");
  } catch (err) {
    console.error("Błąd połączenia z bazą danych:", err);
  }
}

async function addProductsToDatabase() {
  try {
    const db = client.db("Costle");
    const col = db.collection("Products");
    const p = await col.insertMany(mockProduct);
    console.log("Produkty zostały dodane do bazy danych", p);
  } catch (err) {
    console.error("Błąd podczas dodawania produktów do bazy danych:", err);
  } finally {
    await client.close();
  }
}

addProductsToDatabase();

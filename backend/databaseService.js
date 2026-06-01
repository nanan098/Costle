const { MongoClient } = require("mongodb");

const dbUrl = process.env.DATABASE_URL;
const client = new MongoClient(dbUrl, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
});
let clientPromise = null;

/**
 * Ensure a MongoDB client is connected and reused.
 * If the first connection attempt fails, the promise is reset so the next call
 * can retry.
 */
async function connectClient() {
  if (!clientPromise) {
    clientPromise = client.connect().catch((error) => {
      clientPromise = null;
      throw error;
    });
  }
  await clientPromise;
}

/**
 * Query products by category and release date.
 * @param {string} category - Nazwa kategorii produktu.
 * @param {string} date - Data w formacie YYYY-MM-DD.
 * @returns {Promise<Array>} Lista dokumentów produktów.
 */
async function getProductFromDatabase(category, date) {
  await connectClient();

  try {
    const db = client.db("Costle");
    const col = db.collection("Products");
    const products = await col.find({ category, releaseDate: date }).toArray();
    console.log("Produkt został pobrany z bazy danych");
    return products;
  } catch (err) {
    console.error("Błąd podczas pobierania produktów z bazy danych:", err);
    throw err;
  }
}

exports.getProductFromDatabase = getProductFromDatabase;

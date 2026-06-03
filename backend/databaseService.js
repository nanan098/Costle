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
    return products;
  } catch (err) {
    console.error("Błąd podczas pobierania produktów z bazy danych:", err);
    throw err;
  }
}

async function getOldestReleaseDate(category) {
  await connectClient();

  try {
    const db = client.db("Costle");
    const col = db.collection("Products");
    const oldest = await col
      .find({ category })
      .sort({ releaseDate: 1 })
      .limit(1)
      .project({ releaseDate: 1, _id: 0 })
      .toArray();

    return oldest.length === 0 ? null : oldest[0].releaseDate;
  } catch (err) {
    console.error("Błąd podczas pobierania najstarszej daty:", err);
    throw err;
  }
}

exports.getProductFromDatabase = getProductFromDatabase;
exports.getOldestReleaseDate = getOldestReleaseDate;

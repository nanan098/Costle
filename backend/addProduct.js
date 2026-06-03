const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env.local") });
const dbUrl = process.env.DATABASE_URL;
const client = new MongoClient(dbUrl, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
});

const products = [
  {
    name: "Black Classic (0.5L)",
    category: "Spożywcze",
    image: "black_classic.png",
    price: 3.8,
    releaseDate: "",
  },
  {
    name: "Garage (0.4L)",
    category: "Spożywcze",
    image: "garage.png",
    price: 6.5,
    releaseDate: "",
  },
  {
    name: "Jajka (10 sztuk)",
    category: "Spożywcze",
    image: "jajka.png",
    price: 11,
    releaseDate: "",
  },
  {
    name: "Makaron Lubella muszelki (400g)",
    category: "Spożywcze",
    image: "makaron_lubella_muszelki.png",
    price: 5.5,
    releaseDate: "",
  },
  {
    name: "Jacobs Crema Gold (200g)",
    category: "Spożywcze",
    image: "jacobs_crema_gold.png",
    price: 29.9,
    releaseDate: "",
  },
  {
    name: "Jeżyki",
    category: "Spożywcze",
    image: "jeżyki.png",
    price: 6.2,
    releaseDate: "",
  },
  {
    name: "Cukier (1kg)",
    category: "Spożywcze",
    image: "cukier.png",
    price: 3.2,
    releaseDate: "",
  },
  {
    name: "Mleko 2% (1L)",
    category: "Spożywcze",
    image: "mleko.png",
    price: 4.4,
    releaseDate: "",
  },
  {
    name: "Coca-Cola Zero (0.5L)",
    category: "Spożywcze",
    image: "coca_cola_zero.png",
    price: 5.5,
    releaseDate: "",
  },
  {
    name: "Grappa Ice (1l)",
    category: "Spożywcze",
    image: "grappa_ice.png",
    price: 5,
    releaseDate: "",
  },
];

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

async function connectToDatabase() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db("Costle");
}

async function getLastReleaseDateForCategory(category) {
  const db = await connectToDatabase();
  const col = db.collection("Products");
  const lastProduct = await col
    .find({ category })
    .sort({ releaseDate: -1 })
    .limit(1)
    .project({ releaseDate: 1 })
    .toArray();

  return lastProduct.length === 0 ? null : lastProduct[0].releaseDate;
}

async function assignReleaseDates(inputProducts) {
  const nextDateByCategory = new Map();
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (const product of inputProducts) {
    const category = product.category;
    if (!nextDateByCategory.has(category)) {
      const lastReleaseDate = await getLastReleaseDateForCategory(category);
      const startDate = lastReleaseDate
        ? addDays(new Date(lastReleaseDate), 1)
        : now;
      nextDateByCategory.set(category, startDate);
    }

    const currentDate = nextDateByCategory.get(category);
    product.releaseDate = formatDate(currentDate);
    nextDateByCategory.set(category, addDays(currentDate, 1));
  }

  return inputProducts;
}

async function addProductsToDatabase() {
  try {
    const db = await connectToDatabase();
    const col = db.collection("Products");
    const productsWithDates = await assignReleaseDates(products);
    const result = await col.insertMany(productsWithDates);
    console.log("Produkty zostały dodane do bazy danych", result.insertedCount);
  } catch (err) {
    console.error("Błąd podczas dodawania produktów do bazy danych:", err);
  } finally {
    await client.close();
  }
}

addProductsToDatabase();

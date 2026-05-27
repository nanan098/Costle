const Product = require("./databaseForm");

/**
 * Dodaje nowy produkt do bazy danych
 * @param {Object} productData - Obiekt z danymi produktu (name, price, category, releaseDate)
 */
async function createProduct(productData) {
  try {
    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    return savedProduct;
  } catch (error) {
    console.error("Błąd podczas dodawania produktu:", error);
    throw error;
  }
}

/**
 * Wyciąga produkt z bazy na podstawie wybranej kategorii i daty
 * @param {string} categoryName - Nazwa kategorii
 * @param {Date} releaseDate - Data wydania
 */
async function getProduct(categoryName, releaseDate) {
  try {
    // Szukamy produktów pasujących do kategorii i daty
    const products = await Product.find({
      category: categoryName,
      releaseDate: releaseDate,
    });

    if (products.length === 0)
      throw new Error("Nie znaleziono produktu dla tej kategorii i daty");
    return products[0];
  } catch (error) {
    console.error("Błąd podczas pobierania losowego produktu:", error);
    throw error;
  }
}

// Eksportujemy funkcje, żeby można było ich użyć w innych plikach
module.exports = {
  createProduct,
  getProduct,
};

class Product {
  /**
   * Tworzy nowy produkt.
   * @param {number} id
   * @param {string} name
   * @param {string} image
   * @param {number} price
   */
  constructor(id, name, image, price) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.price = price;
  }
  /**
   * Zwraca zakres żółtego strzału.
   * @returns {Object} Obiekt zawierający minimalną i maksymalną cenę żółtego strzału.
   */
  scopeYellowGuess() {
    const minYellow = Math.floor(this.price * 0.9);
    const maxYellow = Math.ceil(this.price * 1.1);
    return { minYellow, maxYellow };
  }
}

module.exports = Product;

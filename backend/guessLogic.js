class GuessLogic {
  /**
   * Tworzy instancję klasy GuessLogic.
   * @param {number} winningPrice
   * @param {number} minYellow
   * @param {number} maxYellow
   */
  constructor(winningPrice, minYellow, maxYellow) {
    this.guesses = [];
    this.winningPrice = winningPrice;
    this.minYellow = minYellow;
    this.maxYellow = maxYellow;
  }
  /**
   * Sprawdza strzał użytkownika i zwraca kolor strzału oraz strzałkę.
   * @param {number} guess - Strzał użytkownika.
   * @returns {Dictionary} .color ("green", "yellow" lub "red") .arrow ("up" lub "down").
   */
  checkGuess(guess) {
    this.guesses.push(guess);
    if (guess === this.winningPrice) {
      return { price: guess, status: "green", direction: null };
    }
    if (guess >= this.minYellow && guess < this.winningPrice) {
      return { price: guess, status: "yellow", direction: "up" };
    }
    if (guess <= this.maxYellow && guess > this.winningPrice) {
      return { price: guess, status: "yellow", direction: "down" };
    }
    if (guess < this.minYellow) {
      return { price: guess, status: "red", direction: "up" };
    }
    if (guess > this.maxYellow) {
      return { price: guess, status: "red", direction: "down" };
    }
  }
  /**
   * Zwraca historię wszystkich strzałów.
   * @returns {number[]} Tablica z historią strzałów.
   */
  getGuesses() {
    return this.guesses;
  }
}

module.exports = GuessLogic;

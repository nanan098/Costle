class GuessLogic {
  /**
   * Tworzy instancję klasy GuessLogic.
   * @param {number} winningPrice
   * @param {number} minYellow
   * @param {number} maxYellow
   */
  constructor(winningPrice, minYellow, maxYellow, attemptNumber) {
    this.winningPrice = winningPrice;
    this.minYellow = minYellow;
    this.maxYellow = maxYellow;
  }
  /**
   * Sprawdza strzał użytkownika i zwraca kolor strzału oraz strzałkę.
   * @param {number} guess - Strzał użytkownika.
   * @returns {Dictionary} .try(number) .color ("green", "yellow" lub "red") .arrow ("up" lub "down").
   */
  checkGuess(guess) {
    if (guess === this.winningPrice) {
      return {
        price: guess,
        status: "green",
        direction: "perfect",
      };
    }
    if (guess >= this.minYellow && guess < this.winningPrice) {
      return {
        price: guess,
        status: "yellow",
        direction: "up",
      };
    }
    if (guess <= this.maxYellow && guess > this.winningPrice) {
      return {
        price: guess,
        status: "yellow",
        direction: "down",
      };
    }
    if (guess < this.minYellow) {
      return {
        price: guess,
        status: "red",
        direction: "up",
      };
    }
    if (guess > this.maxYellow) {
      return {
        price: guess,
        status: "red",
        direction: "down",
      };
    }
  }
}

module.exports = GuessLogic;

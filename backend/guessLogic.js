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
   * @returns {Dictionary} .try(number) .color ("green", "yellow" lub "red") .arrow ("up" lub "down").
   */
  checkGuess(guess) {
    this.guesses.push(guess);
    if (guess === this.winningPrice) {
      return {
        try: this.guesses.length,
        price: guess,
        status: "green",
        direction: "perfect",
      };
    }
    if (guess >= this.minYellow && guess < this.winningPrice) {
      return {
        try: this.guesses.length,
        price: guess,
        status: "yellow",
        direction: "up",
      };
    }
    if (guess <= this.maxYellow && guess > this.winningPrice) {
      return {
        try: this.guesses.length,
        price: guess,
        status: "yellow",
        direction: "down",
      };
    }
    if (guess < this.minYellow) {
      return {
        try: this.guesses.length,
        price: guess,
        status: "red",
        direction: "up",
      };
    }
    if (guess > this.maxYellow) {
      return {
        try: this.guesses.length,
        price: guess,
        status: "red",
        direction: "down",
      };
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

import type { Attempt } from "../types/index.ts";

// Wysyła strzał do backendu i aktualizuje stan gry
export const handleGuess = (
  guess: string,
  date: string,
  attempts: Attempt[],
  setAttempts: (attempts: Attempt[]) => void,
  setIsGameOver: (isGameOver: boolean) => void,
  setShowResultScreen: (showResultScreen: boolean) => void,
  setTargetPrice: (targetPrice: number) => void,
  setGuess: (guess: string) => void,
) => {
  if (!guess) return;
  const price = parseFloat(guess);
  fetch("http://localhost:8080/api/guess", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      date: date,
      guess: price,
      attemptNumber: attempts.length + 1,
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Błąd serwera");
      return response.json();
    })
    .then((data) => {
      const nextAttempts = [data, ...attempts];
      setAttempts(nextAttempts);
      if (typeof data.correctPrice === "number") {
        setTargetPrice(data.correctPrice);
      }

      if (data.status === "green") {
        setIsGameOver(true);
        setShowResultScreen(true);
      } else {
        setGuess("");
        if (nextAttempts.length >= 5) {
          setIsGameOver(true);
          setShowResultScreen(true);
        }
      }
    })
    .catch((error) => {
      console.error("Błąd podczas wysyłania strzału:", error);
    });
};

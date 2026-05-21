import type { Attempt } from "../types/index.ts";
import type { Dispatch, SetStateAction } from "react";

// Wysyła strzał do backendu i aktualizuje stan gry dla konkretnego dnia
export const handleGuess = (
  guess: string,
  date: string,
  attempts: Attempt[],
  setAttemptsByDate: Dispatch<SetStateAction<Record<string, Attempt[]>>>,
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
      setAttemptsByDate((prev) => ({
        ...prev,
        [date]: nextAttempts,
      }));

      if (typeof data.correctPrice === "number") {
        setTargetPrice(data.correctPrice);
      }

      if (data.status === "green" || nextAttempts.length >= 5) {
        setShowResultScreen(true);
      } else {
        setGuess("");
      }
    })
    .catch((error) => {
      console.error("Błąd podczas wysyłania strzału:", error);
    });
};

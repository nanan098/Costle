import type { Attempt } from "../types/index.ts";
import type { Dispatch, SetStateAction } from "react";
import { API_URL } from "../config/api";

/**
 * Submit a guess to the backend and update the UI state.
 * The backend returns guess feedback, a refreshed encrypted token, and
 * optionally the target price when the attempt limit is reached.
 */
export const handleGuess = (
  guess: string,
  date: string,
  encryptedToken: string,
  attempts: Attempt[],
  setAttemptsByDate: Dispatch<SetStateAction<Record<string, Attempt[]>>>,
  setShowResultScreen: (showResultScreen: boolean) => void,
  setGuess: (guess: string) => void,
  setTargetPrice: (targetPrice: number) => void,
  setErrorMessage: Dispatch<SetStateAction<string | null>>,
  setEncryptedToken: (token: string) => void,
) => {
  const price = parseFloat(guess);

  if (!guess || Number.isNaN(price) || price <= 0) {
    setErrorMessage("Wpisz poprawną cenę większą niż 0.");
    return;
  }

  setErrorMessage(null);

  fetch(`${API_URL}/guess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      date: date,
      guess: price,
      encryptedToken: encryptedToken,
    }),
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Błąd serwera");
      }
      return data;
    })
    .then((data) => {
      if (typeof data.encryptedToken === "string") {
        setEncryptedToken(data.encryptedToken);
      }

      const nextAttempts = [data, ...attempts];
      setAttemptsByDate((prev) => ({
        ...prev,
        [date]: nextAttempts,
      }));

      if (data.targetPrice !== undefined) {
        setTargetPrice(data.targetPrice);
      }

      if (data.status === "green" || nextAttempts.length >= 5) {
        setShowResultScreen(true);
      } else {
        setGuess("");
      }
    })
    .catch((error) => {
      console.error("Błąd podczas wysyłania strzału:", error);
      setErrorMessage(error.message);
    });
};

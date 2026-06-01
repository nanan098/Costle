import type { Dispatch, SetStateAction } from "react";

/**
 * Fetch product metadata from the backend for the selected date.
 * Also updates UI state for loading, error, and token values.
 * @param {string} date
 * @param {string} category
 * @param {function(string): void} setName
 * @param {function(string): void} setImage
 * @param {function(string): void} setEncryptedToken
 * @param {function(string|null): void} setErrorMessage
 * @param {function(boolean): void} setLoading
 */
export const getProduct = async (
  date: string,
  category: string,
  setName: (name: string) => void,
  setImage: (image: string) => void,
  setEncryptedToken: (token: string) => void,
  setErrorMessage: Dispatch<SetStateAction<string | null>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
) => {
  setLoading(true);
  setErrorMessage(null);

  try {
    const response = await fetch("http://localhost:8080/api/product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: date,
        category: category,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Błąd podczas pobierania produktu");
    }

    setName(data.name);
    setImage(data.image);
    setEncryptedToken(data.encryptedToken);
  } catch (error) {
    console.error("Błąd podczas pobierania produktu:", error);
    setErrorMessage(
      error instanceof Error
        ? error.message
        : "Błąd podczas pobierania produktu",
    );
    setName("");
    setImage("");
    setEncryptedToken("");
    throw error;
  } finally {
    setLoading(false);
  }
};

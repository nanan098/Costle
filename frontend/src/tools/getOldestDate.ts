import type { Dispatch, SetStateAction } from "react";
import { API_URL } from "../config/api";

export const getOldestDate = async (
  category: string,
  setError?: Dispatch<SetStateAction<string | null>>,
) => {
  try {
    const response = await fetch(
      `${API_URL}/oldest-date?category=${encodeURIComponent(category)}`,
      {
        method: "GET",
      },
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Błąd podczas pobierania najstarszej daty");
    }

    return data.oldestDate as string | null;
  } catch (error) {
    if (setError && error instanceof Error) {
      setError(error.message);
    }
    throw error;
  }
};

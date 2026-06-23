const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error("Brak zmiennej VITE_API_URL w konfiguracji środowiska");
}

export const API_URL = apiUrl.replace(/\/$/, "");

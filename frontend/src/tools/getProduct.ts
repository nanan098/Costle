// Pobiera obraz i nazwę produktu dnia z backendu
export const getProduct = (
  date: string,
  setName: (name: string) => void,
  setImage: (image: string) => void,
) => {
  fetch("http://localhost:8080/api/product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      date: date,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      setName(data.name);
      setImage(data.image);
    })
    .catch((error) => {
      console.error("Błąd podczas pobierania produktu:", error);
    });
};

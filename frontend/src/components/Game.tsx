import { Share2, ChevronUp, ChevronDown } from "lucide-react";
import React, { useState } from "react";

// Typy danych
interface Attempt {
  price: number;
  status: "red" | "yellow" | "green";
  direction: "up" | "down";
}

export const Game: React.FC = () => {
  const [guess, setGuess] = useState<string>("");
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [name, setName] = useState<string>();
  const [image, setImage] = useState<string>();
  const [date, setDate] = useState<string>("2026-05-17");

  // Pobiera obraz i nazwę produktu dnia z backendu
  React.useEffect(() => {
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
      });
  }, []);

  // Wysyła strzał do backendu i aktualizuje stan gry
  const handleGuess = () => {
    if (!guess) return;
    const price = parseFloat(guess);
    fetch("http://localhost:8080/api/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: date,
        guess: price,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Błąd serwera");
        return response.json();
      })
      .then((data) => {
        if (data.status === "green") {
          setIsGameOver(true);
        } else {
          setAttempts([data, ...attempts]);
          setGuess("");
          if (attempts.length >= 5) setIsGameOver(true);
        }
      })
      .catch((error) => {
        console.error("Błąd podczas wysyłania strzału:", error);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleGuess();
  };

  return (
    <div className="min-h-screen bg-tlo text-glowny font-sans">
      <main className="max-w-md mx-auto p-6 space-y-8">
        {/* Sekcja Produktu */}
        <section className="bg-tlo rounded-3xl p-6 shadow-sm border border-akcent">
          <h3 className="text-sm text-akcent text-center mr-0">
            Brana jest pod uwagę średnia cena
          </h3>
          <div className="aspect-square bg-tlo rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
            <img
              src={image}
              alt="Produkt Dnia"
              className="object-contain w-full h-full p-4 mix-blend-multiply"
            />
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-glowny uppercase tracking-widest mb-1">
              Produkt dnia
            </p>
            <h2 className="text-2xl font-bold text-glowny">{name}</h2>
          </div>
        </section>
        {!isGameOver ? (
          <form onSubmit={handleSubmit} className="flex gap-2 w-full">
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-white border-2 border-glowny rounded-2xl px-6 py-4 text-xl font-bold focus:outline-none focus:border-glowny transition-colors shadow-inner"
            />
            <button
              type="submit"
              className="bg-glowny hover:bg-glowny text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-glowny transition-all active:scale-95"
            >
              STRZAŁ
            </button>
          </form>
        ) : (
          <button className="w-full bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-transform active:scale-95">
            <Share2 size={20} /> UDOSTĘPNIJ WYNIK
          </button>
        )}

        {/* Historia Strzałów */}
        <section className="space-y-3">
          {attempts.map((att, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all animate-in fade-in slide-in-from-bottom-2
                    ${
                      att.status === "green"
                        ? "bg-glowny border-glowny"
                        : att.status === "yellow"
                          ? "bg-yellow-50 border-yellow-400"
                          : "bg-red-50 border-red-300"
                    }`}
            >
              <span className="font-bold text-lg">
                {att.price.toFixed(2)} zł
              </span>
              <div className="flex items-center gap-2 font-medium">
                {att.direction === "up" ? (
                  <ChevronUp className="text-glowny" />
                ) : (
                  <ChevronDown className="text-red-500" />
                )}
                <span>{att.direction === "up" ? "WIĘCEJ" : "MNIEJ"}</span>
              </div>
            </div>
          ))}

          {/* Puste sloty (Placeholder) */}
          {Array.from({ length: Math.max(0, 6 - attempts.length) }).map(
            (_, i) => (
              <div
                key={i}
                className="h-14 border-2 border-dashed border-glowny rounded-2xl"
              />
            ),
          )}
        </section>
      </main>
    </div>
  );
};

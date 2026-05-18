import { Share2 } from "lucide-react";
import React, { useState } from "react";
import { VictoryScreen } from "./VictoryScreen";
import { AttemptsBoard } from "./AttemptsBoard";
import type { Attempt } from "../types";

export const Game: React.FC = () => {
  const [guess, setGuess] = useState<string>("");
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [name, setName] = useState<string>();
  const [image, setImage] = useState<string>();
  const [date] = useState<string>("2026-05-17");
  const hasWon = attempts.some((attempt) => attempt.status === "green");

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
          setAttempts([data, ...attempts]);
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

  const handleCloseVictory = () => {
    setIsGameOver(false);
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
          <button
            type="button"
            className="w-full bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <Share2 size={20} /> UDOSTĘPNIJ WYNIK
          </button>
        )}

        {isGameOver && hasWon && (
          <VictoryScreen attempts={attempts} onClose={handleCloseVictory} />
        )}

        <AttemptsBoard attempts={attempts} />
      </main>
    </div>
  );
};

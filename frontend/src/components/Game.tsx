import { Share2, ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ResultScreen } from "./ResultScreen";
import { AttemptsBoard } from "./AttemptsBoard";
import type { AttemptsByDate } from "../types";
import { handleShare } from "../tools/handleShare";
import { handleGuess } from "../tools/handle.Guess";
import { getProduct } from "../tools/getProduct";
import { handleDateSwipe } from "../tools/handleDateSwipe";

export const Game: React.FC = () => {
  const [guess, setGuess] = useState<string>("");
  const [attemptsByDate, setAttemptsByDate] = useState<AttemptsByDate>({});
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [name, setName] = useState<string>();
  const [image, setImage] = useState<string>();
  const [targetPrice, setTargetPrice] = useState<number | undefined>(undefined);
  const [date, setDate] = useState<string>("2026-05-18");
  const currentAttempts = attemptsByDate[date] ?? [];
  const hasWon = currentAttempts.some((attempt) => attempt.status === "green");

  useEffect(() => {
    getProduct(date, setName, setImage);
  }, [date]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleGuess(
      guess,
      date,
      currentAttempts,
      setAttemptsByDate,
      setShowResultScreen,
      setTargetPrice,
      setGuess,
    );
  };

  const handleCloseResult = () => {
    setShowResultScreen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center gap-4 bg-gray-100 text-glowny font-sans px-4 py-8">
      <div className="w-full max-w-md min-w-0">
        <main className="bg-tlo p-6 space-y-8 rounded-3xl shadow-sm border border-akcent">
          {/* Sekcja Produktu */}
          <section className="bg-tlo rounded-3xl p-6 shadow-sm border border-akcent flex flex-row items-center">
            <div className="h-10 w-10 flex items-center justify-center">
              {date !== "2026-05-16" ? (
                <ArrowLeft
                  className="h-10 w-10 text-akcent cursor-pointer"
                  onClick={() =>
                    handleDateSwipe("left", date, setDate, setGuess)
                  }
                />
              ) : (
                <div className="h-10 w-10" />
              )}
            </div>
            <div>
              <h3 className="text-sm text-akcent text-center font-semibold uppercase tracking-wide">
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
                <p className="text-xl font-bold text-glowny uppercase tracking-widest">
                  Produkt dnia
                </p>
                <p className="text-sm">{date}</p>
                <h2 className="text-2xl font-bold text-glowny mt-3 mb-3">
                  {name}
                </h2>
              </div>
            </div>
            <div className="h-10 w-10 flex items-center justify-center">
              {date !== "2026-05-18" ? (
                <ArrowRight
                  className="h-10 w-10 text-akcent cursor-pointer"
                  onClick={() =>
                    handleDateSwipe("right", date, setDate, setGuess)
                  }
                />
              ) : (
                <div className="h-10 w-10" />
              )}
            </div>
          </section>
          {!hasWon && currentAttempts.length < 5 ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 w-full"
            >
              <input
                id="guess"
                type="number"
                step="0.1"
                min="0.1"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="0.00"
                className="flex-1 min-w-0 bg-white border-2 border-glowny rounded-2xl px-6 py-4 text-xl font-bold focus:outline-none focus:border-glowny transition-colors shadow-inner"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-glowny hover:bg-glowny text-white font-bold py-4 px-6 sm:px-8 rounded-2xl shadow-lg shadow-glowny transition-all active:scale-95"
              >
                STRZAŁ
              </button>
            </form>
          ) : hasWon ? (
            <button
              type="button"
              onClick={() => handleShare(currentAttempts)}
              className="w-full bg-akcent text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-transform active:scale-95"
            >
              <Share2 size={20} /> UDOSTĘPNIJ WYNIK
            </button>
          ) : (
            <div className="w-full rounded-2xl border border-glowny bg-green -50 px-6 py-4 text-center text-sm font-semibold text-glowny">
              Niestety, nie tym razem!
            </div>
          )}

          {showResultScreen && (hasWon || currentAttempts.length >= 5) && (
            <ResultScreen
              attempts={currentAttempts}
              isWin={hasWon}
              targetPrice={targetPrice}
              onClose={handleCloseResult}
            />
          )}

          <AttemptsBoard attempts={currentAttempts} />
        </main>
      </div>
    </div>
  );
};

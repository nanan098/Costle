import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ResultScreen } from "./ResultScreen";
import { AttemptsBoard } from "./AttemptsBoard";
import { CookieConsentBanner } from "./CookieConsentBanner";
import type { AttemptsByDate } from "../types";
import { handleGuess } from "../tools/handleGuess";
import { getProduct } from "../tools/getProduct";
import { getOldestDate } from "../tools/getOldestDate";
import { handleDateSwipe } from "../tools/handleDateSwipe";

export const Game: React.FC = () => {
  const [guess, setGuess] = useState<string>("");
  const [attemptsByDate, setAttemptsByDate] = useState<AttemptsByDate>({});
  const [showResultScreen, setShowResultScreen] = useState(false);
  const category = "Spożywcze";
  const [targetPrice, setTargetPrice] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [encryptedToken, setEncryptedToken] = useState<string>("");
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [oldestDate, setOldestDate] = useState<string | null>(null);
  const [date, setDate] = useState<string>(todayIso);
  const [requestedDate, setRequestedDate] = useState<string>(todayIso);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const currentAttempts = attemptsByDate[date] ?? [];
  const hasWon = currentAttempts.some((attempt) => attempt.status === "green");
  const canSwipeLeft = oldestDate !== null && date > oldestDate;
  const canSwipeRight = date < todayIso;

  useEffect(() => {
    setTargetPrice(0);
    setErrorMessage(null);
    setShowResultScreen(false);
    setGuess("");

    getProduct(
      requestedDate,
      category,
      setName,
      setImage,
      setEncryptedToken,
      setErrorMessage,
      setLoadingProduct,
    )
      .then(() => {
        setDate(requestedDate);
      })
      .catch(() => {
        // Błąd już wyświetlony w setErrorMessage; nie zmieniamy daty.
      });
  }, [requestedDate, category]);

  useEffect(() => {
    getOldestDate(category)
      .then((oldest) => {
        if (oldest) {
          setOldestDate(oldest);
        }
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania najstarszej daty:", error);
      });
  }, [category]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleGuess(
      guess,
      date,
      encryptedToken,
      currentAttempts,
      setAttemptsByDate,
      setShowResultScreen,
      setGuess,
      setTargetPrice,
      setErrorMessage,
      setEncryptedToken,
    );
  };

  const handleCloseResult = () => {
    setShowResultScreen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center gap-4 bg-surface text-akcent font-sans">
      <div className="w-full max-w-md min-w-0">
        <CookieConsentBanner />
        <main className="bg-tlo p-6 space-y-8 border border-border shadow-sm">
          <section className="flex flex-row items-center">
            <div className="h-10 w-10 flex items-center justify-center shrink-0">
              {canSwipeLeft ? (
                <ArrowLeft
                  className={`h-8 w-8 ${loadingProduct ? "opacity-40 cursor-not-allowed" : "text-akcent/60 cursor-pointer hover:text-akcent transition-colors"}`}
                  onClick={() =>
                    !loadingProduct &&
                    canSwipeLeft &&
                    handleDateSwipe("left", date, setRequestedDate, setGuess)
                  }
                />
              ) : (
                <div className="h-10 w-10" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs text-akcent/70 text-center font-medium uppercase tracking-wide">
                Brana jest pod uwagę średnia cena
              </h3>
              <div className="aspect-square bg-surface rounded-xl my-4 flex items-center justify-center overflow-hidden border border-border">
                {loadingProduct ? (
                  <div className="flex h-full w-full items-center justify-center text-slate-500 text-sm font-medium">
                    Ładowanie...
                  </div>
                ) : (
                  <img
                    src={image}
                    alt="Produkt Dnia"
                    className="object-contain w-full h-full p-4 mix-blend-multiply"
                  />
                )}
              </div>

              <div className="text-center">
                <p className="text-xs font-semibold text-glowny uppercase tracking-wide">
                  Produkt dnia
                </p>
                <p className="text-sm text-akcent/60 mt-0.5">{date}</p>
                <h2 className="text-2xl font-bold text-akcent mt-2 mb-1 leading-snug">
                  {name}
                </h2>
              </div>
            </div>
            <div className="h-10 w-10 flex items-center justify-center shrink-0">
              {canSwipeRight ? (
                <ArrowRight
                  className={`h-8 w-8 ${loadingProduct ? "opacity-40 cursor-not-allowed" : "text-akcent/60 cursor-pointer hover:text-akcent transition-colors"}`}
                  onClick={() =>
                    !loadingProduct &&
                    canSwipeRight &&
                    handleDateSwipe("right", date, setRequestedDate, setGuess)
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
                className="flex-1 min-w-0 bg-tlo border border-border rounded-xl px-5 py-3.5 text-xl font-semibold text-akcent placeholder:text-akcent/30 focus:outline-none focus:border-glowny focus:ring-2 focus:ring-glowny/20 transition-colors"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-glowny hover:bg-glowny-hover text-white font-semibold py-3.5 px-6 sm:px-8 rounded-xl transition-colors"
              >
                Strzał
              </button>
            </form>
          ) : hasWon ? (
            <div className="w-full rounded-xl border border-glowny/40 bg-green-50 px-6 py-4 text-center text-sm font-medium text-akcent">
              Gratulacje! Zgadłeś produkt!
            </div>
          ) : (
            <div className="w-full rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-center text-sm font-medium text-red-800">
              Niestety, nie tym razem!
            </div>
          )}

          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
              {errorMessage}
            </div>
          )}

          {showResultScreen && (hasWon || currentAttempts.length >= 5) && (
            <ResultScreen
              attempts={currentAttempts}
              isWin={hasWon}
              targetPrice={targetPrice}
              onClose={handleCloseResult}
              name={name}
            />
          )}

          <AttemptsBoard attempts={currentAttempts} />

          <div className="mt-6 text-center text-sm text-akcent/50 space-y-2">
            <p className="space-x-2">
              <a
                href="/Polityka_prywatnosci.pdf"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 transition hover:text-glowny"
              >
                Polityka prywatności
              </a>
              <span>·</span>
              <a
                href="/Regulamin.pdf"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 transition hover:text-glowny"
              >
                Regulamin
              </a>
              <span>·</span>
              <a
                href="mailto:snap.rescue00@gmail.com"
                className="underline underline-offset-2 transition hover:text-glowny"
              >
                Zgłoś błąd
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

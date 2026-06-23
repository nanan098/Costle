import React, { useCallback, useEffect, useRef, useState } from "react";
import { Share2 } from "lucide-react";
import type { Attempt } from "../types";
import { directionalLabel } from "./directionalLabel";
import { handleShare } from "../tools/handleShare";
import confetti from "canvas-confetti";

export const ResultScreen: React.FC<{
  attempts: Attempt[];
  isWin: boolean;
  targetPrice?: number;
  onClose: () => void;
  name: string;
}> = ({ attempts, isWin, targetPrice, onClose, name }) => {
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [isPreparingShare, setIsPreparingShare] = useState(false);

  const showShare = useCallback(async () => {
    if (!resultRef.current) return;

    setIsPreparingShare(true);
    await new Promise(requestAnimationFrame);

    try {
      await handleShare(attempts, name, resultRef.current);
    } finally {
      setIsPreparingShare(false);
    }
  }, [attempts, name]);

  const pokazKonfetti = useCallback(() => {
    const glownyKolor = "#1a9b4a";

    const wspolneUstawienia = {
      particleCount: 150,
      spread: 65,
      angle: 90,
      startVelocity: 70,
      colors: [glownyKolor],
      zIndex: 9999,
    };

    confetti({
      ...wspolneUstawienia,
      origin: { x: 0.2, y: 1 },
    });

    confetti({
      ...wspolneUstawienia,
      origin: { x: 0.8, y: 1 },
    });
  }, []);

  useEffect(() => {
    if (isWin) pokazKonfetti();
  }, [isWin, pokazKonfetti]);

  return (
    <div className="fixed inset-0 z-50 flex min-h-full items-center justify-center bg-akcent/60 overflow-y-auto">
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-tlo p-6 shadow-xl m-4"
        ref={resultRef}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-surface hover:text-akcent"
        >
          ✕
        </button>

        <div className="text-center">
          {isWin ? (
            <>
              <h2 className="mt-2 text-2xl font-bold text-akcent">Klasa!</h2>
              <p className="mt-2 text-sm text-akcent/70">
                Udało Ci się zgadnąć produkt w {attempts.length}{" "}
                {attempts.length === 1 ? "strzale" : "strzałach"}.
              </p>
              <h2 className="mt-3 text-xl font-bold text-glowny">{name}</h2>
            </>
          ) : (
            <>
              <h2 className="mt-2 text-2xl font-bold text-red-700">
                Nie tym razem
              </h2>
              {typeof targetPrice === "number" && (
                <div className="mt-3 text-center mb-4">
                  <p className="mt-3 text-base font-medium text-akcent/70">
                    Prawidłowa cena to:
                  </p>
                  <span className="font-bold text-glowny text-3xl">
                    {targetPrice.toFixed(2)} zł
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {isWin && (
          <div className="my-6">
            <button
              type="button"
              onClick={showShare}
              className={`w-full bg-akcent hover:bg-akcent/90 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 transition-colors text-sm ${isPreparingShare ? "hidden" : ""}`}
            >
              <Share2 size={18} /> Udostępnij wynik
            </button>
          </div>
        )}

        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 flex items-center justify-between text-sm font-medium text-akcent/70">
            <span>Podsumowanie strzałów</span>
            <span className="text-glowny">Wynik</span>
          </div>

          <ul className="space-y-2.5">
            {attempts.map((attempt, index) => {
              const label = directionalLabel(attempt);

              return (
                <li
                  key={`${attempt.price}-${index}`}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-colors ${
                    attempt.status === "green"
                      ? "bg-green-50 border-glowny/50"
                      : attempt.status === "yellow"
                        ? "bg-amber-50 border-amber-300"
                        : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-tlo text-sm font-semibold text-akcent border border-border">
                      {attempts.length - index}
                    </div>
                    <div>
                      <p
                        className={`inline-flex items-center text-sm font-semibold ${label.colorClass}`}
                      >
                        {attempt.price.toFixed(2)} zł
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium uppercase ${
                      attempt.status === "green"
                        ? "text-glowny"
                        : attempt.status === "yellow"
                          ? "text-amber-600"
                          : "text-red-600"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {label.icon}
                      <span>{label.label}</span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

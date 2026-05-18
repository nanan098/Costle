import React from "react";
import { Share2 } from "lucide-react";
import type { Attempt } from "../types";
import { handleShare } from "../tools/handleShare";
import { directionalLabel } from "./directionalLabel";

export const VictoryScreen: React.FC<{
  attempts: Attempt[];
  onClose: () => void;
}> = ({ attempts, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-lg p-4 overflow-auto">
      <div className="relative w-full max-w-md rounded-4xl border border-white/30 bg-white/95 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-sm font-bold text-slate-700 shadow-md transition hover:bg-slate-100"
        >
          ✕
        </button>
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold text-akcent">Klasa</h2>
          <p className="mt-2 text-sm text-slate-600">
            Udało się zgadnąć produkt w {attempts.length} strzałach.
          </p>
        </div>

        <div className="my-6">
          <button
            type="button"
            onClick={() => handleShare(attempts)}
            className="w-full bg-akcent hover:bg-akcent/90 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg shadow-glowny/30 text-sm tracking-wide uppercase"
          >
            <Share2 size={18} /> Udostępnij wynik
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-600">
            <span>Podsumowanie strzałów</span>
            <span className="text-glowny">Wynik</span>
          </div>

          <ul className="space-y-3">
            {attempts.map((attempt, index) => (
              <li
                key={`${attempt.price}-${index}`}
                className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                  attempt.status === "green"
                    ? "bg-glowny border-glowny"
                    : attempt.status === "yellow"
                      ? "bg-yellow-50 border-yellow-400"
                      : "bg-red-50 border-red-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-sm font-bold text-slate-900 shadow-sm">
                    {attempts.length - index}
                  </div>
                  <div>
                    <p
                      className={`inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-semibold ${directionalLabel(attempt).colorClass}`}
                    >
                      {attempt.price.toFixed(2)} zł
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase shadow-sm ${
                    attempt.status === "green"
                      ? "bg-green-50 text-glowny"
                      : attempt.status === "yellow"
                        ? "bg-yellow-50 text-yellow-400"
                        : "bg-red-50 text-red-500"
                  }`}
                >
                  {(() => {
                    const label = directionalLabel(attempt);
                    return (
                      <span className="flex items-center gap-1">
                        {label.icon}
                        <span>{label.label}</span>
                      </span>
                    );
                  })()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

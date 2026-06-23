import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-akcent/40 p-4">
      <div
        className={`relative w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-tlo p-6 text-akcent shadow-xl transition duration-200 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ willChange: "opacity, transform" }}
      >
        <button
          type="button"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-akcent/60 transition hover:bg-surface hover:text-akcent focus:outline-none focus:ring-2 focus:ring-glowny/30"
          onClick={onClose}
          aria-label="Zamknij"
        >
          <X size={18} />
        </button>

        <div className="max-h-[90vh] overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
            <div className="border-b border-border pb-5 text-center">
              <h2 className="text-2xl font-bold text-akcent sm:text-3xl">
                Jak grać w Costle?
              </h2>
            </div>

            <div className="grid gap-4 text-sm leading-6 text-akcent/80 sm:text-base">
              <div className="rounded-xl border border-border bg-surface px-5 py-4 sm:px-6 sm:py-5">
                <p className="font-semibold text-akcent">Cel gry:</p>
                <p className="mt-2">Odgadnij ukrytą cenę produktu.</p>
              </div>

              <div className="rounded-xl border border-border bg-surface px-5 py-4 sm:px-6 sm:py-5">
                <p className="font-semibold text-akcent">Jak grać?</p>
                <p className="mt-2">
                  Masz dokładnie 5 prób, aby odgadnąć prawidłową kwotę.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface px-5 py-4 sm:px-6 sm:py-5">
                <p className="font-semibold text-akcent">
                  Po każdym strzale zobaczysz wskazówkę:
                </p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-xl border border-glowny/40 bg-green-50 px-4 py-3 sm:px-5 sm:py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <span className="font-medium text-glowny">Zielony:</span>
                    </div>
                    <p className="mt-2 text-sm sm:text-base">
                      Idealny strzał! Zgadłeś dokładną cenę i wygrywasz.
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 sm:px-5 sm:py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <span className="font-medium text-amber-700">Żółty (Blisko!):</span>
                    </div>
                    <p className="mt-2 text-sm sm:text-base">
                      Twoja odpowiedź jest w przedziale +/- 10% od prawidłowej
                      ceny.
                    </p>
                  </div>

                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:px-5 sm:py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <span className="font-medium text-red-700">Czerwony (Pudło!):</span>
                    </div>
                    <p className="mt-2 text-sm sm:text-base">
                      Twój strzał jest całkowicie nietrafiony.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface px-5 py-4 sm:px-6 sm:py-5">
                <p className="font-semibold text-akcent">Koniec gry</p>
                <p className="mt-2">
                  Wygrywasz, gdy trafisz w punkt. Przegrywasz, gdy wykorzystasz
                  wszystkie 5 szans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

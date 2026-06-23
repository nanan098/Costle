import React, { useEffect, useState } from "react";
import { Info, DollarSign } from "lucide-react";
import { RulesModal } from "./RulesModal";

const RULES_SHOWN_KEY = "costle_rules_shown";

export const Header: React.FC = () => {
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    try {
      const hasSeenRules = window.localStorage.getItem(RULES_SHOWN_KEY);
      if (!hasSeenRules) {
        setShowRules(true);
        window.localStorage.setItem(RULES_SHOWN_KEY, "true");
      }
    } catch (error) {
      setShowRules(true);
    }
  }, []);

  return (
    <>
      <header className="bg-tlo border-b border-border py-4 px-6 grid grid-cols-3 items-center sticky top-0 z-10">
        <div />
        <div className="flex items-center justify-center gap-2">
          <DollarSign className="size-9 text-glowny shrink-0" strokeWidth={2.25} />
          <h1 className="text-4xl font-bold tracking-tight text-akcent text-center whitespace-nowrap">
            Costle
          </h1>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowRules(true)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-akcent/70 transition-colors hover:bg-surface hover:text-akcent"
            aria-label="Zasady gry"
          >
            <Info size={22} strokeWidth={2} />
          </button>
        </div>
      </header>

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </>
  );
};

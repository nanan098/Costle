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
      <header className="bg-tlo border-b border-akcent py-4 px-6 grid grid-cols-3 items-center sticky top-0 z-10 rounded-2xl">
        <div />
        <div className="flex justify-center">
          <DollarSign className="inline-block size-12 text-glowny" />
          <h1 className="text-5xl font-bold tracking-tight text-glowny text-center whitespace-nowrap">
            Costle
          </h1>
        </div>
        <div className="flex justify-end text-glowny">
          <Info
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowRules(true)}
          />
        </div>
      </header>

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </>
  );
};

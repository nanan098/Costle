import type { Attempt } from "../types";
import { directionalLabel } from "./directionalLabel";

export const AttemptsBoard: React.FC<{ attempts: Attempt[] }> = ({
  attempts,
}) => {
  return (
    <section className="space-y-3">
      {attempts.map((att, index) => {
        const label = directionalLabel(att);
        return (
          <div
            key={index}
            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all animate-in fade-in slide-in-from-bottom-2
                      ${
                        att.status === "green"
                          ? "bg-green-50 border-glowny"
                          : att.status === "yellow"
                            ? "bg-yellow-50 border-yellow-400"
                            : "bg-red-50 border-red-400"
                      }`}
          >
            <span className={`font-bold text-lg ${label.colorClass}`}>
              {att.price.toFixed(2)} zł
            </span>
            <div className="flex items-center gap-2 font-medium">
              <span className={`flex items-center gap-1 ${label.colorClass}`}>
                {label.icon}
                <span>{label.label}</span>
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
};

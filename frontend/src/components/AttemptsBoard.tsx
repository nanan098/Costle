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
            className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors
                      ${
                        att.status === "green"
                          ? "bg-green-50 border-glowny/50"
                          : att.status === "yellow"
                            ? "bg-amber-50 border-amber-300"
                            : "bg-red-50 border-red-200"
                      }`}
          >
            <span className={`font-semibold text-lg ${label.colorClass}`}>
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

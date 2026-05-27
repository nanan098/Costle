import type { Attempt } from "../types";
import { directionalLabel } from "../components/directionalLabel";

export const handleShare = async (attempts: Attempt[]) => {
  const lines = attempts.map((a, index) => {
    const shotNumber = attempts.length - index;
    return `${shotNumber}. ${a.price.toFixed(2)} zł — ${directionalLabel(a).label}`;
  });
  const text = `Moje strzały:\n${lines.join("\n")}`;

  try {
    if ((navigator as any).share) {
      await (navigator as any).share({ title: "Mój wynik w grze", text });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      window.alert("Wynik skopiowany do schowka");
    } else {
      window.alert(text);
    }
  } catch (err) {
    console.error("Błąd udostępniania:", err);
  }
};

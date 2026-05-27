import React from "react";
import type { Attempt } from "../types";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

export const directionalLabel = (
  attempt: Attempt,
): {
  icon: React.ReactNode;
  label: string;
  colorClass: string;
} => {
  const colorClass =
    attempt.status === "yellow"
      ? "text-yellow-500"
      : attempt.status === "red"
        ? "text-red-500"
        : "text-glowny";

  if (attempt.status === "green") {
    return {
      icon: <Check className={`h-4 w-4 ${colorClass}`} />,
      label: "TRAFIONY",
      colorClass,
    };
  }

  return {
    icon:
      attempt.direction === "up" ? (
        <ChevronUp className={`h-4 w-4 ${colorClass}`} />
      ) : (
        <ChevronDown className={`h-4 w-4 ${colorClass}`} />
      ),
    label: attempt.direction === "up" ? "ZA MAŁO" : "ZA DUŻO",
    colorClass,
  };
};

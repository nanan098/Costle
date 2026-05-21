export const handleDateSwipe = (
  direction: "left" | "right",
  date: string,
  setDate: (date: string) => void,
  setGuess: (guess: string) => void,
) => {
  if (direction === "left") {
    // Przejdź do poprzedniego dnia
    const previousDate = new Date(date);
    previousDate.setDate(previousDate.getDate() - 1);
    const formattedPreviousDate = previousDate.toISOString().split("T")[0];

    setDate(formattedPreviousDate);
    setGuess("");
  } else {
    // Przejdź do następnego dnia
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    const formattedNextDate = nextDate.toISOString().split("T")[0];

    setDate(formattedNextDate);
    setGuess("");
  }
};

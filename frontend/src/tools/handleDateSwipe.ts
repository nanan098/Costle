export const handleDateSwipe = (
  direction: "left" | "right",
  date: string,
  setDate: (date: string) => void,
  setGuess: (guess: string) => void,
) => {
  const [year, month, day] = date.split("-").map(Number);
  const currentDate = new Date(year, month - 1, day);

  const nextDate = new Date(currentDate);
  if (direction === "left") {
    nextDate.setDate(currentDate.getDate() - 1);
  } else {
    nextDate.setDate(currentDate.getDate() + 1);
  }

  const formattedDate = `${nextDate.getFullYear()}-${String(
    nextDate.getMonth() + 1,
  ).padStart(2, "0")}-${String(nextDate.getDate()).padStart(2, "0")}`;

  setDate(formattedDate);
  setGuess("");
};

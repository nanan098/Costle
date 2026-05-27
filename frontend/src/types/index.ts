export interface Attempt {
  try: number;
  price: number;
  status: "red" | "yellow" | "green";
  direction: "up" | "down" | "perfect";
}

export type AttemptsByDate = Record<string, Attempt[]>;

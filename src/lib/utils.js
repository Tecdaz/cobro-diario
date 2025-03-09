import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getStartOfTheDay() {
  const newDate = new Date();
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

export function getEndOfTheDay() {
  const newDate = new Date();
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}
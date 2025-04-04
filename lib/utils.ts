import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ByWhom = (userId: string[], currentUserId: string) => {
  if (userId[0] === currentUserId) {
    return "You"
  } else {
    return "Someone else"
  }
}

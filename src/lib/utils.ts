import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Global Date Format: DD-MM-YYYY ---

/** Format a date string or Date object to DD-MM-YYYY for display */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    // Already in display format like "Oct 12, 2023" — reparse
    const reparsed = new Date(date as string);
    if (isNaN(reparsed.getTime())) return date as string;
    return formatDate(reparsed);
  }
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

/** Convert DD-MM-YYYY display format to YYYY-MM-DD for HTML date inputs */
export function toInputDate(date: string | null | undefined): string {
  if (!date) return "";
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  // DD-MM-YYYY → YYYY-MM-DD
  if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
    const [dd, mm, yyyy] = date.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }
  return date;
}

/** Convert YYYY-MM-DD (from HTML date input) to DD-MM-YYYY for storage/display */
export function fromInputDate(date: string): string {
  if (!date) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [yyyy, mm, dd] = date.split("-");
    return `${dd}-${mm}-${yyyy}`;
  }
  return date;
}

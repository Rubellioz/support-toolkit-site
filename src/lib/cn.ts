import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Class name helper (clsx + tailwind-merge), as required by the baseline-ui skill. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

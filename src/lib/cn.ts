import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with conflict resolution.
 * Use for combining base styles + className prop so overrides work correctly.
 *
 * @example
 * cn('p-4 bg-white', className)
 * cn('text-base', isActive && 'font-bold', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const WORDS_PER_MINUTE = 200;

/** Estimated reading time in whole minutes. Only tokens holding a letter or a digit count as words. */
export function readingMinutes(text: string): number {
  const words = text.split(/\s+/).filter((token) => /[\p{L}\p{N}]/u.test(token)).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/**
 * Readability Calculator for ContractLens AI
 * Implements Flesch Reading Ease & Flesch-Kincaid Grade Level formulas.
 */

export interface ReadabilityMetrics {
  readingEase: number;       // 0-100+ (Higher = easier to read)
  gradeLevel: number;        // Grade level (e.g. 8.0 = 8th grade)
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
}

export function countSyllablesInWord(word: string): number {
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!cleanWord) return 0;
  if (cleanWord.length <= 3) return 1;

  // Syllable counting heuristics
  const formattedWord = cleanWord
    .replace(/(?:|med|ing|ely|ed)$/, "")
    .replace(/^y/, "");

  const matches = formattedWord.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

export function calculateReadability(text: string): ReadabilityMetrics {
  if (!text || text.trim().length === 0) {
    return {
      readingEase: 0,
      gradeLevel: 0,
      wordCount: 0,
      sentenceCount: 0,
      syllableCount: 0,
    };
  }

  // Count sentences
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const sentenceCount = Math.max(1, sentences.length);

  // Count words
  const words = text
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);
  const wordCount = Math.max(1, words.length);

  // Count syllables
  let syllableCount = 0;
  words.forEach((word) => {
    syllableCount += countSyllablesInWord(word);
  });

  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = syllableCount / wordCount;

  // Flesch Reading Ease formula
  let readingEase =
    206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
  readingEase = Math.round(Math.max(0, Math.min(100, readingEase)) * 10) / 10;

  // Flesch-Kincaid Grade Level formula
  let gradeLevel =
    0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
  gradeLevel = Math.round(Math.max(1, gradeLevel) * 10) / 10;

  return {
    readingEase,
    gradeLevel,
    wordCount,
    sentenceCount,
    syllableCount,
  };
}

export function calculateImprovement(
  originalText: string,
  plainText: string
): {
  originalScore: number;
  plainScore: number;
  improvementPercent: number;
  originalGrade: number;
  plainGrade: number;
} {
  const origMetrics = calculateReadability(originalText);
  const plainMetrics = calculateReadability(plainText);

  const origScore = origMetrics.readingEase;
  const plainScore = plainMetrics.readingEase;

  let improvementPercent = 0;
  if (origScore > 0) {
    improvementPercent = Math.round(((plainScore - origScore) / origScore) * 100);
  } else if (plainScore > 0) {
    improvementPercent = 100;
  }

  return {
    originalScore: origScore,
    plainScore: plainScore,
    improvementPercent: Math.max(0, improvementPercent),
    originalGrade: origMetrics.gradeLevel,
    plainGrade: plainMetrics.gradeLevel,
  };
}

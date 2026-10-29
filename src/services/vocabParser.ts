import { VocabularyWord, WordMasteryStatus } from '../types/learning';
import { createEnrichedWordFallback, CURATED_DICTIONARY } from '../data/seedVocabulary';

export interface ParsedWordItem {
  englishWord: string;
  hindiMeaning?: string;
  hindiPhonetic?: string;
}

// Common Devanagari transliteration mapping for basic english syllables
const COMMON_WORD_CACHE: Record<string, { hi: string; meaning: string }> = {
  apple: { hi: 'एप्पल', meaning: 'सेब' },
  banana: { hi: 'बनाना', meaning: 'केला' },
  orange: { hi: 'ऑरेंज', meaning: 'संतरा' },
  mango: { hi: 'मैंगो', meaning: 'आम' },
  water: { hi: 'वॉटर', meaning: 'पानी' },
  book: { hi: 'बुक', meaning: 'किताब' },
  pen: { hi: 'पेन', meaning: 'कलम' },
  school: { hi: 'स्कूल', meaning: 'विद्यालय / स्कूल' },
  house: { hi: 'हाउस', meaning: 'घर' },
  home: { hi: 'होम', meaning: 'घर' },
  friend: { hi: 'फ्रेंड', meaning: 'दोस्त / मित्र' },
  family: { hi: 'फैमिली', meaning: 'परिवार' },
  money: { hi: 'मनी', meaning: 'पैसे / धन' },
  time: { hi: 'टाइम', meaning: 'समय / वक़्त' },
  work: { hi: 'वर्क', meaning: 'काम' },
  help: { hi: 'हेल्प', meaning: 'मदद करना' },
  learn: { hi: 'लर्न', meaning: 'सीखना' },
  speak: { hi: 'स्पीक', meaning: 'बोलना' },
  listen: { hi: 'लिसन', meaning: 'सुनना' },
  read: { hi: 'रीड', meaning: 'पढ़ना' },
  write: { hi: 'राइट', meaning: 'लिखना' },
  happy: { hi: 'हैप्पी', meaning: 'खुश' },
  sad: { hi: 'सैड', meaning: 'उदास' },
  good: { hi: 'गुड', meaning: 'अच्छा' },
  bad: { hi: 'बैड', meaning: 'बुरा' },
  big: { hi: 'बिग', meaning: 'बड़ा' },
  small: { hi: 'स्मॉल', meaning: 'छोटा' },
  fast: { hi: 'फास्ट', meaning: 'तेज़' },
  slow: { hi: 'स्लो', meaning: 'धीमा' },
  without: { hi: 'विदाउट', meaning: 'के बिना / बिना' },
  with: { hi: 'विथ', meaning: 'के साथ' },
  because: { hi: 'बिकॉज़', meaning: 'क्योंकि' },
  between: { hi: 'बिटवीन', meaning: 'दो के बीच में' },
  always: { hi: 'ऑलवेज़', meaning: 'हमेशा' },
  never: { hi: 'नेवर', meaning: 'कभी नहीं' },
  already: { hi: 'ऑलरेडी', meaning: 'पहले ही' },
};

/**
 * Universal flexible vocabulary parser.
 * Handles:
 * - English word alone: "borrow"
 * - Hyphen/Dash: "apple - एप्पल - सेब" or "apple - सेब"
 * - Tabs (Excel/Sheets): "apple\tएप्पल\tसेब"
 * - Colon/Equals: "apple : एप्पल : सेब" or "apple = सेब"
 * - Parentheses: "apple (एप्पल) - सेब" or "apple (सेब)"
 * - Space separated: "apple एप्पल सेब" or "borrow बॉरो उधार लेना"
 * - Bullets & Numbering: "1. apple - एप्पल - सेब" or "1) apple : सेब"
 * - Labeled: "Word: apple, Uchcharan: एप्पल, Meaning: सेब"
 */
export function parseFlexibleVocabularyInput(rawText: string): ParsedWordItem[] {
  if (!rawText || !rawText.trim()) return [];

  const rawLines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const results: ParsedWordItem[] = [];
  const seenEnglish = new Set<string>();

  // Check if text is a multi-line grouped format (e.g., line 1 English, line 2 Pronunciation, line 3 Meaning)
  let isGroupedBlockFormat = false;
  if (rawLines.length >= 2) {
    const hasEnglishOnlyLines = rawLines.some((l) => /^[a-zA-Z\s\-']{2,30}$/.test(l.trim()));
    const hasDevanagariOnlyLines = rawLines.some((l) => /^[\u0900-\u097F\s\.\,\-\/\(\)]+$/.test(l.trim()));
    if (hasEnglishOnlyLines && hasDevanagariOnlyLines) {
      // Check if alternating lines or blocks
      let englishCount = 0;
      let devanagariCount = 0;
      for (const l of rawLines) {
        if (/^[a-zA-Z\s\-']{2,30}$/.test(l.trim())) englishCount++;
        else if (/^[\u0900-\u097F\s\.\,\-\/\(\)]+$/.test(l.trim())) devanagariCount++;
      }
      if (englishCount > 0 && devanagariCount >= englishCount) {
        isGroupedBlockFormat = true;
      }
    }
  }

  if (isGroupedBlockFormat) {
    let currentItem: Partial<ParsedWordItem> | null = null;
    for (const line of rawLines) {
      const clean = line.replace(/^(\d+[\.\)\:\-\s]+|[\•\*\-\–\—\>]\s*)/, '').trim();
      if (!clean) continue;

      if (/^[a-zA-Z\s\-']{2,30}$/.test(clean)) {
        if (currentItem && currentItem.englishWord) {
          const w = currentItem.englishWord.toLowerCase().trim();
          if (!seenEnglish.has(w)) {
            seenEnglish.add(w);
            results.push({
              englishWord: w,
              hindiPhonetic: currentItem.hindiPhonetic,
              hindiMeaning: currentItem.hindiMeaning,
            });
          }
        }
        currentItem = { englishWord: clean.toLowerCase().trim() };
      } else if (currentItem && /^[\u0900-\u097F\s\.\,\-\/\(\)]+$/.test(clean)) {
        if (!currentItem.hindiPhonetic) {
          currentItem.hindiPhonetic = clean;
        } else if (!currentItem.hindiMeaning) {
          currentItem.hindiMeaning = clean;
        } else {
          currentItem.hindiMeaning += ' ' + clean;
        }
      }
    }
    if (currentItem && currentItem.englishWord) {
      const w = currentItem.englishWord.toLowerCase().trim();
      if (!seenEnglish.has(w)) {
        seenEnglish.add(w);
        results.push({
          englishWord: w,
          hindiPhonetic: currentItem.hindiPhonetic,
          hindiMeaning: currentItem.hindiMeaning,
        });
      }
    }

    if (results.length > 0) {
      return results;
    }
  }

  // Standard line-by-line parsing
  for (const rawLine of rawLines) {
    // 1. Remove bullets or numbering (e.g., "1.", "1)", "1 -", "01.", "•", "*")
    let line = rawLine.replace(/^(\d+[\.\)\:\-\s]+|[\•\*\-\–\—\>]\s*)/, '').trim();
    if (!line) continue;

    // Skip table header lines like "Word | Pronunciation | Meaning" or "No. Word Meaning"
    const lowerLine = line.toLowerCase();
    if (
      (lowerLine.includes('word') && (lowerLine.includes('meaning') || lowerLine.includes('pronunciation') || lowerLine.includes('arth'))) ||
      (lowerLine.includes('शब्द') && (lowerLine.includes('अर्थ') || lowerLine.includes('उच्चारण')))
    ) {
      continue;
    }

    let englishWord = '';
    let hindiPhonetic: string | undefined;
    let hindiMeaning: string | undefined;

    // Check for explicit labels: e.g. "Word: apple", "उच्चारण: एप्पल", "Meaning: सेब"
    const labelWordMatch = line.match(/(?:word|english|शब्द)\s*[:=-]\s*([a-zA-Z\s\-']{2,30})/i);
    const labelPhoneticMatch = line.match(/(?:uchcharan|pronunciation|उच्चारण)\s*[:=-]\s*([\u0900-\u097F\s\.\-]+)/i);
    const labelMeaningMatch = line.match(/(?:meaning|arth|अर्थ)\s*[:=-]\s*([\u0900-\u097F\s\.\,\/]+)/i);

    if (labelWordMatch) {
      englishWord = labelWordMatch[1].trim().toLowerCase();
      if (labelPhoneticMatch) hindiPhonetic = labelPhoneticMatch[1].trim();
      if (labelMeaningMatch) hindiMeaning = labelMeaningMatch[1].trim();
    }

    // Check parentheses format: "apple (एप्पल) - सेब" or "apple (सेब)" or "borrow (बॉरो)"
    if (!englishWord) {
      const parenMatch = line.match(/([a-zA-Z\s\-']{2,30})\s*[\(\[\{]([\u0900-\u097Fa-zA-Z\s\.\-]+)[\)\]\}](.*)/);
      if (parenMatch) {
        englishWord = parenMatch[1].trim().toLowerCase();
        const insideParen = parenMatch[2].trim();
        const afterParen = parenMatch[3].trim().replace(/^[\-\=\:\—\|\,\/]+/, '').trim();

        if (afterParen) {
          // Inside is phonetic, after is meaning
          hindiPhonetic = insideParen;
          hindiMeaning = afterParen;
        } else {
          // If only parentheses, check if inside is meaning or pronunciation
          if (insideParen.length <= 8 && !insideParen.includes(' ')) {
            hindiPhonetic = insideParen;
          } else {
            hindiMeaning = insideParen;
          }
        }
      }
    }

    // Check delimited formats: Tab, hyphen, colon, equal, pipe, slash, or 2+ spaces
    if (!englishWord) {
      const delimiterRegex = /[\t|\—|\–|\-|\:|\=|\/|\|]|\s{2,}/;
      const parts = line.split(delimiterRegex).map((p) => p.trim()).filter(Boolean);

      if (parts.length > 1) {
        // Find the part that contains the English word
        const engIndex = parts.findIndex((p) => /[a-zA-Z]{2,}/.test(p));
        if (engIndex !== -1) {
          const engPart = parts[engIndex];
          const match = engPart.match(/[a-zA-Z\s\-']{2,30}/);
          if (match) {
            englishWord = match[0].trim().toLowerCase();
          }

          const otherParts = parts.filter((_, idx) => idx !== engIndex);
          if (otherParts.length === 1) {
            const single = otherParts[0];
            // If short Devanagari, could be pronunciation or single word meaning
            hindiMeaning = single;
          } else if (otherParts.length >= 2) {
            // Part 1 is pronunciation, Part 2 is meaning
            hindiPhonetic = otherParts[0];
            hindiMeaning = otherParts.slice(1).join(' ');
          }
        }
      }
    }

    // Space-separated format: "apple एप्पल सेब" or "borrow बॉरो उधार लेना" or "apple सेब"
    if (!englishWord) {
      const engMatch = line.match(/^([a-zA-Z\s\-']{2,30})/);
      if (engMatch) {
        englishWord = engMatch[1].trim().toLowerCase();
        const remainder = line.slice(engMatch[0].length).trim();
        if (remainder) {
          // Split remainder into Devanagari tokens
          const devTokens = remainder.split(/\s+/).filter(Boolean);
          if (devTokens.length === 1) {
            hindiMeaning = devTokens[0];
          } else if (devTokens.length >= 2) {
            // First token is phonetic (e.g. "एप्पल" or "बॉरो"), rest is meaning
            hindiPhonetic = devTokens[0];
            hindiMeaning = devTokens.slice(1).join(' ');
          }
        }
      }
    }

    // Standalone English word fallback
    if (!englishWord) {
      const pureMatch = line.match(/([a-zA-Z]{2,30})/);
      if (pureMatch) {
        englishWord = pureMatch[1].trim().toLowerCase();
      }
    }

    if (englishWord && !seenEnglish.has(englishWord)) {
      seenEnglish.add(englishWord);

      // Auto-fill from common word cache or curated dictionary if missing hints
      const cached = (COMMON_WORD_CACHE[englishWord] || CURATED_DICTIONARY[englishWord]) as any;
      if (cached) {
        const cachedMeaning = cached.meaning || cached.hindiMeaning;
        const cachedPhonetic = cached.hi || cached.phoneticHindi;
        if (!hindiMeaning && cachedMeaning) {
          hindiMeaning = cachedMeaning;
        }
        if (!hindiPhonetic && cachedPhonetic) {
          hindiPhonetic = cachedPhonetic;
        }
      }

      results.push({
        englishWord,
        hindiPhonetic: hindiPhonetic?.trim(),
        hindiMeaning: hindiMeaning?.trim(),
      });
    }
  }

  // Last-ditch token extraction if rawText had comma-separated words with no newlines
  if (results.length === 0) {
    const tokens = rawText.match(/[a-zA-Z]{2,30}/g) || [];
    for (const t of tokens) {
      const low = t.toLowerCase().trim();
      if (!seenEnglish.has(low)) {
        seenEnglish.add(low);
        const cached = (COMMON_WORD_CACHE[low] || CURATED_DICTIONARY[low]) as any;
        const cachedMeaning = cached?.meaning || cached?.hindiMeaning;
        const cachedPhonetic = cached?.hi || cached?.phoneticHindi;
        results.push({
          englishWord: low,
          hindiPhonetic: cachedPhonetic,
          hindiMeaning: cachedMeaning,
        });
      }
    }
  }

  return results;
}

export function buildVocabularyWordFromParsed(
  item: ParsedWordItem,
  index: number
): VocabularyWord {
  const base = createEnrichedWordFallback(item.englishWord, index);

  return {
    ...base,
    hindiMeaning: item.hindiMeaning || base.hindiMeaning,
    phoneticHindi: item.hindiPhonetic || base.phoneticHindi,
  };
}

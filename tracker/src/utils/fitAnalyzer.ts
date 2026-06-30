import { Resume, FitResult } from '../types';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
  'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'that', 'this',
  'these', 'those', 'it', 'its', 'we', 'our', 'you', 'your', 'they', 'their',
  'as', 'if', 'not', 'no', 'nor', 'so', 'yet', 'both', 'either', 'neither',
  'more', 'most', 'such', 'than', 'then', 'when', 'where', 'who', 'which',
  'what', 'how', 'all', 'each', 'every', 'any', 'few', 'some', 'other',
  'own', 'same', 'very', 'just', 'also', 'only', 'well', 'new', 'good',
  'work', 'working', 'experience', 'role', 'position', 'team', 'company',
  'will', 'able', 'able', 'strong', 'excellent', 'required', 'preferred',
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s.#+]/g, ' ')
      .split(/\s+/)
      .map((t) => t.replace(/^[.\s]+|[.\s]+$/g, ''))
      .filter((t) => t.length > 2 && !STOP_WORDS.has(t))
  );
}

function extractPhrases(text: string): string[] {
  // Extract multi-word technical terms (2-3 word phrases)
  const phrases: string[] = [];
  const lower = text.toLowerCase();

  // Common multi-word patterns worth matching
  const multiWordPatterns = [
    /iec\s+61850/g,
    /node\.js/g,
    /vue\.js/g,
    /rest\s+api/g,
    /ci\/cd/g,
    /github\s+actions/g,
    /multi[-\s]tenant/g,
    /full\s+stack/g,
    /z[-\s]score/g,
    /cloudflare\s+r2/g,
  ];

  for (const pattern of multiWordPatterns) {
    const matches = lower.match(pattern);
    if (matches) {
      phrases.push(...matches.map((m) => m.replace(/\s+/g, ' ').trim()));
    }
  }

  return phrases;
}

function getResumeTokens(resume: Resume): { tokens: Set<string>; phrases: string[] } {
  const tokens = tokenize(resume.keywords + ' ' + (resume.title ?? '') + ' ' + (resume.notes ?? ''));
  const phrases = extractPhrases(resume.keywords);
  return { tokens, phrases };
}

export function analyzeJobDescription(jd: string, resumes: Resume[]): FitResult[] {
  if (!jd.trim() || resumes.length === 0) return [];

  const jdTokens = tokenize(jd);
  const jdPhrases = extractPhrases(jd);
  const jdText = jd.toLowerCase();

  const results: FitResult[] = resumes.map((resume) => {
    const { tokens: resumeTokens, phrases: resumePhrases } = getResumeTokens(resume);
    const matchedKeywords: string[] = [];

    // Match single tokens
    for (const token of resumeTokens) {
      if (jdTokens.has(token)) {
        matchedKeywords.push(token);
      }
    }

    // Match multi-word phrases
    for (const phrase of resumePhrases) {
      if (jdText.includes(phrase) && !matchedKeywords.includes(phrase)) {
        matchedKeywords.push(phrase);
      }
    }

    // Also check JD phrases against resume keywords
    for (const phrase of jdPhrases) {
      const resumeText = (resume.keywords + ' ' + (resume.title ?? '')).toLowerCase();
      if (resumeText.includes(phrase) && !matchedKeywords.includes(phrase)) {
        matchedKeywords.push(phrase);
      }
    }

    const totalKeywords = resumeTokens.size + resumePhrases.length;
    const score = totalKeywords > 0 ? Math.round((matchedKeywords.length / totalKeywords) * 100) : 0;

    return {
      resume,
      score: Math.min(score, 100),
      matchedKeywords,
      totalKeywords,
    };
  });

  return results.sort((a, b) => b.score - a.score);
}

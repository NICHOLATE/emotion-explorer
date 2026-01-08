export type SentimentLabel = 'positive' | 'negative' | 'neutral';

export interface SentimentResult {
  id: string;
  text: string;
  label: SentimentLabel;
  confidence: number;
  scores: {
    positive: number;
    negative: number;
    neutral: number;
  };
  keywords: { word: string; sentiment: SentimentLabel; weight: number }[];
  timestamp: Date;
}

export interface BatchAnalysisResult {
  results: SentimentResult[];
  summary: {
    total: number;
    positive: number;
    negative: number;
    neutral: number;
    averageConfidence: number;
  };
}

// Sentiment words for keyword extraction
const POSITIVE_WORDS = new Set([
  'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome',
  'love', 'loved', 'loving', 'happy', 'pleased', 'satisfied', 'perfect', 'best',
  'beautiful', 'brilliant', 'outstanding', 'superb', 'incredible', 'remarkable',
  'delightful', 'enjoyable', 'pleasant', 'positive', 'recommend', 'recommended',
  'helpful', 'friendly', 'professional', 'quality', 'efficient', 'impressive',
  'exceptional', 'fabulous', 'terrific', 'marvelous', 'splendid', 'superior',
  'valuable', 'worthwhile', 'success', 'successful', 'thank', 'thanks', 'appreciate'
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'terrible', 'horrible', 'awful', 'poor', 'worst', 'hate', 'hated',
  'disappointed', 'disappointing', 'frustrating', 'frustrated', 'angry', 'upset',
  'annoyed', 'annoying', 'useless', 'waste', 'wasted', 'broken', 'fail', 'failed',
  'failure', 'problem', 'problems', 'issue', 'issues', 'bug', 'bugs', 'error',
  'errors', 'slow', 'difficult', 'complicated', 'confusing', 'confused', 'unhappy',
  'unsatisfied', 'regret', 'never', 'lacking', 'missing', 'wrong', 'defective',
  'damaged', 'rude', 'unprofessional', 'expensive', 'overpriced', 'scam', 'fake'
]);

const INTENSIFIERS = new Set(['very', 'really', 'extremely', 'absolutely', 'completely', 'totally', 'highly']);
const NEGATORS = new Set(['not', 'never', 'no', "don't", "doesn't", "didn't", "won't", "can't", "couldn't"]);

export function extractKeywords(text: string): { word: string; sentiment: SentimentLabel; weight: number }[] {
  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
  const keywords: { word: string; sentiment: SentimentLabel; weight: number }[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (seen.has(word)) continue;

    let sentiment: SentimentLabel | null = null;
    let weight = 1;

    // Check for intensifier before this word
    if (i > 0 && INTENSIFIERS.has(words[i - 1])) {
      weight = 1.5;
    }

    // Check for negator before this word
    const hasNegator = i > 0 && NEGATORS.has(words[i - 1]);

    if (POSITIVE_WORDS.has(word)) {
      sentiment = hasNegator ? 'negative' : 'positive';
      weight *= hasNegator ? 0.8 : 1;
    } else if (NEGATIVE_WORDS.has(word)) {
      sentiment = hasNegator ? 'positive' : 'negative';
      weight *= hasNegator ? 0.8 : 1;
    }

    if (sentiment) {
      seen.add(word);
      keywords.push({ word, sentiment, weight });
    }
  }

  return keywords.sort((a, b) => b.weight - a.weight).slice(0, 8);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function calculateSummary(results: SentimentResult[]): BatchAnalysisResult['summary'] {
  const summary = {
    total: results.length,
    positive: 0,
    negative: 0,
    neutral: 0,
    averageConfidence: 0,
  };

  if (results.length === 0) return summary;

  let totalConfidence = 0;

  for (const result of results) {
    summary[result.label]++;
    totalConfidence += result.confidence;
  }

  summary.averageConfidence = totalConfidence / results.length;

  return summary;
}

export function parseTextFile(content: string): string[] {
  // Split by common delimiters: newlines, or detect JSON array
  const trimmed = content.trim();
  
  // Try parsing as JSON array
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map(item => typeof item === 'string' ? item : item.text || String(item)).filter(Boolean);
      }
    } catch {
      // Not valid JSON, continue with line splitting
    }
  }

  // Split by newlines and filter empty lines
  return trimmed.split(/\n+/).map(line => line.trim()).filter(line => line.length > 0);
}

export function exportToCSV(results: SentimentResult[]): string {
  const headers = ['ID', 'Text', 'Sentiment', 'Confidence', 'Positive Score', 'Negative Score', 'Neutral Score', 'Keywords', 'Timestamp'];
  const rows = results.map(r => [
    r.id,
    `"${r.text.replace(/"/g, '""')}"`,
    r.label,
    (r.confidence * 100).toFixed(1) + '%',
    (r.scores.positive * 100).toFixed(1) + '%',
    (r.scores.negative * 100).toFixed(1) + '%',
    (r.scores.neutral * 100).toFixed(1) + '%',
    `"${r.keywords.map(k => k.word).join(', ')}"`,
    r.timestamp.toISOString()
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function exportToJSON(results: SentimentResult[]): string {
  return JSON.stringify(results.map(r => ({
    id: r.id,
    text: r.text,
    sentiment: r.label,
    confidence: r.confidence,
    scores: r.scores,
    keywords: r.keywords.map(k => ({ word: k.word, sentiment: k.sentiment, weight: k.weight })),
    timestamp: r.timestamp.toISOString()
  })), null, 2);
}

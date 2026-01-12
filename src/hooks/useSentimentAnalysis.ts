import { useState, useCallback, useRef } from 'react';
import { pipeline, type TextClassificationPipeline } from '@huggingface/transformers';
import { supabase } from '@/integrations/supabase/client';
import { 
  SentimentResult, 
  SentimentLabel, 
  extractKeywords, 
  generateId, 
  calculateSummary,
  BatchAnalysisResult 
} from '@/lib/sentimentAnalyzer';

type ModelStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface MultiLanguageResult extends SentimentResult {
  detectedLanguage?: string;
  translatedText?: string | null;
}

export function useSentimentAnalysis() {
  const [status, setStatus] = useState<ModelStatus>('idle');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SentimentResult[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');
  
  const classifierRef = useRef<TextClassificationPipeline | null>(null);

  const loadModel = useCallback(async () => {
    if (classifierRef.current || status === 'loading') return;
    
    setStatus('loading');
    setLoadingProgress(0);
    setError(null);

    try {
      // Use distilbert-base-uncased-finetuned-sst-2-english for sentiment
      const classifier = await pipeline(
        'text-classification',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
        {
          progress_callback: (progress: { status: string; progress?: number }) => {
            if (progress.progress !== undefined) {
              setLoadingProgress(Math.round(progress.progress));
            }
          },
        }
      );
      
      classifierRef.current = classifier as TextClassificationPipeline;
      setStatus('ready');
      setLoadingProgress(100);
    } catch (err) {
      console.error('Failed to load model:', err);
      setError(err instanceof Error ? err.message : 'Failed to load AI model');
      setStatus('error');
    }
  }, [status]);

  const mapLabelToSentiment = (label: string, score: number): { label: SentimentLabel; scores: SentimentResult['scores'] } => {
    // The model outputs POSITIVE or NEGATIVE
    // We'll determine neutral based on low confidence
    const isPositive = label.toUpperCase() === 'POSITIVE';
    
    // If confidence is low (< 0.6), treat as neutral
    if (score < 0.6) {
      return {
        label: 'neutral',
        scores: {
          positive: isPositive ? score * 0.4 : (1 - score) * 0.4,
          negative: isPositive ? (1 - score) * 0.4 : score * 0.4,
          neutral: 0.6 - score + 0.4,
        }
      };
    }

    if (isPositive) {
      return {
        label: 'positive',
        scores: {
          positive: score,
          negative: (1 - score) * 0.3,
          neutral: (1 - score) * 0.7,
        }
      };
    } else {
      return {
        label: 'negative',
        scores: {
          positive: (1 - score) * 0.3,
          negative: score,
          neutral: (1 - score) * 0.7,
        }
      };
    }
  };

  // Multi-language analysis using AI
  const analyzeTextMultiLanguage = useCallback(async (text: string, language: string = 'auto'): Promise<MultiLanguageResult | null> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-sentiment', {
        body: { text, language }
      });

      if (fnError) {
        console.error('Edge function error:', fnError);
        throw new Error(fnError.message || 'Analysis failed');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const keywords = data.keywords?.map((word: string) => ({
        word,
        sentiment: data.sentiment as SentimentLabel,
        weight: 1
      })) || [];

      return {
        id: generateId(),
        text,
        label: data.sentiment as SentimentLabel,
        confidence: data.confidence,
        scores: data.scores,
        keywords,
        timestamp: new Date(),
        detectedLanguage: data.detectedLanguage,
        translatedText: data.translatedText,
      };
    } catch (err) {
      console.error('Multi-language analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Local English-only analysis (faster, no API)
  const analyzeText = useCallback(async (text: string): Promise<SentimentResult | null> => {
    if (!classifierRef.current) {
      await loadModel();
    }

    if (!classifierRef.current) {
      setError('Model not loaded');
      return null;
    }

    try {
      const output = await classifierRef.current(text, { top_k: 1 });
      const result = Array.isArray(output) ? output[0] : output;
      
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid model output');
      }

      const { label: rawLabel, score } = result as { label: string; score: number };
      const { label, scores } = mapLabelToSentiment(rawLabel, score);
      const keywords = extractKeywords(text);

      return {
        id: generateId(),
        text,
        label,
        confidence: score,
        scores,
        keywords,
        timestamp: new Date(),
      };
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
      return null;
    }
  }, [loadModel]);

  // Smart analyze - uses multi-language for non-English, local for English
  const smartAnalyze = useCallback(async (text: string, language: string = 'auto'): Promise<MultiLanguageResult | null> => {
    // For English or when local model is preferred, use local analysis
    if (language === 'en' && classifierRef.current) {
      const result = await analyzeText(text);
      if (result) {
        return {
          ...result,
          detectedLanguage: 'en',
          translatedText: null,
        };
      }
    }

    // Use multi-language AI analysis
    return analyzeTextMultiLanguage(text, language);
  }, [analyzeText, analyzeTextMultiLanguage]);

  const analyzeBatch = useCallback(async (texts: string[], language: string = 'auto'): Promise<BatchAnalysisResult> => {
    setIsAnalyzing(true);
    const batchResults: SentimentResult[] = [];

    try {
      for (const text of texts) {
        if (text.trim()) {
          const result = await smartAnalyze(text, language);
          if (result) {
            batchResults.push(result);
          }
        }
      }

      setResults(prev => [...prev, ...batchResults]);
      
      return {
        results: batchResults,
        summary: calculateSummary(batchResults),
      };
    } finally {
      setIsAnalyzing(false);
    }
  }, [smartAnalyze]);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  const removeResult = useCallback((id: string) => {
    setResults(prev => prev.filter(r => r.id !== id));
  }, []);

  const updateResults = useCallback((newResults: SentimentResult[]) => {
    setResults(newResults);
  }, []);

  return {
    status,
    loadingProgress,
    error,
    isAnalyzing,
    results,
    selectedLanguage,
    setSelectedLanguage,
    loadModel,
    analyzeText,
    analyzeTextMultiLanguage,
    smartAnalyze,
    analyzeBatch,
    clearResults,
    removeResult,
    setResults: updateResults,
  };
}

import { useState, useEffect, useCallback } from 'react';
import { SentimentResult } from '@/lib/sentimentAnalyzer';

export interface HistorySession {
  id: string;
  name: string;
  results: SentimentResult[];
  createdAt: Date;
  summary: {
    total: number;
    positive: number;
    negative: number;
    neutral: number;
  };
}

const STORAGE_KEY = 'opinionme-history';
const MAX_SESSIONS = 10;

export function useAnalysisHistory() {
  const [sessions, setSessions] = useState<HistorySession[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSessions(parsed.map((s: HistorySession) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          results: s.results.map(r => ({
            ...r,
            timestamp: new Date(r.timestamp)
          }))
        })));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  const saveSession = useCallback((results: SentimentResult[], name?: string) => {
    if (results.length === 0) return;

    const session: HistorySession = {
      id: Date.now().toString(36),
      name: name || `Session ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      results: results,
      createdAt: new Date(),
      summary: {
        total: results.length,
        positive: results.filter(r => r.label === 'positive').length,
        negative: results.filter(r => r.label === 'negative').length,
        neutral: results.filter(r => r.label === 'neutral').length,
      }
    };

    setSessions(prev => [session, ...prev].slice(0, MAX_SESSIONS));
    return session;
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id);
      if (updated.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSessions([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const renameSession = useCallback((id: string, newName: string) => {
    setSessions(prev => prev.map(s => 
      s.id === id ? { ...s, name: newName } : s
    ));
  }, []);

  return {
    sessions,
    saveSession,
    deleteSession,
    clearHistory,
    renameSession,
  };
}

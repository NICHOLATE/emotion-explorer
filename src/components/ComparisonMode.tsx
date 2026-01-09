import React from 'react';
import { motion } from 'framer-motion';
import { X, GitCompareArrows, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SentimentResult } from '@/lib/sentimentAnalyzer';
import { HistorySession } from '@/hooks/useAnalysisHistory';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

interface ComparisonModeProps {
  currentResults: SentimentResult[];
  comparisonSession: HistorySession;
  onClose: () => void;
}

const COLORS = {
  current: 'hsl(217, 91%, 60%)',
  comparison: 'hsl(280, 65%, 60%)',
};

export const ComparisonMode: React.FC<ComparisonModeProps> = ({
  currentResults,
  comparisonSession,
  onClose,
}) => {
  const currentSummary = {
    total: currentResults.length,
    positive: currentResults.filter(r => r.label === 'positive').length,
    negative: currentResults.filter(r => r.label === 'negative').length,
    neutral: currentResults.filter(r => r.label === 'neutral').length,
    avgConfidence: currentResults.reduce((sum, r) => sum + r.confidence, 0) / currentResults.length || 0,
  };

  const comparisonSummary = {
    total: comparisonSession.summary.total,
    positive: comparisonSession.summary.positive,
    negative: comparisonSession.summary.negative,
    neutral: comparisonSession.summary.neutral,
    avgConfidence: comparisonSession.results.reduce((sum, r) => sum + r.confidence, 0) / comparisonSession.results.length || 0,
  };

  const chartData = [
    {
      name: 'Positive',
      current: currentSummary.total > 0 ? (currentSummary.positive / currentSummary.total * 100) : 0,
      comparison: comparisonSummary.total > 0 ? (comparisonSummary.positive / comparisonSummary.total * 100) : 0,
    },
    {
      name: 'Negative',
      current: currentSummary.total > 0 ? (currentSummary.negative / currentSummary.total * 100) : 0,
      comparison: comparisonSummary.total > 0 ? (comparisonSummary.negative / comparisonSummary.total * 100) : 0,
    },
    {
      name: 'Neutral',
      current: currentSummary.total > 0 ? (currentSummary.neutral / currentSummary.total * 100) : 0,
      comparison: comparisonSummary.total > 0 ? (comparisonSummary.neutral / comparisonSummary.total * 100) : 0,
    },
  ];

  const getDifference = (current: number, comparison: number) => {
    const diff = current - comparison;
    return {
      value: Math.abs(diff),
      direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'same',
    };
  };

  const positiveDiff = getDifference(
    currentSummary.total > 0 ? currentSummary.positive / currentSummary.total * 100 : 0,
    comparisonSummary.total > 0 ? comparisonSummary.positive / comparisonSummary.total * 100 : 0
  );

  const negativeDiff = getDifference(
    currentSummary.total > 0 ? currentSummary.negative / currentSummary.total * 100 : 0,
    comparisonSummary.total > 0 ? comparisonSummary.negative / comparisonSummary.total * 100 : 0
  );

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <GitCompareArrows className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Comparison Mode</h3>
            <p className="text-sm text-muted-foreground">
              Current vs "{comparisonSession.name}"
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Comparison Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Current Session */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="font-medium">Current Session</span>
            <Badge variant="outline" className="ml-auto">{currentSummary.total} texts</Badge>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-emerald-400">{currentSummary.positive}</p>
              <p className="text-xs text-muted-foreground">Positive</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-rose-400">{currentSummary.negative}</p>
              <p className="text-xs text-muted-foreground">Negative</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">{currentSummary.neutral}</p>
              <p className="text-xs text-muted-foreground">Neutral</p>
            </div>
          </div>
        </div>

        {/* Comparison Session */}
        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="font-medium truncate">{comparisonSession.name}</span>
            <Badge variant="outline" className="ml-auto shrink-0">{comparisonSummary.total} texts</Badge>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-emerald-400">{comparisonSummary.positive}</p>
              <p className="text-xs text-muted-foreground">Positive</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-rose-400">{comparisonSummary.negative}</p>
              <p className="text-xs text-muted-foreground">Negative</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">{comparisonSummary.neutral}</p>
              <p className="text-xs text-muted-foreground">Neutral</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={8}>
            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} unit="%" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
            <Legend />
            <Bar dataKey="current" name="Current" fill={COLORS.current} radius={[4, 4, 0, 0]} />
            <Bar dataKey="comparison" name="Comparison" fill={COLORS.comparison} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-muted-foreground">Key Insights</h4>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            {positiveDiff.direction === 'up' ? (
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            ) : positiveDiff.direction === 'down' ? (
              <TrendingDown className="w-5 h-5 text-rose-400" />
            ) : (
              <Minus className="w-5 h-5 text-muted-foreground" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">Positive Sentiment</p>
              <p className="text-xs text-muted-foreground">
                {positiveDiff.direction === 'same' 
                  ? 'No change' 
                  : `${positiveDiff.value.toFixed(1)}% ${positiveDiff.direction === 'up' ? 'higher' : 'lower'} than comparison`
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            {negativeDiff.direction === 'up' ? (
              <TrendingUp className="w-5 h-5 text-rose-400" />
            ) : negativeDiff.direction === 'down' ? (
              <TrendingDown className="w-5 h-5 text-emerald-400" />
            ) : (
              <Minus className="w-5 h-5 text-muted-foreground" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">Negative Sentiment</p>
              <p className="text-xs text-muted-foreground">
                {negativeDiff.direction === 'same' 
                  ? 'No change' 
                  : `${negativeDiff.value.toFixed(1)}% ${negativeDiff.direction === 'up' ? 'higher' : 'lower'} than comparison`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BarChart3, Target, Percent } from 'lucide-react';
import { BatchAnalysisResult } from '@/lib/sentimentAnalyzer';

interface SummaryStatsProps {
  summary: BatchAnalysisResult['summary'];
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ summary }) => {
  const stats = [
    {
      label: 'Total Analyzed',
      value: summary.total,
      icon: BarChart3,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Positive',
      value: summary.positive,
      percentage: summary.total > 0 ? ((summary.positive / summary.total) * 100).toFixed(1) : 0,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      label: 'Negative',
      value: summary.negative,
      percentage: summary.total > 0 ? ((summary.negative / summary.total) * 100).toFixed(1) : 0,
      icon: TrendingDown,
      color: 'text-rose-400',
      bg: 'bg-rose-400/10',
    },
    {
      label: 'Neutral',
      value: summary.neutral,
      percentage: summary.total > 0 ? ((summary.neutral / summary.total) * 100).toFixed(1) : 0,
      icon: Minus,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      label: 'Avg Confidence',
      value: `${(summary.averageConfidence * 100).toFixed(1)}%`,
      icon: Target,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="glass-card rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </div>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-xs text-muted-foreground">
            {stat.label}
            {stat.percentage !== undefined && (
              <span className="ml-1">({stat.percentage}%)</span>
            )}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

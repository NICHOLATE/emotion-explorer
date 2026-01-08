import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, X, Clock } from 'lucide-react';
import { SentimentResult, SentimentLabel } from '@/lib/sentimentAnalyzer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FullReport } from './FullReport';

interface SentimentResultCardProps {
  result: SentimentResult;
  onRemove?: (id: string) => void;
  index?: number;
}

const sentimentConfig: Record<SentimentLabel, { 
  icon: typeof TrendingUp; 
  color: string; 
  bg: string; 
  label: string;
  gradient: string;
}> = {
  positive: {
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    label: 'Positive',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
  },
  negative: {
    icon: TrendingDown,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    label: 'Negative',
    gradient: 'from-rose-500/20 to-rose-500/5',
  },
  neutral: {
    icon: Minus,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    label: 'Neutral',
    gradient: 'from-amber-500/20 to-amber-500/5',
  },
};

export const SentimentResultCard: React.FC<SentimentResultCardProps> = ({
  result,
  onRemove,
  index = 0,
}) => {
  const config = sentimentConfig[result.label];
  const Icon = config.icon;

  return (
    <motion.div
      className={`glass-card rounded-xl p-5 relative overflow-hidden`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} pointer-events-none`} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.bg}`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div>
              <Badge className={`${config.bg} ${config.color} border-0 font-medium`}>
                {config.label}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {result.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(result.id)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Text content */}
        <p className="text-sm text-foreground/90 mb-4 line-clamp-3">
          "{result.text}"
        </p>

        {/* Confidence scores */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Confidence</span>
            <span className={config.color}>{(result.confidence * 100).toFixed(1)}%</span>
          </div>
          <Progress 
            value={result.confidence * 100} 
            className={`h-2 ${config.bg}`}
          />
        </div>

        {/* Score breakdown */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {(['positive', 'negative', 'neutral'] as const).map((type) => (
            <div key={type} className="text-center p-2 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground capitalize">{type}</p>
              <p className={`text-sm font-semibold ${sentimentConfig[type].color}`}>
                {(result.scores[type] * 100).toFixed(0)}%
              </p>
            </div>
          ))}
        </div>

        {/* Keywords */}
        {result.keywords.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Key Sentiment Drivers</p>
            <div className="flex flex-wrap gap-1.5">
              {result.keywords.map((keyword, i) => (
                <Badge
                  key={`${keyword.word}-${i}`}
                  variant="outline"
                  className={`text-xs ${sentimentConfig[keyword.sentiment].color} border-current/30`}
                >
                  {keyword.word}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Full Report Button */}
        <div className="mt-4 pt-3 border-t border-border">
          <FullReport result={result} />
        </div>
      </div>
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Brain, Cpu, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ModelLoadingProps {
  progress: number;
  status: 'idle' | 'loading' | 'ready' | 'error';
}

export const ModelLoading: React.FC<ModelLoadingProps> = ({ progress, status }) => {
  if (status === 'ready') return null;

  return (
    <motion.div
      className="glass-card rounded-xl p-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex flex-col items-center gap-4">
        {status === 'loading' ? (
          <>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <div className="relative p-4 rounded-full bg-primary/10 border border-primary/30">
                <Brain className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>
            <div className="space-y-2 w-full max-w-xs">
              <p className="text-sm font-medium">Loading AI Model...</p>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">{progress}% complete</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                Downloading model
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Runs locally in browser
              </span>
            </div>
          </>
        ) : status === 'idle' ? (
          <>
            <div className="p-4 rounded-full bg-muted/50">
              <Brain className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">AI Model Ready to Load</p>
              <p className="text-xs text-muted-foreground">
                Enter text above to start analyzing sentiment
              </p>
            </div>
          </>
        ) : null}
      </div>
    </motion.div>
  );
};

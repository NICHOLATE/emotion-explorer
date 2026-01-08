import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smile, Meh, Frown, PartyPopper, ThumbsUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SentimentLabel } from '@/lib/sentimentAnalyzer';

interface SentimentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  sentiment: SentimentLabel;
  confidence: number;
  text: string;
}

export const SentimentPopup: React.FC<SentimentPopupProps> = ({
  isOpen,
  onClose,
  sentiment,
  confidence,
  text
}) => {
  const getConfig = () => {
    switch (sentiment) {
      case 'positive':
        return {
          icon: Smile,
          secondaryIcons: [PartyPopper, ThumbsUp, Heart],
          title: "Great News! 🎉",
          subtitle: "This text has positive sentiment",
          color: "text-emerald-400",
          bgGradient: "from-emerald-500/20 to-green-500/10",
          borderColor: "border-emerald-500/30",
          glowColor: "shadow-emerald-500/20"
        };
      case 'negative':
        return {
          icon: Frown,
          secondaryIcons: [],
          title: "Negative Sentiment Detected",
          subtitle: "This text shows negative emotions",
          color: "text-rose-400",
          bgGradient: "from-rose-500/20 to-red-500/10",
          borderColor: "border-rose-500/30",
          glowColor: "shadow-rose-500/20"
        };
      case 'neutral':
      default:
        return {
          icon: Meh,
          secondaryIcons: [],
          title: "Neutral Sentiment",
          subtitle: "This text is balanced or factual",
          color: "text-amber-400",
          bgGradient: "from-amber-500/20 to-yellow-500/10",
          borderColor: "border-amber-500/30",
          glowColor: "shadow-amber-500/20"
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`relative max-w-md w-full rounded-2xl bg-gradient-to-br ${config.bgGradient} border ${config.borderColor} shadow-2xl ${config.glowColor} p-6`}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Floating icons for positive sentiment */}
            {sentiment === 'positive' && (
              <>
                {config.secondaryIcons.map((SecIcon, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-emerald-400/60"
                    style={{
                      top: `${20 + i * 30}%`,
                      left: i % 2 === 0 ? '10%' : 'auto',
                      right: i % 2 === 1 ? '10%' : 'auto',
                    }}
                    animate={{
                      y: [-5, 5, -5],
                      rotate: [-5, 5, -5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  >
                    <SecIcon className="w-6 h-6" />
                  </motion.div>
                ))}
              </>
            )}

            {/* Main content */}
            <div className="text-center">
              {/* Icon */}
              <motion.div
                className="inline-flex mb-4"
                animate={sentiment === 'positive' ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className={`p-4 rounded-full bg-card/50 ${config.color}`}>
                  <Icon className="w-16 h-16" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                className={`text-2xl font-bold mb-2 ${config.color}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {config.title}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                className="text-muted-foreground mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {config.subtitle}
              </motion.p>

              {/* Confidence */}
              <motion.div
                className="mb-4 p-3 rounded-lg bg-card/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-sm text-muted-foreground mb-1">Confidence Score</p>
                <p className={`text-3xl font-bold ${config.color}`}>
                  {(confidence * 100).toFixed(1)}%
                </p>
              </motion.div>

              {/* Text preview */}
              <motion.div
                className="p-3 rounded-lg bg-card/30 text-left"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-xs text-muted-foreground mb-1">Analyzed Text:</p>
                <p className="text-sm line-clamp-3">{text}</p>
              </motion.div>

              {/* Action button */}
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button onClick={onClose} className="w-full">
                  Got it!
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

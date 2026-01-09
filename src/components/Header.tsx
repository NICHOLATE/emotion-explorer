import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareHeart, BarChart3, Sparkles, Zap } from 'lucide-react';
import { UsageGuide } from './UsageGuide';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  return (
    <motion.header
      className="relative py-12 text-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <motion.div
          className="flex items-center justify-center gap-3 mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl" />
            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30">
              <MessageSquareHeart className="w-8 h-8 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="gradient-text">Opinion</span>Me
        </motion.h1>

        <motion.p
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Understand the emotional tone of text using advanced AI. Analyze customer reviews, 
          social media posts, and feedback in real-time.
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Real-time Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Visual Insights</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI-Powered</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <UsageGuide />
        </motion.div>
      </div>
    </motion.header>
  );
};

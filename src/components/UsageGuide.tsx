import React from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Type, 
  Upload, 
  BarChart3, 
  Download, 
  Sparkles,
  CheckCircle2,
  XCircle,
  MinusCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const UsageGuide: React.FC = () => {
  const steps = [
    {
      icon: Type,
      title: "Enter Your Text",
      description: "Type or paste any text you want to analyze in the 'Single Text' tab. This could be a customer review, social media post, or any feedback.",
      color: "text-primary"
    },
    {
      icon: Upload,
      title: "Batch Upload",
      description: "For multiple texts, use the 'Batch Upload' tab. Upload TXT, JSON, or CSV files containing your texts for bulk analysis.",
      color: "text-purple-400"
    },
    {
      icon: Sparkles,
      title: "AI Analysis",
      description: "Our AI model analyzes each text to determine its emotional tone - positive, negative, or neutral - with confidence scores.",
      color: "text-amber-400"
    },
    {
      icon: BarChart3,
      title: "View Results",
      description: "See detailed results with sentiment distribution charts, keyword extraction, and individual text breakdowns.",
      color: "text-emerald-400"
    },
    {
      icon: Download,
      title: "Export Reports",
      description: "Download your analysis in PDF, CSV, or JSON format for presentations, reports, or further analysis.",
      color: "text-rose-400"
    }
  ];

  const sentimentGuide = [
    {
      icon: CheckCircle2,
      label: "Positive",
      description: "Indicates happy, satisfied, or enthusiastic sentiment",
      color: "text-emerald-400",
      examples: ["Great product!", "I love this service", "Exceeded my expectations"]
    },
    {
      icon: MinusCircle,
      label: "Neutral",
      description: "Neither positive nor negative, factual or balanced",
      color: "text-amber-400",
      examples: ["The product arrived on time", "It works as described", "Standard quality"]
    },
    {
      icon: XCircle,
      label: "Negative",
      description: "Indicates dissatisfaction, frustration, or disappointment",
      color: "text-rose-400",
      examples: ["Poor quality", "Waste of money", "Very disappointed"]
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="w-4 h-4" />
          How to Use
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            How to Use OpinionMe
          </DialogTitle>
          <DialogDescription>
            Follow these simple steps to analyze sentiment in your text
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Steps */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Getting Started</h3>
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="flex gap-4 p-4 rounded-lg bg-muted/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`p-2 rounded-lg bg-card ${step.color}`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium">
                    <span className="text-muted-foreground mr-2">{index + 1}.</span>
                    {step.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sentiment Guide */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-semibold text-lg">Understanding Sentiment Labels</h3>
            {sentimentGuide.map((sentiment) => (
              <div key={sentiment.label} className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <sentiment.icon className={`w-5 h-5 ${sentiment.color}`} />
                  <span className={`font-medium ${sentiment.color}`}>{sentiment.label}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{sentiment.description}</p>
                <div className="flex flex-wrap gap-2">
                  {sentiment.examples.map((example) => (
                    <span 
                      key={example} 
                      className="text-xs px-2 py-1 rounded-full bg-card border border-border"
                    >
                      "{example}"
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <h4 className="font-medium text-primary mb-2">💡 Pro Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Longer texts often provide more accurate sentiment analysis</li>
              <li>• The confidence score indicates how certain the AI is about its classification</li>
              <li>• Keywords highlight which words most influenced the sentiment result</li>
              <li>• All analysis runs locally in your browser - your data stays private!</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

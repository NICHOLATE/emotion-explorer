import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Trash2, PieChart, BarChart3, AlertCircle, RefreshCw } from 'lucide-react';
import { Header } from '@/components/Header';
import { TextInput } from '@/components/TextInput';
import { FileUpload } from '@/components/FileUpload';
import { SentimentResultCard } from '@/components/SentimentResultCard';
import { SentimentChart } from '@/components/SentimentChart';
import { SummaryStats } from '@/components/SummaryStats';
import { ExportOptions } from '@/components/ExportOptions';
import { ModelLoading } from '@/components/ModelLoading';
import { SplashScreen } from '@/components/SplashScreen';
import { SentimentPopup } from '@/components/SentimentPopup';
import { useSentimentAnalysis } from '@/hooks/useSentimentAnalysis';
import { calculateSummary, SentimentResult } from '@/lib/sentimentAnalyzer';
import { toast } from 'sonner';

const Index = () => {
  const {
    status,
    loadingProgress,
    error,
    isAnalyzing,
    results,
    loadModel,
    analyzeText,
    analyzeBatch,
    clearResults,
    removeResult,
  } = useSentimentAnalysis();

  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [batchTexts, setBatchTexts] = useState<string[]>([]);
  const [showSplash, setShowSplash] = useState(true);
  const [popupResult, setPopupResult] = useState<SentimentResult | null>(null);

  const summary = calculateSummary(results);

  useEffect(() => {
    // Pre-load model after splash
    if (!showSplash) {
      loadModel();
    }
  }, [showSplash]);

  const handleSingleAnalysis = async (text: string) => {
    const result = await analyzeText(text);
    if (result) {
      setPopupResult(result);
      toast.success(`Analyzed as ${result.label} with ${(result.confidence * 100).toFixed(0)}% confidence`);
    }
  };

  const handleBatchAnalysis = async () => {
    if (batchTexts.length === 0) return;
    
    const result = await analyzeBatch(batchTexts);
    toast.success(`Analyzed ${result.results.length} texts`);
    setBatchTexts([]);
  };

  const handleFileLoaded = (texts: string[]) => {
    setBatchTexts(texts);
    toast.info(`Loaded ${texts.length} texts from file`);
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sentiment Popup */}
      <SentimentPopup
        isOpen={!!popupResult}
        onClose={() => setPopupResult(null)}
        sentiment={popupResult?.label || 'neutral'}
        confidence={popupResult?.confidence || 0}
        text={popupResult?.text || ''}
      />

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Header />

        {/* Main content */}
        <div className="space-y-8">
          {/* Input section */}
          <motion.section
            className="glass-card rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="single">Single Text</TabsTrigger>
                <TabsTrigger value="batch">Batch Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="single">
                <TextInput
                  onSubmit={handleSingleAnalysis}
                  isLoading={isAnalyzing || status === 'loading'}
                />
              </TabsContent>

              <TabsContent value="batch" className="space-y-4">
                <FileUpload
                  onTextsLoaded={handleFileLoaded}
                  isDisabled={isAnalyzing || status === 'loading'}
                />
                {batchTexts.length > 0 && (
                  <motion.div
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-sm">
                      <span className="font-medium text-primary">{batchTexts.length}</span> texts ready for analysis
                    </p>
                    <Button
                      onClick={handleBatchAnalysis}
                      disabled={isAnalyzing || status === 'loading'}
                      className="gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze All'
                      )}
                    </Button>
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </motion.section>

          {/* Model loading state */}
          <AnimatePresence>
            {(status === 'loading' || status === 'idle') && results.length === 0 && (
              <ModelLoading progress={loadingProgress} status={status} />
            )}
          </AnimatePresence>

          {/* Error state */}
          {error && (
            <motion.div
              className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={loadModel}
                className="ml-auto"
              >
                Retry
              </Button>
            </motion.div>
          )}

          {/* Results section */}
          {results.length > 0 && (
            <motion.section
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {/* Summary stats */}
              <SummaryStats summary={summary} />

              {/* Charts and actions */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Chart */}
                <motion.div
                  className="lg:col-span-2 glass-card rounded-2xl p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Sentiment Distribution</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={chartType === 'pie' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setChartType('pie')}
                      >
                        <PieChart className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={chartType === 'bar' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setChartType('bar')}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <SentimentChart results={results} type={chartType} />
                </motion.div>

                {/* Actions */}
                <motion.div
                  className="glass-card rounded-2xl p-6 space-y-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h3 className="text-lg font-semibold">Actions</h3>
                  <div className="space-y-3">
                    <ExportOptions results={results} />
                    <Button
                      variant="outline"
                      className="w-full gap-2 text-destructive hover:text-destructive"
                      onClick={clearResults}
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All Results
                    </Button>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Analysis runs locally in your browser using Hugging Face Transformers. 
                      Your data never leaves your device.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Results list */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {results.map((result, index) => (
                      <SentimentResultCard
                        key={result.id}
                        result={result}
                        onRemove={removeResult}
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.section>
          )}
        </div>

        {/* Footer */}
        <motion.footer
          className="mt-16 py-8 text-center text-sm text-muted-foreground border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-lg font-semibold text-foreground mb-2">
            <span className="gradient-text">Opinion</span>Me
          </p>
          <p className="flex items-center justify-center gap-2 mb-2">
            <span>Powered by</span>
            <span className="font-semibold text-primary">AI Syndicate</span>
          </p>
          <p className="text-xs">
            Analysis runs locally in your browser using Hugging Face Transformers
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;

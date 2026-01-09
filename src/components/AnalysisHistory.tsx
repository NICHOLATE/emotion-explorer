import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, Edit2, Check, X, Clock, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { HistorySession } from '@/hooks/useAnalysisHistory';
import { SentimentResult } from '@/lib/sentimentAnalyzer';

interface AnalysisHistoryProps {
  sessions: HistorySession[];
  onLoadSession: (results: SentimentResult[]) => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, name: string) => void;
  onClearHistory: () => void;
  onCompareSession?: (session: HistorySession) => void;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({
  sessions,
  onLoadSession,
  onDeleteSession,
  onRenameSession,
  onClearHistory,
  onCompareSession,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleStartEdit = (session: HistorySession) => {
    setEditingId(session.id);
    setEditName(session.name);
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      onRenameSession(id, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleLoadSession = (session: HistorySession) => {
    onLoadSession(session.results);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <History className="w-4 h-4" />
          History
          {sessions.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {sessions.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Analysis History
          </SheetTitle>
          <SheetDescription>
            View and restore your previous analysis sessions
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {sessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <History className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No analysis history yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Your completed analyses will appear here
              </p>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {sessions.length} saved session{sessions.length !== 1 ? 's' : ''}
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Clear All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all saved analysis sessions. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={onClearHistory} className="bg-destructive text-destructive-foreground">
                        Clear All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-3 pr-4">
                  <AnimatePresence mode="popLayout">
                    {sessions.map((session, index) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-card rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          {editingId === session.id ? (
                            <div className="flex items-center gap-2 flex-1">
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-8"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveEdit(session.id);
                                  if (e.key === 'Escape') handleCancelEdit();
                                }}
                              />
                              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleSaveEdit(session.id)}>
                                <Check className="w-4 h-4 text-emerald-400" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelEdit}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{session.name}</h4>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" />
                                {session.createdAt.toLocaleDateString()} at {session.createdAt.toLocaleTimeString()}
                              </p>
                            </div>
                          )}

                          {editingId !== session.id && (
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleStartEdit(session)}>
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => onDeleteSession(session.id)}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Summary badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {session.summary.total} texts
                          </Badge>
                          {session.summary.positive > 0 && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                              {session.summary.positive} positive
                            </Badge>
                          )}
                          {session.summary.negative > 0 && (
                            <Badge className="bg-rose-500/20 text-rose-400 border-0 text-xs">
                              {session.summary.negative} negative
                            </Badge>
                          )}
                          {session.summary.neutral > 0 && (
                            <Badge className="bg-amber-500/20 text-amber-400 border-0 text-xs">
                              {session.summary.neutral} neutral
                            </Badge>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 gap-1" onClick={() => handleLoadSession(session)}>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            Load
                          </Button>
                          {onCompareSession && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => {
                                onCompareSession(session);
                                setIsOpen(false);
                              }}
                            >
                              Compare
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

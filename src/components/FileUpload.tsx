import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseTextFile } from '@/lib/sentimentAnalyzer';

interface FileUploadProps {
  onTextsLoaded: (texts: string[]) => void;
  isDisabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onTextsLoaded, isDisabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFile = async (file: File) => {
    setError(null);

    // Check file type
    const validTypes = ['text/plain', 'application/json', 'text/csv'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(txt|json|csv)$/i)) {
      setError('Please upload a .txt, .json, or .csv file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      const content = await file.text();
      const texts = parseTextFile(content);

      if (texts.length === 0) {
        setError('No valid text entries found in file');
        return;
      }

      setFile(file);
      onTextsLoaded(texts);
    } catch (err) {
      setError('Failed to read file');
      console.error(err);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      await processFile(droppedFile);
    }
  }, [onTextsLoaded]);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await processFile(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className="space-y-3">
      <motion.div
        className={`file-drop-zone cursor-pointer transition-all ${
          isDragging ? 'border-primary bg-primary/5' : ''
        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-muted-foreground/40'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <input
          type="file"
          accept=".txt,.json,.csv"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          disabled={isDisabled}
        />
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center gap-3 ${isDisabled ? '' : 'cursor-pointer'}`}
        >
          <div className={`p-3 rounded-full bg-muted ${isDragging ? 'bg-primary/20' : ''}`}>
            <Upload className={`w-6 h-6 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Drop your file here, or <span className="text-primary">browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports .txt, .json, .csv (max 5MB)
            </p>
          </div>
        </label>
      </motion.div>

      {file && (
        <motion.div
          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FileText className="w-5 h-5 text-primary" />
          <span className="text-sm flex-1 truncate">{file.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFile}
            className="h-7 w-7 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {error && (
        <motion.div
          className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, FileJson, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SentimentResult, exportToCSV, exportToJSON, calculateSummary } from '@/lib/sentimentAnalyzer';
import { jsPDF } from 'jspdf';

interface ExportOptionsProps {
  results: SentimentResult[];
  disabled?: boolean;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ results, disabled }) => {
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(results);
    downloadFile(csv, `sentiment-analysis-${Date.now()}.csv`, 'text/csv');
  };

  const handleExportJSON = () => {
    const json = exportToJSON(results);
    downloadFile(json, `sentiment-analysis-${Date.now()}.json`, 'application/json');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const summary = calculateSummary(results);
    
    // Brand Header
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246);
    doc.text('OpinionMe', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Powered by AI Syndicate', 20, 28);
    
    // Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Sentiment Analysis Report', 20, 42);
    
    // Timestamp
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 50);
    
    // Summary section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Summary', 20, 65);
    
    doc.setFontSize(11);
    doc.text(`Total Analyzed: ${summary.total}`, 25, 75);
    doc.setTextColor(34, 197, 94);
    doc.text(`Positive: ${summary.positive} (${((summary.positive / summary.total) * 100).toFixed(1)}%)`, 25, 82);
    doc.setTextColor(239, 68, 68);
    doc.text(`Negative: ${summary.negative} (${((summary.negative / summary.total) * 100).toFixed(1)}%)`, 25, 89);
    doc.setTextColor(234, 179, 8);
    doc.text(`Neutral: ${summary.neutral} (${((summary.neutral / summary.total) * 100).toFixed(1)}%)`, 25, 96);
    doc.setTextColor(128, 128, 128);
    doc.text(`Average Confidence: ${(summary.averageConfidence * 100).toFixed(1)}%`, 25, 103);
    
    // Results section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Detailed Results', 20, 118);
    
    let yPos = 128;
    const pageHeight = doc.internal.pageSize.height;
    
    results.forEach((result, index) => {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }
      
      // Sentiment color
      const colors: Record<string, [number, number, number]> = {
        positive: [34, 197, 94],
        negative: [239, 68, 68],
        neutral: [234, 179, 8],
      };
      
      doc.setFontSize(10);
      doc.setTextColor(...colors[result.label]);
      doc.text(`[${result.label.toUpperCase()}] ${(result.confidence * 100).toFixed(1)}% confidence`, 20, yPos);
      
      doc.setTextColor(60, 60, 60);
      const text = result.text.length > 100 ? result.text.substring(0, 100) + '...' : result.text;
      const lines = doc.splitTextToSize(text, 170);
      doc.text(lines, 20, yPos + 6);
      
      yPos += 8 + (lines.length * 5) + 5;
    });
    
    doc.save(`sentiment-analysis-${Date.now()}.pdf`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled || results.length === 0}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleExportCSV} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON} className="gap-2 cursor-pointer">
          <FileJson className="w-4 h-4 text-amber-400" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
          <FileText className="w-4 h-4 text-rose-400" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

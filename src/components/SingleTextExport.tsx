import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileJson, FileSpreadsheet } from "lucide-react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import { SentimentResult } from "@/lib/sentimentAnalyzer";

interface SingleTextExportProps {
  result: SentimentResult;
}

export const SingleTextExport = ({ result }: SingleTextExportProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    const headers = ["Text", "Sentiment", "Confidence", "Positive Score", "Negative Score", "Neutral Score", "Keywords", "Timestamp"];
    const keywords = result.keywords.map(k => k.word).join(", ");
    const row = [
      `"${result.text.replace(/"/g, '""')}"`,
      result.label,
      (result.confidence * 100).toFixed(1) + "%",
      (result.scores.positive * 100).toFixed(1) + "%",
      (result.scores.negative * 100).toFixed(1) + "%",
      (result.scores.neutral * 100).toFixed(1) + "%",
      `"${keywords}"`,
      new Date(result.timestamp).toISOString(),
    ];
    const csv = headers.join(",") + "\n" + row.join(",");
    downloadFile(csv, `opinionme-analysis-${Date.now()}.csv`, "text/csv");
    setTimeout(() => setIsExporting(false), 500);
  };

  const handleExportJSON = () => {
    setIsExporting(true);
    const exportData = {
      analysis: {
        text: result.text,
        sentiment: result.label,
        confidence: result.confidence,
        scores: result.scores,
        keywords: result.keywords.map(k => k.word),
        timestamp: result.timestamp,
      },
      exportedAt: new Date().toISOString(),
      exportedBy: "OpinionMe by AI Syndicate",
    };
    downloadFile(JSON.stringify(exportData, null, 2), `opinionme-analysis-${Date.now()}.json`, "application/json");
    setTimeout(() => setIsExporting(false), 500);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const keywords = result.keywords.map(k => k.word);
    
    // Header
    pdf.setFillColor(30, 41, 59);
    pdf.rect(0, 0, pageWidth, 40, "F");
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("OpinionMe", 20, 25);
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("Powered by AI Syndicate", pageWidth - 60, 25);
    
    // Sentiment Result
    pdf.setTextColor(30, 41, 59);
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("Sentiment Analysis Report", 20, 55);
    
    // Analysis Date
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 65);
    
    // Sentiment Badge
    const sentimentColors: Record<string, [number, number, number]> = {
      positive: [34, 197, 94],
      negative: [239, 68, 68],
      neutral: [234, 179, 8],
    };
    const color = sentimentColors[result.label];
    pdf.setFillColor(color[0], color[1], color[2]);
    pdf.roundedRect(20, 75, 60, 12, 3, 3, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text(result.label.toUpperCase(), 35, 83);
    
    // Confidence
    pdf.setTextColor(30, 41, 59);
    pdf.setFontSize(12);
    pdf.text(`Confidence: ${(result.confidence * 100).toFixed(1)}%`, 90, 83);
    
    // Score Breakdown
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Score Breakdown", 20, 105);
    
    const scores = [
      { label: "Positive", value: result.scores.positive, color: [34, 197, 94] as [number, number, number] },
      { label: "Negative", value: result.scores.negative, color: [239, 68, 68] as [number, number, number] },
      { label: "Neutral", value: result.scores.neutral, color: [234, 179, 8] as [number, number, number] },
    ];
    
    let yPos = 115;
    scores.forEach((score) => {
      pdf.setFillColor(241, 245, 249);
      pdf.roundedRect(20, yPos, 150, 8, 2, 2, "F");
      pdf.setFillColor(score.color[0], score.color[1], score.color[2]);
      pdf.roundedRect(20, yPos, 150 * score.value, 8, 2, 2, "F");
      pdf.setTextColor(30, 41, 59);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${score.label}: ${(score.value * 100).toFixed(1)}%`, 20, yPos + 18);
      yPos += 25;
    });
    
    // Keywords
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Key Sentiment Drivers", 20, yPos + 10);
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(71, 85, 105);
    if (keywords.length > 0) {
      pdf.text(keywords.join(", "), 20, yPos + 22);
    } else {
      pdf.text("No specific keywords identified", 20, yPos + 22);
    }
    
    // Analyzed Text
    pdf.setTextColor(30, 41, 59);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Analyzed Text", 20, yPos + 40);
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(71, 85, 105);
    const splitText = pdf.splitTextToSize(result.text, pageWidth - 40);
    pdf.text(splitText, 20, yPos + 52);
    
    // Footer
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFillColor(241, 245, 249);
    pdf.rect(0, pageHeight - 20, pageWidth, 20, "F");
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(8);
    pdf.text("OpinionMe - AI-Powered Sentiment Analysis | Powered by AI Syndicate", pageWidth / 2, pageHeight - 8, { align: "center" });
    
    pdf.save(`opinionme-analysis-${Date.now()}.pdf`);
    setTimeout(() => setIsExporting(false), 500);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            disabled={isExporting}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-card border-border/50">
        <DropdownMenuItem 
          onClick={handleExportPDF}
          className="gap-2 cursor-pointer hover:bg-primary/10 transition-colors"
        >
          <FileText className="h-4 w-4 text-red-500" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleExportCSV}
          className="gap-2 cursor-pointer hover:bg-primary/10 transition-colors"
        >
          <FileSpreadsheet className="h-4 w-4 text-green-500" />
          <span>Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleExportJSON}
          className="gap-2 cursor-pointer hover:bg-primary/10 transition-colors"
        >
          <FileJson className="h-4 w-4 text-blue-500" />
          <span>Export as JSON</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, Download, RefreshCcw, FileType } from "lucide-react";
import { convertPdfToWord } from "@/utils/pdfToWord";
import { downloadFile, formatBytes } from "@/utils/download";

export default function PdfToWordTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const out = await convertPdfToWord(file);
      setResult(out);
    } catch (error) {
      console.error(error);
      alert("Conversion failed. Scanned PDFs may not have extractable text.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (result) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl space-y-6">
        <p className="font-bold text-lg text-center">Word document ready</p>
        <div className="p-4 bg-white rounded-xl border flex items-center gap-3">
          <FileType className="w-6 h-6 text-emerald-600" />
          <div>
            <p className="font-medium">{result.name}</p>
            <p className="text-xs text-secondary-foreground">{formatBytes(result.size)}</p>
          </div>
        </div>
        <p className="text-xs text-secondary-foreground">Text-based PDFs convert best. Layout and images are not preserved.</p>
        <button onClick={() => downloadFile(result)} className="w-full py-4 rounded-xl font-bold text-white bg-primary flex items-center justify-center gap-2">
          <Download className="w-5 h-5" /> Download DOCX
        </button>
        <button onClick={() => { setResult(null); setFile(null); }} className="w-full py-2 text-sm text-primary">Convert another</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {!file ? (
        <div onClick={() => fileInputRef.current?.click()} className="w-full p-10 border-3 border-dashed border-primary/30 rounded-3xl bg-white/30 cursor-pointer flex flex-col items-center gap-4">
          <UploadCloud className="w-10 h-10 text-primary" />
          <p className="font-bold">Upload PDF to convert to Word</p>
          <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border">
            <FileText className="w-5 h-5 text-primary" />
            <span className="truncate font-medium">{file.name}</span>
            <button onClick={() => setFile(null)} className="text-xs text-red-500 ml-auto">Change</button>
          </div>
          <button onClick={handleConvert} disabled={isProcessing} className="w-full py-4 rounded-xl font-bold text-white bg-primary disabled:opacity-50 flex items-center justify-center gap-2">
            {isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <FileType className="w-5 h-5" />}
            {isProcessing ? "Converting..." : "Convert to Word"}
          </button>
        </div>
      )}
    </div>
  );
}

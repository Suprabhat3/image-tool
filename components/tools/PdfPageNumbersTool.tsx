"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, Download, RefreshCcw, Hash } from "lucide-react";
import { addPageNumbersAndHeaders, type PageNumberPosition } from "@/utils/pdfProcessor";
import { downloadFile } from "@/utils/download";

export default function PdfPageNumbersTool() {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<PageNumberPosition>("bottom-center");
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [startNumber, setStartNumber] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleApply = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const out = await addPageNumbersAndHeaders(file, {
        position,
        headerText,
        footerText,
        startNumber,
      });
      setResult(out);
    } catch {
      alert("Failed to add page numbers.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (result) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl text-center space-y-6">
        <p className="font-bold text-lg">Page numbers added!</p>
        <button onClick={() => downloadFile(result)} className="w-full py-4 rounded-xl font-bold text-white bg-primary flex items-center justify-center gap-2">
          <Download className="w-5 h-5" /> Download {result.name}
        </button>
        <button onClick={() => { setResult(null); setFile(null); }} className="text-sm text-primary">Start over</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {!file ? (
        <div onClick={() => fileInputRef.current?.click()} className="w-full p-10 border-3 border-dashed border-primary/30 rounded-3xl bg-white/30 cursor-pointer flex flex-col items-center gap-4">
          <UploadCloud className="w-10 h-10 text-primary" />
          <p className="font-bold">Select PDF</p>
          <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border"><FileText className="w-5 h-5" /><span className="truncate">{file.name}</span></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">Number position</label>
              <select value={position} onChange={(e) => setPosition(e.target.value as PageNumberPosition)} className="w-full mt-1 px-3 py-2 rounded-xl border">
                <option value="bottom-center">Bottom center</option>
                <option value="bottom-left">Bottom left</option>
                <option value="bottom-right">Bottom right</option>
                <option value="top-center">Top center</option>
                <option value="top-left">Top left</option>
                <option value="top-right">Top right</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold">Start at</label>
              <input type="number" min={1} value={startNumber} onChange={(e) => setStartNumber(Number(e.target.value))} className="w-full mt-1 px-3 py-2 rounded-xl border" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">Header text (optional)</label>
            <input value={headerText} onChange={(e) => setHeaderText(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl border" placeholder="Document title" />
          </div>
          <div>
            <label className="text-sm font-semibold">Footer text (optional)</label>
            <input value={footerText} onChange={(e) => setFooterText(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl border" placeholder="Confidential" />
          </div>
          <button onClick={handleApply} disabled={isProcessing} className="w-full py-4 rounded-xl font-bold text-white bg-primary disabled:opacity-50 flex items-center justify-center gap-2">
            {isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Hash className="w-5 h-5" />}
            Add Page Numbers
          </button>
        </div>
      )}
    </div>
  );
}

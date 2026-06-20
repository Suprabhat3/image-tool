"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileText, Download, RefreshCcw, Scissors } from "lucide-react";
import { splitPdf, type SplitRange } from "@/utils/pdfProcessor";
import { downloadFile, downloadFilesAsZip } from "@/utils/download";

export default function PdfSplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"each" | "ranges">("each");
  const [rangeInput, setRangeInput] = useState("1-3");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseRanges = (input: string): SplitRange[] => {
    return input
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [start, end] = part.split("-").map(Number);
        if (!start || !end) throw new Error(`Invalid range: ${part}`);
        return { start, end };
      });
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const ranges = mode === "ranges" ? parseRanges(rangeInput) : undefined;
      const files = await splitPdf(file, mode, ranges);
      setResults(files);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Split failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (results.length > 0) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <h3 className="font-bold text-lg">Split into {results.length} file(s)</h3>
        <ul className="space-y-2 max-h-48 overflow-y-auto">
          {results.map((f, i) => (
            <li key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
              <span className="text-sm truncate flex items-center gap-2">
                <FileText className="w-4 h-4 shrink-0" /> {f.name}
              </span>
              <button onClick={() => downloadFile(f)} className="text-xs font-semibold text-primary hover:underline shrink-0">
                Download
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-3">
          <button
            onClick={() => downloadFilesAsZip(results, "split_pdfs.zip")}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" /> Download ZIP
          </button>
          <button onClick={() => { setResults([]); setFile(null); }} className="py-3 px-4 rounded-xl font-bold border border-gray-200 bg-white">
            Reset
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === "application/pdf") setFile(f); }}
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-10 border-3 border-dashed border-primary/30 rounded-3xl bg-white/30 cursor-pointer flex flex-col items-center gap-4"
        >
          <UploadCloud className="w-10 h-10 text-primary" />
          <p className="font-bold">Select a PDF to split</p>
          <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-medium truncate flex-1">{file.name}</span>
            <button onClick={() => setFile(null)} className="text-xs text-red-500">Change</button>
          </div>

          <div className="flex gap-2">
            {(["each", "ranges"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${mode === m ? "bg-primary text-white border-primary" : "bg-white border-gray-200"}`}
              >
                {m === "each" ? "Every page" : "Custom ranges"}
              </button>
            ))}
          </div>

          {mode === "ranges" && (
            <div>
              <label className="text-sm font-semibold">Page ranges (e.g. 1-3, 5-7)</label>
              <input
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                className="w-full mt-2 px-3 py-2 rounded-xl border border-gray-200"
                placeholder="1-3, 5-7"
              />
            </div>
          )}

          <button
            onClick={handleSplit}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl font-bold text-white bg-primary disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Scissors className="w-5 h-5" />}
            {isProcessing ? "Splitting..." : "Split PDF"}
          </button>
        </div>
      )}
    </div>
  );
}

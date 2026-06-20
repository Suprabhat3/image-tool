"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Download, RefreshCcw, Repeat } from "lucide-react";
import { convertImageFormat, IMAGE_FORMATS } from "@/utils/imageProcessor";
import { downloadFile, formatBytes } from "@/utils/download";
import CompareSlider from "@/components/CompareSlider";

export default function FormatConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState("image/webp");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const out = await convertImageFormat(file, targetFormat);
      setResult(out);
      setOriginalUrl(URL.createObjectURL(file));
      setResultUrl(URL.createObjectURL(out));
    } catch {
      alert("Conversion failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (result && originalUrl && resultUrl) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <CompareSlider beforeUrl={originalUrl} afterUrl={resultUrl} />
        <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl flex justify-between items-center">
          <div className="text-sm">
            <p>{file?.name} → {result.name}</p>
            <p className="text-secondary-foreground">{formatBytes(file!.size)} → {formatBytes(result.size)}</p>
          </div>
          <button onClick={() => downloadFile(result)} className="py-3 px-6 rounded-xl font-bold text-white bg-primary flex items-center gap-2">
            <Download className="w-5 h-5" /> Download
          </button>
        </div>
        <button onClick={() => { setResult(null); setFile(null); }} className="w-full text-sm text-primary">Convert another</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {!file ? (
        <div onClick={() => fileInputRef.current?.click()} className="w-full p-10 border-3 border-dashed border-primary/30 rounded-3xl bg-white/30 cursor-pointer flex flex-col items-center gap-4">
          <UploadCloud className="w-10 h-10 text-primary" />
          <p className="font-bold">Select an image to convert</p>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl space-y-4">
          <p className="font-medium truncate">{file.name}</p>
          <select value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)} className="w-full px-3 py-2 rounded-xl border">
            {IMAGE_FORMATS.map((f) => (
              <option key={f.value} value={f.value}>Convert to {f.label}</option>
            ))}
          </select>
          <button onClick={handleConvert} disabled={isProcessing} className="w-full py-4 rounded-xl font-bold text-white bg-primary disabled:opacity-50 flex items-center justify-center gap-2">
            {isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Repeat className="w-5 h-5" />}
            Convert
          </button>
        </div>
      )}
    </div>
  );
}

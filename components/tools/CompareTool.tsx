"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, SlidersHorizontal } from "lucide-react";
import CompareSlider from "@/components/CompareSlider";
import { compressImage } from "@/utils/imageProcessor";
import { formatBytes } from "@/utils/download";

export default function CompareTool() {
  const [original, setOriginal] = useState<File | null>(null);
  const [processed, setProcessed] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [processedUrl, setProcessedUrl] = useState("");
  const [quality, setQuality] = useState(60);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = async (file: File) => {
    setOriginal(file);
    setIsProcessing(true);
    try {
      const out = await compressImage(file, quality, file.type);
      setProcessed(out);
      setOriginalUrl(URL.createObjectURL(file));
      setProcessedUrl(URL.createObjectURL(out));
    } finally {
      setIsProcessing(false);
    }
  };

  const reprocess = async () => {
    if (!original) return;
    setIsProcessing(true);
    try {
      const out = await compressImage(original, quality, original.type);
      setProcessed(out);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
      setProcessedUrl(URL.createObjectURL(out));
    } finally {
      setIsProcessing(false);
    }
  };

  if (original && processed && originalUrl && processedUrl) {
    const reduction = ((original.size - processed.size) / original.size) * 100;
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <CompareSlider beforeUrl={originalUrl} afterUrl={processedUrl} />
        <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between text-sm font-medium">
            <span>Original: {formatBytes(original.size)}</span>
            <span className="text-primary">Compressed: {formatBytes(processed.size)} (−{reduction.toFixed(1)}%)</span>
          </div>
          <div>
            <label className="text-sm font-semibold">Quality: {quality}%</label>
            <input type="range" min={10} max={95} value={quality} onChange={(e) => setQuality(Number(e.target.value))} onMouseUp={reprocess} onTouchEnd={reprocess} className="w-full accent-primary" />
          </div>
          <button onClick={() => { setOriginal(null); setProcessed(null); }} className="text-sm text-primary">Try another image</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-full p-10 border-3 border-dashed border-primary/30 rounded-3xl bg-white/30 cursor-pointer flex flex-col items-center gap-4"
      >
        {isProcessing ? (
          <p className="font-bold">Processing...</p>
        ) : (
          <>
            <SlidersHorizontal className="w-10 h-10 text-primary" />
            <UploadCloud className="w-8 h-8 text-primary/60" />
            <p className="font-bold">Upload an image to compare before & after</p>
          </>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleSelect(e.target.files[0])} />
      </div>
    </div>
  );
}

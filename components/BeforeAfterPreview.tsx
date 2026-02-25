"use client";

import React, { useEffect, useState } from "react";
import { Download, ArrowLeft, Image as ImageIcon } from "lucide-react";

interface BeforeAfterPreviewProps {
  original: File;
  processed: File;
  onReset: () => void;
}

export default function BeforeAfterPreview({
  original,
  processed,
  onReset,
}: BeforeAfterPreviewProps) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [processedUrl, setProcessedUrl] = useState("");

  useEffect(() => {
    const origUrl = URL.createObjectURL(original);
    const procUrl = URL.createObjectURL(processed);
    setOriginalUrl(origUrl);
    setProcessedUrl(procUrl);

    return () => {
      URL.revokeObjectURL(origUrl);
      URL.revokeObjectURL(procUrl);
    };
  }, [original, processed]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const sizeReduction =
    ((original.size - processed.size) / original.size) * 100;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = processedUrl;
    link.download = processed.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel w-full max-w-5xl mx-auto rounded-3xl p-8 flex flex-col gap-8 relative z-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left bg-primary/5 p-6 rounded-2xl border border-primary/20">
        <div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
            Processing Complete! 🎉
          </h2>
          <p className="text-lg text-secondary-foreground mt-2">
            Image size reduced by{" "}
            <strong className="text-primary text-xl font-bold bg-white px-2 py-0.5 rounded-md shadow-sm">
              {sizeReduction.toFixed(1)}%
            </strong>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="py-3 px-5 rounded-xl flex items-center justify-center gap-2 font-semibold text-foreground bg-white hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <button
            onClick={handleDownload}
            className="py-3 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-primary-foreground bg-primary hover:bg-primary/90 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:-translate-y-0.5 transition-all"
          >
            <Download className="w-5 h-5" /> Download Image
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Original */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center bg-white/60 p-4 rounded-xl border border-black/5 shadow-sm">
            <span className="font-semibold text-foreground flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-500" /> Original
            </span>
            <span className="font-mono bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-bold shadow-inner">
              {formatSize(original.size)}
            </span>
          </div>
          <div className="relative aspect-video bg-black/5 rounded-2xl overflow-hidden shadow-inner border border-primary/10">
            {originalUrl && (
              <img
                src={originalUrl}
                alt="Original"
                className="w-full h-full object-contain"
              />
            )}
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
              Before
            </div>
          </div>
        </div>

        {/* Processed */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center bg-primary/10 p-4 rounded-xl border border-primary/30 shadow-sm">
            <span className="font-bold text-primary flex items-center gap-2">
              <ImageIcon className="w-5 h-5" /> Compressed
            </span>
            <span className="font-mono bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-sm ring-2 ring-primary/20">
              {formatSize(processed.size)}
            </span>
          </div>
          <div className="relative aspect-video bg-white rounded-2xl overflow-hidden shadow-md border-2 border-primary/20">
            {processedUrl && (
              <img
                src={processedUrl}
                alt="Processed"
                className="w-full h-full object-contain"
              />
            )}
            <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded font-bold shadow-sm">
              After
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

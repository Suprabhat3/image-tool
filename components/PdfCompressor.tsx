"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Download, RefreshCcw, CheckCircle2, Zap } from "lucide-react";
import { compressPdf } from "@/utils/pdfProcessor";

export default function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(60);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (selected.type === "application/pdf") {
        setFile(selected);
        setCompressedFile(null);
      } else {
        alert("Please select a valid PDF file.");
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selected = e.dataTransfer.files[0];
      if (selected.type === "application/pdf") {
        setFile(selected);
        setCompressedFile(null);
      } else {
        alert("Please drop a valid PDF file.");
      }
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const result = await compressPdf(file, quality);
      setCompressedFile(result);
    } catch (error) {
      console.error("Failed to compress PDF:", error);
      alert("Failed to compress PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setCompressedFile(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (compressedFile && file) {
    const originalSize = file.size;
    const newSize = compressedFile.size;
    const reduction = originalSize > 0 ? ((originalSize - newSize) / originalSize) * 100 : 0;
    const isSmaller = newSize < originalSize;
    const url = URL.createObjectURL(compressedFile);

    return (
      <div className="w-full max-w-2xl mx-auto p-6 sm:p-10 bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center gap-6 animate-fade-in-up">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">Compression Complete!</h2>
        
        <div className="grid grid-cols-2 gap-4 w-full my-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-secondary-foreground font-semibold uppercase tracking-wider mb-1">Original Size</p>
            <p className="text-xl font-bold text-gray-700">{formatBytes(originalSize)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
            {isSmaller && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                -{reduction.toFixed(0)}%
              </div>
            )}
            <p className="text-xs text-secondary-foreground font-semibold uppercase tracking-wider mb-1">New Size</p>
            <p className={`text-xl font-bold ${isSmaller ? 'text-emerald-600' : 'text-amber-600'}`}>
              {formatBytes(newSize)}
            </p>
          </div>
        </div>

        {!isSmaller && (
          <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
            Note: This PDF could not be compressed further. Some PDFs are already heavily optimized or do not contain compressible images.
          </p>
        )}
        
        <div className="flex gap-4 w-full mt-4">
          <button
            onClick={handleReset}
            className="flex-1 py-3 px-6 rounded-xl font-bold text-foreground bg-white hover:bg-gray-50 border border-gray-200 transition-all"
          >
            Compress Another
          </button>
          <a
            href={url}
            download={compressedFile.name}
            className="flex-1 py-3 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" /> Download PDF
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-10 sm:p-16 border-3 border-dashed border-primary/30 rounded-3xl bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-4 group"
        >
          <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
            <UploadCloud className="w-10 h-10 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">Select a PDF file</h3>
            <p className="text-sm text-secondary-foreground mt-2">Drag & drop or click to browse</p>
          </div>
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-6 sm:p-8 shadow-xl animate-fade-in-up">
          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
            <div className="p-3 bg-primary/10 rounded-xl shrink-0">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="truncate flex-1">
              <h4 className="font-bold text-foreground truncate">{file.name}</h4>
              <p className="text-xs text-secondary-foreground">{formatBytes(file.size)}</p>
            </div>
            <button 
              onClick={handleReset}
              className="text-xs font-semibold text-secondary-foreground hover:text-red-500 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-red-50 transition-colors shrink-0"
            >
              Change
            </button>
          </div>

          <div className="space-y-4 mb-8">
            <label className="flex justify-between items-center text-sm font-semibold text-foreground">
              <span>Image Compression Quality</span>
              <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md font-mono">{quality}%</span>
            </label>
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <p className="text-xs text-secondary-foreground leading-relaxed">
              Lower quality results in smaller file sizes but reduced image clarity. Note: Only embedded JPEG images will be compressed.
            </p>
          </div>

          <button
            onClick={handleCompress}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <><RefreshCcw className="w-5 h-5 animate-spin" /> Compressing...</>
            ) : (
              <><Zap className="w-5 h-5" /> Compress PDF</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

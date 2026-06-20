"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  FileText,
  Download,
  RefreshCcw,
  CheckCircle2,
  FileType,
} from "lucide-react";
import {
  convertDocxToPdf,
  isDocxFile,
  type PageOrientation,
  type PageSize,
} from "@/utils/pdfProcessor";

export default function DocsToPdfConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedFile, setConvertedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<PageOrientation>("portrait");
  const [margin, setMargin] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (selected: File) => {
    if (!isDocxFile(selected)) {
      alert("Please select a valid .docx Word document.");
      return;
    }
    setFile(selected);
    setConvertedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFileSelect(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const selected = e.dataTransfer.files?.[0];
    if (selected) handleFileSelect(selected);
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const result = await convertDocxToPdf(file, { pageSize, orientation, margin });
      setConvertedFile(result);
      const url = URL.createObjectURL(result);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } catch (error) {
      console.error("Failed to convert document:", error);
      alert("Failed to convert document. Please try again with a valid .docx file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setConvertedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (convertedFile && file && previewUrl) {
    return (
      <div
        className={`w-full mx-auto space-y-6 animate-fade-in-up ${"max-w-6xl"}`}
      >
        <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-4 sm:p-8 shadow-xl flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-[40%] flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Conversion Complete!</h2>
              <p className="text-sm text-secondary-foreground">
                Your Word document has been converted to PDF.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <FileText className="w-4 h-4 text-secondary-foreground shrink-0" />
                <div className="truncate flex-1">
                  <p className="text-xs text-secondary-foreground">Original</p>
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-secondary-foreground">{formatBytes(file.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                <FileType className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="truncate flex-1">
                  <p className="text-xs text-secondary-foreground">PDF Output</p>
                  <p className="text-sm font-medium truncate text-emerald-700">{convertedFile.name}</p>
                  <p className="text-xs text-secondary-foreground">{formatBytes(convertedFile.size)}</p>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <a
                href={previewUrl}
                download={convertedFile.name}
                className="w-full py-4 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download PDF
              </a>
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl font-bold text-secondary-foreground bg-white hover:bg-gray-50 border border-gray-200 transition-all text-sm"
              >
                Convert Another
              </button>
            </div>
          </div>

          <div className="w-full lg:w-[60%] flex flex-col items-center">
            <h3 className="font-bold text-lg text-foreground mb-4 w-full text-left">Preview</h3>
            <div className="w-full h-[60vh] lg:h-[75vh] rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-gray-100">
              <iframe
                src={`${previewUrl}#view=FitH&toolbar=0&navpanes=0`}
                className="w-full h-full"
                title="Converted PDF Preview"
              />
            </div>
          </div>
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
            <h3 className="text-xl font-bold text-foreground">Select a Word document</h3>
            <p className="text-sm text-secondary-foreground mt-2">
              Drag & drop or click to browse (.docx)
            </p>
          </div>
          <input
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Page Size</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as PageSize)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="a3">A3</option>
                <option value="a5">A5</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Orientation</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as PageOrientation)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex justify-between text-sm font-semibold text-foreground">
                <span>Margin</span>
                <span className="text-primary font-mono">{margin}mm</span>
              </label>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mt-3"
              />
            </div>
          </div>

          <p className="text-xs text-secondary-foreground leading-relaxed mb-6">
            Conversion runs entirely in your browser. Only .docx files are supported (legacy .doc is not supported).
          </p>

          <button
            onClick={handleConvert}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCcw className="w-5 h-5 animate-spin" /> Converting...
              </>
            ) : (
              <>
                <FileType className="w-5 h-5" /> Convert to PDF
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

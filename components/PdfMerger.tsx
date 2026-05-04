"use client";

import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, FileText, ArrowUp, ArrowDown, Trash2, CheckCircle2, Download, RefreshCcw } from "lucide-react";
import { mergePdfs } from "@/utils/pdfProcessor";

export default function PdfMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isCancelled = false;
    const generatePreview = async () => {
      if (files.length === 0) {
        setPreviewUrl(null);
        return;
      }
      setIsPreviewLoading(true);
      try {
        const mergedFile = await mergePdfs(files);
        if (isCancelled) return;
        const url = URL.createObjectURL(mergedFile);
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } catch (error) {
        console.error("Preview generation failed:", error);
      } finally {
        if (!isCancelled) setIsPreviewLoading(false);
      }
    };

    generatePreview();

    return () => {
      isCancelled = true;
    };
  }, [files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter((file) => file.type === "application/pdf");
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter((file) => file.type === "application/pdf");
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
    setFiles(newFiles);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index + 1], newFiles[index]] = [newFiles[index], newFiles[index + 1]];
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setFiles([]);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className={`w-full mx-auto space-y-6 ${files.length > 0 ? "max-w-6xl" : "max-w-3xl"}`}>
      {files.length === 0 && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-8 sm:p-12 border-3 border-dashed border-primary/30 rounded-3xl bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-4 group animate-fade-in-up"
        >
          <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-foreground">Click or drag PDFs here</h3>
            <p className="text-sm text-secondary-foreground mt-1">Select multiple PDF files to combine them</p>
          </div>
          <input
            type="file"
            accept=".pdf,application/pdf"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      )}

      {files.length > 0 && (
        <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-4 sm:p-8 shadow-xl flex flex-col lg:flex-row gap-8 items-start animate-fade-in-up">
          
          <div className="w-full lg:w-[40%] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-foreground">Selected Files ({files.length})</h3>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-primary hover:text-primary/80 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors shrink-0"
              >
                + Add More
              </button>
            </div>
            
            <ul className="space-y-2 mb-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {files.map((file, idx) => (
                <li key={`${file.name}-${idx}`} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm group">
                  <div className="flex items-center gap-3 truncate pr-4">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <FileText className="w-4 h-4 text-secondary-foreground shrink-0" />
                    <span className="text-sm font-medium truncate text-gray-700">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md disabled:opacity-30">
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => moveDown(idx)} disabled={idx === files.length - 1} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md disabled:opacity-30">
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeFile(idx)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md ml-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-auto space-y-3">
              <input
                type="file"
                accept=".pdf,application/pdf"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              
              <a
                href={previewUrl || "#"}
                download={files.length >= 2 && !isPreviewLoading ? "merged_document.pdf" : undefined}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                  files.length < 2 || isPreviewLoading 
                    ? "bg-gray-400 cursor-not-allowed opacity-50" 
                    : "bg-primary hover:bg-primary/90 hover:-translate-y-0.5"
                }`}
              >
                {isPreviewLoading ? (
                  <><RefreshCcw className="w-5 h-5 animate-spin" /> Generating Preview...</>
                ) : files.length < 2 ? (
                  `Add 1 more PDF to Merge`
                ) : (
                  <><Download className="w-5 h-5" /> Download Merged PDF</>
                )}
              </a>

              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl font-bold text-secondary-foreground bg-white hover:bg-gray-50 border border-gray-200 transition-all text-sm"
              >
                Start Over
              </button>
            </div>
          </div>

          <div className="w-full lg:w-[60%] flex flex-col items-center">
            <h3 className="font-bold text-lg text-foreground mb-4 w-full text-left">Live Preview</h3>
            <div className="w-full h-[60vh] lg:h-[75vh] rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-gray-100 relative group flex items-center justify-center">
              {isPreviewLoading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-opacity">
                  <RefreshCcw className="w-8 h-8 animate-spin text-primary mb-2" />
                  <p className="text-sm font-semibold text-secondary-foreground">Updating Layout...</p>
                </div>
              )}
              {previewUrl ? (
                <iframe 
                  src={`${previewUrl}#view=FitH&toolbar=0&navpanes=0`} 
                  className="w-full h-full" 
                  title="Live PDF Preview"
                />
              ) : (
                <p className="text-secondary-foreground">Add files to see preview</p>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Download, RefreshCcw, Presentation, Sheet } from "lucide-react";
import { convertExcelToPdf, convertPptxToPdf, isExcelFile, isPptxFile } from "@/utils/officeToPdf";
import type { PageOrientation, PageSize } from "@/utils/pdfProcessor";
import { downloadFile } from "@/utils/download";

type OfficeType = "pptx" | "excel";

interface Props {
  type: OfficeType;
}

export default function OfficeToPdfTool({ type }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [pageSize, setPageSize] = useState<PageSize>(type === "excel" ? "a4" : "a4");
  const [orientation, setOrientation] = useState<PageOrientation>("landscape");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPptx = type === "pptx";
  const accept = isPptx
    ? ".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
    : ".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel";
  const Icon = isPptx ? Presentation : Sheet;
  const label = isPptx ? "PowerPoint (.pptx)" : "Excel (.xlsx, .xls)";

  const handleSelect = (f: File) => {
    if (isPptx && !isPptxFile(f)) return alert("Please upload a .pptx file.");
    if (!isPptx && !isExcelFile(f)) return alert("Please upload an Excel file.");
    setFile(f);
    setResult(null);
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const options = { pageSize, orientation, margin: 10 };
      const out = isPptx
        ? await convertPptxToPdf(file, options)
        : await convertExcelToPdf(file, options);
      setResult(out);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Conversion failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (result) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl space-y-4 text-center">
        <p className="font-bold text-lg">PDF ready!</p>
        <button onClick={() => downloadFile(result)} className="w-full py-4 rounded-xl font-bold text-white bg-primary flex items-center justify-center gap-2">
          <Download className="w-5 h-5" /> Download {result.name}
        </button>
        <button onClick={() => { setResult(null); setFile(null); }} className="text-sm text-primary">Convert another</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {!file ? (
        <div onClick={() => fileInputRef.current?.click()} className="w-full p-10 border-3 border-dashed border-primary/30 rounded-3xl bg-white/30 cursor-pointer flex flex-col items-center gap-4">
          <Icon className="w-10 h-10 text-primary" />
          <p className="font-bold">Upload {label}</p>
          <input ref={fileInputRef} type="file" accept={accept} className="hidden" onChange={(e) => e.target.files?.[0] && handleSelect(e.target.files[0])} />
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl space-y-4">
          <p className="font-medium truncate">{file.name}</p>
          <div className="grid grid-cols-2 gap-4">
            <select value={pageSize} onChange={(e) => setPageSize(e.target.value as PageSize)} className="px-3 py-2 rounded-xl border">
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
            </select>
            <select value={orientation} onChange={(e) => setOrientation(e.target.value as PageOrientation)} className="px-3 py-2 rounded-xl border">
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
            </select>
          </div>
          {isPptx && <p className="text-xs text-secondary-foreground">Slide text is extracted; complex layouts may differ from the original.</p>}
          <button onClick={handleConvert} disabled={isProcessing} className="w-full py-4 rounded-xl font-bold text-white bg-primary disabled:opacity-50 flex items-center justify-center gap-2">
            {isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Icon className="w-5 h-5" />}
            Convert to PDF
          </button>
        </div>
      )}
    </div>
  );
}

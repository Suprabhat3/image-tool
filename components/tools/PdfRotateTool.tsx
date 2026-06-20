"use client";

import React, { useEffect, useRef, useState } from "react";
import { UploadCloud, FileText, Download, RefreshCcw, RotateCw, ArrowUp, ArrowDown } from "lucide-react";
import { getPdfPageCount, rotateReorderPdf } from "@/utils/pdfProcessor";
import { downloadFile } from "@/utils/download";

interface PageItem {
  id: number;
  rotation: 0 | 90 | 180 | 270;
}

export default function PdfRotateTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) return;
    getPdfPageCount(file).then((count) => {
      setPages(Array.from({ length: count }, (_, i) => ({ id: i, rotation: 0 })));
    });
  }, [file]);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const rotatePage = (index: number) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, rotation: ((p.rotation + 90) % 360) as 0 | 90 | 180 | 270 } : p
      )
    );
  };

  const movePage = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= pages.length) return;
    const copy = [...pages];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    setPages(copy);
  };

  const handleApply = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const order = pages.map((p) => p.id);
      const rotations: Record<number, 90 | 180 | 270> = {};
      pages.forEach((p) => {
        if (p.rotation !== 0) rotations[p.id] = p.rotation;
      });
      const out = await rotateReorderPdf(file, order, rotations);
      setResult(out);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(out);
      });
    } catch (error) {
      alert("Failed to process PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (result && previewUrl) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl space-y-4">
        <iframe src={`${previewUrl}#view=FitH`} className="w-full h-[60vh] rounded-xl border" title="Preview" />
        <div className="flex gap-3">
          <button onClick={() => downloadFile(result)} className="flex-1 py-3 rounded-xl font-bold text-white bg-primary flex items-center justify-center gap-2">
            <Download className="w-5 h-5" /> Download
          </button>
          <button onClick={() => { setResult(null); setFile(null); setPages([]); }} className="py-3 px-4 rounded-xl border bg-white font-bold">Reset</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {!file ? (
        <div onClick={() => fileInputRef.current?.click()} className="w-full p-10 border-3 border-dashed border-primary/30 rounded-3xl bg-white/30 cursor-pointer flex flex-col items-center gap-4">
          <UploadCloud className="w-10 h-10 text-primary" />
          <p className="font-bold">Upload PDF to rotate or reorder pages</p>
          <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl space-y-4">
          <p className="font-bold flex items-center gap-2"><FileText className="w-5 h-5" /> {file.name} — {pages.length} pages</p>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {pages.map((p, i) => (
              <li key={`${p.id}-${i}`} className="flex items-center gap-2 p-3 bg-white rounded-xl border">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="flex-1 text-sm">Original page {p.id + 1} · {p.rotation}°</span>
                <button onClick={() => rotatePage(i)} className="p-1.5 rounded hover:bg-primary/10"><RotateCw className="w-4 h-4" /></button>
                <button onClick={() => movePage(i, -1)} disabled={i === 0} className="p-1.5 rounded hover:bg-primary/10 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                <button onClick={() => movePage(i, 1)} disabled={i === pages.length - 1} className="p-1.5 rounded hover:bg-primary/10 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
              </li>
            ))}
          </ul>
          <button onClick={handleApply} disabled={isProcessing} className="w-full py-4 rounded-xl font-bold text-white bg-primary disabled:opacity-50 flex items-center justify-center gap-2">
            {isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : null}
            Apply Changes
          </button>
        </div>
      )}
    </div>
  );
}

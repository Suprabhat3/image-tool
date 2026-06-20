"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Download, RefreshCcw, Layers } from "lucide-react";
import { batchProcessImages, IMAGE_FORMATS } from "@/utils/imageProcessor";
import { downloadFile, downloadFilesAsZip, formatBytes } from "@/utils/download";

export default function BatchProcessorTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(70);
  const [format, setFormat] = useState("image/jpeg");
  const [maxSize, setMaxSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcess = async () => {
    if (!files.length) return;
    setIsProcessing(true);
    try {
      const out = await batchProcessImages(files, {
        quality,
        format,
        maxWidthOrHeight: maxSize > 0 ? maxSize : undefined,
      });
      setResults(out);
    } catch {
      alert("Batch processing failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (results.length > 0) {
    const saved = files.reduce((acc, f, i) => acc + (f.size - results[i].size), 0);
    return (
      <div className="w-full max-w-3xl mx-auto bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl space-y-4">
        <p className="font-bold">Processed {results.length} images · saved ~{formatBytes(Math.max(0, saved))}</p>
        <ul className="max-h-48 overflow-y-auto space-y-2">
          {results.map((f, i) => (
            <li key={i} className="flex justify-between p-3 bg-white rounded-xl border text-sm">
              <span className="truncate">{f.name}</span>
              <span className="text-primary font-mono shrink-0 ml-2">{formatBytes(f.size)}</span>
            </li>
          ))}
        </ul>
        <div className="flex gap-3">
          <button onClick={() => downloadFilesAsZip(results, "processed_images.zip")} className="flex-1 py-3 rounded-xl font-bold text-white bg-primary flex items-center justify-center gap-2">
            <Download className="w-5 h-5" /> Download ZIP
          </button>
          <button onClick={() => { setResults([]); setFiles([]); }} className="py-3 px-4 rounded-xl border bg-white font-bold">Reset</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-full p-10 border-3 border-dashed border-primary/30 rounded-3xl bg-white/30 cursor-pointer flex flex-col items-center gap-4"
      >
        <UploadCloud className="w-10 h-10 text-primary" />
        <p className="font-bold">{files.length ? `${files.length} images selected` : "Select multiple images"}</p>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
      </div>

      {files.length > 0 && (
        <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl space-y-4">
          <div>
            <label className="text-sm font-semibold">Quality: {quality}%</label>
            <input type="range" min={10} max={95} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-primary" />
          </div>
          <div>
            <label className="text-sm font-semibold">Output format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl border">
              {IMAGE_FORMATS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Max dimension (px, 0 = no resize)</label>
            <input type="number" min={0} value={maxSize} onChange={(e) => setMaxSize(Number(e.target.value))} className="w-full mt-1 px-3 py-2 rounded-xl border" />
          </div>
          <button onClick={handleProcess} disabled={isProcessing} className="w-full py-4 rounded-xl font-bold text-white bg-primary disabled:opacity-50 flex items-center justify-center gap-2">
            {isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Layers className="w-5 h-5" />}
            Process All
          </button>
        </div>
      )}
    </div>
  );
}

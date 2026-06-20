"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, Trash2, Download, RefreshCcw, Plus, FileText } from "lucide-react";
import { createPDFFromImages, prepareImagesForPDF, downloadPDF, type ImageForPDF, type PDFOptions } from "@/utils/pdfProcessor";

export default function ScanToPdfTool() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captures, setCaptures] = useState<ImageForPDF[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageSize, setPageSize] = useState<PDFOptions["pageSize"]>("a4");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(media);
      if (videoRef.current) {
        videoRef.current.srcObject = media;
      }
    } catch {
      alert("Camera access denied or unavailable.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `scan_${captures.length + 1}.jpg`, { type: "image/jpeg" });
      const prepared = await prepareImagesForPDF([file]);
      setCaptures((prev) => [...prev, ...prepared]);
    }, "image/jpeg", 0.92);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const prepared = await prepareImagesForPDF(imageFiles);
    setCaptures((prev) => [...prev, ...prepared]);
  };

  const removeCapture = (index: number) => {
    setCaptures((prev) => prev.filter((_, i) => i !== index));
  };

  const buildPdf = async () => {
    if (!captures.length) return;
    setIsProcessing(true);
    try {
      const pdf = await createPDFFromImages(captures, {
        pageSize,
        orientation: "portrait",
        margin: 10,
      });
      downloadPDF(pdf, "scan.pdf");
    } catch {
      alert("Failed to create PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-4 shadow-xl space-y-4">
          {!stream ? (
            <div className="aspect-video bg-gray-100 rounded-2xl flex flex-col items-center justify-center gap-4">
              <Camera className="w-12 h-12 text-primary" />
              <button onClick={startCamera} className="py-2 px-6 rounded-xl font-bold text-white bg-primary">
                Start Camera
              </button>
              <span className="text-xs text-secondary-foreground">or upload images</span>
              <button onClick={() => fileInputRef.current?.click()} className="text-sm text-primary font-semibold">
                Browse files
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileUpload(e.target.files)} />
            </div>
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline className="w-full aspect-video rounded-2xl bg-black object-cover" />
              <div className="flex gap-2">
                <button onClick={capturePhoto} className="flex-1 py-3 rounded-xl font-bold text-white bg-primary flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> Capture Page
                </button>
                <button onClick={() => { stream.getTracks().forEach((t) => t.stop()); setStream(null); }} className="py-3 px-4 rounded-xl border bg-white font-bold text-sm">
                  Stop
                </button>
              </div>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-4 shadow-xl">
          <h3 className="font-bold mb-3 flex items-center gap-2"><FileText className="w-5 h-5" /> Pages ({captures.length})</h3>
          {captures.length === 0 ? (
            <p className="text-sm text-secondary-foreground text-center py-12">Capture or upload images to build your PDF</p>
          ) : (
            <ul className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto mb-4">
              {captures.map((c, i) => (
                <li key={i} className="relative aspect-[3/4] rounded-lg overflow-hidden border">
                  {c.dataUrl && <img src={c.dataUrl} alt={`Page ${i + 1}`} className="w-full h-full object-cover" />}
                  <button onClick={() => removeCapture(i)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <select value={pageSize} onChange={(e) => setPageSize(e.target.value as PDFOptions["pageSize"])} className="w-full mb-3 px-3 py-2 rounded-xl border">
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
          </select>
          <button onClick={buildPdf} disabled={!captures.length || isProcessing} className="w-full py-3 rounded-xl font-bold text-white bg-primary disabled:opacity-50 flex items-center justify-center gap-2">
            {isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

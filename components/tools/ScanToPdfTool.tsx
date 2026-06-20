"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  Trash2,
  Download,
  RefreshCcw,
  Plus,
  FileText,
  X,
  UploadCloud,
  SwitchCamera,
} from "lucide-react";
import {
  createPDFFromImages,
  prepareImagesForPDF,
  downloadPDF,
  type ImageForPDF,
  type PDFOptions,
} from "@/utils/pdfProcessor";

export default function ScanToPdfTool() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [captures, setCaptures] = useState<ImageForPDF[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [pageSize, setPageSize] = useState<PDFOptions["pageSize"]>("a4");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOpen(false);
  }, []);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Bind stream to video after the fullscreen element is mounted
  useEffect(() => {
    if (!cameraOpen || !streamRef.current) return;

    const video = videoRef.current;
    if (!video) return;

    video.srcObject = streamRef.current;
    video.muted = true;
    video.playsInline = true;

    const tryPlay = async () => {
      try {
        await video.play();
      } catch {
        // Retry once metadata is ready
        video.onloadedmetadata = () => {
          video.play().catch(() => {});
        };
      }
    };

    tryPlay();

    return () => {
      video.srcObject = null;
    };
  }, [cameraOpen, facingMode]);

  const startCamera = async (facing: "environment" | "user" = facingMode) => {
    setIsStartingCamera(true);
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());

      let media: MediaStream;
      try {
        media = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
      } catch {
        media = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
      }

      streamRef.current = media;
      setFacingMode(facing);
      setCameraOpen(true);
    } catch {
      alert("Camera access denied or unavailable. You can upload images instead.");
    } finally {
      setIsStartingCamera(false);
    }
  };

  const flipCamera = () => {
    const next = facingMode === "environment" ? "user" : "environment";
    startCamera(next);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `scan_${captures.length + 1}.jpg`, {
        type: "image/jpeg",
      });
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
    <>
      {/* Full-screen camera overlay */}
      {cameraOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))] bg-gradient-to-b from-black/70 to-transparent">
            <button
              type="button"
              onClick={stopCamera}
              className="p-3 rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/20"
              aria-label="Close camera"
            >
              <X className="w-6 h-6" />
            </button>
            <span className="text-white font-semibold text-sm bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
              {captures.length} page{captures.length !== 1 ? "s" : ""} captured
            </span>
            <button
              type="button"
              onClick={flipCamera}
              className="p-3 rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/20"
              aria-label="Flip camera"
            >
              <SwitchCamera className="w-6 h-6" />
            </button>
          </div>

          {/* Capture thumbnail strip */}
          {captures.length > 0 && (
            <div className="relative z-10 mt-auto px-4 pb-2 flex gap-2 overflow-x-auto">
              {captures.map((c, i) => (
                <div key={i} className="relative w-14 h-20 shrink-0 rounded-lg overflow-hidden border-2 border-white/80 shadow-lg">
                  {c.dataUrl && (
                    <img src={c.dataUrl} alt={`Page ${i + 1}`} className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Bottom controls */}
          <div className="relative z-10 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-8">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-full bg-white/20 text-white backdrop-blur-sm"
              aria-label="Upload image"
            >
              <UploadCloud className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full bg-white border-4 border-white/50 shadow-xl flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Capture photo"
            >
              <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-300" />
            </button>

            <button
              type="button"
              onClick={stopCamera}
              className="py-3 px-5 rounded-full bg-primary text-white font-bold text-sm shadow-lg"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera / upload panel */}
          <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-4 shadow-xl space-y-4">
            <div className="aspect-[4/3] bg-gray-100 rounded-2xl flex flex-col items-center justify-center gap-4 p-6">
              <Camera className="w-14 h-14 text-primary" />
              <p className="text-center text-sm text-secondary-foreground font-medium">
                Open the camera in full screen to scan documents page by page
              </p>
              <button
                type="button"
                onClick={() => startCamera()}
                disabled={isStartingCamera}
                className="py-3 px-8 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              >
                {isStartingCamera ? (
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
                {isStartingCamera ? "Starting..." : "Open Camera"}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-primary font-semibold hover:underline"
              >
                or upload images from files
              </button>
            </div>
          </div>

          {/* Pages panel */}
          <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-4 shadow-xl flex flex-col">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Pages ({captures.length})
            </h3>

            {captures.length === 0 ? (
              <p className="text-sm text-secondary-foreground text-center py-12 flex-1">
                Capture or upload images to build your PDF
              </p>
            ) : (
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto mb-4 flex-1">
                {captures.map((c, i) => (
                  <li key={i} className="relative aspect-[3/4] rounded-lg overflow-hidden border bg-white">
                    {c.dataUrl && (
                      <img src={c.dataUrl} alt={`Page ${i + 1}`} className="w-full h-full object-cover" />
                    )}
                    <span className="absolute bottom-1 left-1 text-[10px] font-bold bg-black/50 text-white px-1.5 py-0.5 rounded">
                      {i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCapture(i)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as PDFOptions["pageSize"])}
              className="w-full mb-3 px-3 py-2 rounded-xl border bg-white"
            >
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
            </select>

            <button
              type="button"
              onClick={buildPdf}
              disabled={!captures.length || isProcessing}
              className="w-full py-3 rounded-xl font-bold text-white bg-primary disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <RefreshCcw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

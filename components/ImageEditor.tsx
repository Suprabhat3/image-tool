"use client";

import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { Settings, Check, X, RefreshCcw } from "lucide-react";
import { getCroppedImg, compressImage } from "@/utils/imageProcessor";

interface ImageEditorProps {
  file: File;
  onProcess: (original: File, processed: File) => void;
  onCancel: () => void;
}

export default function ImageEditor({
  file,
  onProcess,
  onCancel,
}: ImageEditorProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [originalAspect, setOriginalAspect] = useState<number | undefined>(
    undefined,
  );
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState("image/jpeg");
  const [maxSizeKB, setMaxSizeKB] = useState(500);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result?.toString() || null);
      // Determine original aspect ratio
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        setOriginalAspect(ratio);
        setAspect(ratio); // Default to original aspect ratio
      };
      img.src = reader.result?.toString() || "";
    });
    reader.readAsDataURL(file);
  }, [file]);

  const onCropComplete = useCallback(
    (_croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleProcess = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      // 1. Crop
      const croppedFile = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        format,
      );
      if (!croppedFile) throw new Error("Cropping failed");

      // 2. Compress
      const compressedFile = await compressImage(
        croppedFile,
        quality,
        format,
        maxSizeKB / 1024,
      );

      onProcess(file, compressedFile);
    } catch (error) {
      console.error(error);
      alert("Error processing image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const aspectRatios = [
    { label: "Original", value: originalAspect },
    { label: "Free form", value: undefined },
    { label: "Square 1:1", value: 1 },
    { label: "16:9", value: 16 / 9 },
    { label: "4:3", value: 4 / 3 },
  ];

  if (!imageSrc)
    return (
      <div className="p-8 text-center text-primary font-bold animate-pulse">
        Loading image...
      </div>
    );

  return (
    <div className="glass-panel w-full max-w-5xl mx-auto rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-20">
      {/* Cropper Area */}
      <div className="relative w-full md:w-2/3 h-[500px] md:h-[650px] bg-black/5">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          classes={{
            containerClassName:
              "rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none",
          }}
        />
      </div>

      {/* Controls Area */}
      <div className="w-full md:w-1/3 p-8 flex flex-col gap-6 overflow-y-auto max-h-[650px] bg-white/60 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-2">
            <Settings className="w-6 h-6 text-primary" /> Editor Settings
          </h2>
          <p className="text-sm text-secondary-foreground mb-4">
            Adjust crop limits and compression quality before exporting.
          </p>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground">
            Crop Aspect Ratio
          </label>
          <div className="grid grid-cols-2 gap-2">
            {aspectRatios.map((ratio, idx) => (
              <button
                key={idx}
                onClick={() => setAspect(ratio.value)}
                className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                  aspect === ratio.value
                    ? "bg-primary text-primary-foreground scale-[1.02] shadow-primary/30 ring-2 ring-primary ring-offset-2"
                    : "bg-white hover:bg-primary/10 text-foreground border border-black/5 hover:border-primary/30"
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom */}
        <div className="space-y-2 mt-2">
          <label className="text-sm font-semibold text-foreground flex justify-between">
            Zoom Level <span className="text-primary">{zoom.toFixed(1)}x</span>
          </label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-2.5 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary shadow-inner"
          />
        </div>

        <hr className="border-primary/20 my-2" />

        {/* Compression Settings */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground flex justify-between">
            Target Max Size{" "}
            <span className="text-primary font-mono bg-primary/10 px-2 rounded-md">
              {maxSizeKB} KB
            </span>
          </label>
          <input
            type="range"
            min={50}
            max={5000}
            step={50}
            value={maxSizeKB}
            onChange={(e) => setMaxSizeKB(Number(e.target.value))}
            className="w-full h-2.5 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary shadow-inner"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground flex justify-between">
            Quality Target{" "}
            <span className="text-primary font-mono bg-primary/10 px-2 rounded-md">
              {quality}%
            </span>
          </label>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full h-2.5 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary shadow-inner"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Output Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full p-3 rounded-xl bg-white border-2 border-primary/20 focus:border-primary focus:ring-0 outline-none text-foreground font-semibold shadow-sm transition-all"
          >
            <option value="image/jpeg">
              JPEG (.jpg) - Best for compression
            </option>
            <option value="image/png">PNG (.png) - Best for transparent</option>
            <option value="image/webp">
              WEBP (.webp) - Modern fast format
            </option>
          </select>
        </div>

        <div className="mt-auto pt-4 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-foreground bg-white hover:bg-gray-100 transition-colors border-2 border-gray-200"
          >
            <X className="w-5 h-5" /> Cancel
          </button>
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-primary-foreground bg-primary hover:bg-primary/90 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:transform-none disabled:shadow-none"
          >
            {isProcessing ? (
              <RefreshCcw className="w-5 h-5 animate-spin" />
            ) : (
              <Check className="w-5 h-5" />
            )}
            {isProcessing ? "Processing..." : "Apply & Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

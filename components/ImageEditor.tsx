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
    <div className="glass-panel w-full max-w-5xl mx-auto rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-20">
      {/* Cropper Area */}
      <div className="relative w-full md:w-[60%] lg:w-2/3 aspect-[4/3] max-h-[70vh] md:aspect-auto md:max-h-none md:h-[650px] bg-slate-50 md:border-r border-black/5 overflow-hidden rounded-t-xl sm:rounded-t-2xl md:rounded-l-3xl md:rounded-tr-none">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          objectFit="contain"
          classes={{
            containerClassName: "z-10",
          }}
          style={{
            containerStyle: {
              background: "transparent",
            },
            cropAreaStyle: {
              border: "2px solid rgba(16, 185, 129, 0.8)",
              boxShadow: "0 0 0 9999em rgba(0, 0, 0, 0.5)",
            },
          }}
        />
      </div>

      {/* Controls Area */}
      <div className="w-full md:w-[40%] lg:w-1/3 p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6 md:gap-8 overflow-y-auto md:max-h-[650px] bg-white/70 backdrop-blur-xl custom-scrollbar relative">
        <div className="absolute top-0 left-0 w-full h-12 md:h-16 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>

        <div className="relative z-20">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2 mb-1 sm:mb-2">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-primary" /> Editor Settings
          </h2>
          <p className="text-xs sm:text-sm text-secondary-foreground font-medium leading-relaxed">
            Adjust crop limits and precise compression targets below.
          </p>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-2 sm:space-y-3">
          <span className="text-xs sm:text-sm font-semibold text-foreground">
            Crop Aspect Ratio
          </span>
          <div className="grid grid-cols-2 gap-2">
            {aspectRatios.map((ratio, idx) => (
              <button
                key={idx}
                onClick={() => setAspect(ratio.value)}
                className={`relative overflow-hidden py-2.5 sm:py-3 px-2 sm:px-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm outline-none w-full group ${
                  aspect === ratio.value
                    ? "bg-primary text-white scale-[1.02] shadow-[0_4px_15px_rgba(16,185,129,0.3)] ring-2 ring-primary border-transparent"
                    : "bg-white hover:bg-primary/5 text-foreground border border-primary/20 hover:border-primary/50"
                }`}
              >
                <span className="relative z-10">{ratio.label}</span>
                {aspect === ratio.value && (
                  <span className="absolute inset-0 bg-white/20 w-full h-full -skew-x-12 -translate-x-full group-hover:animate-[shine_1s_ease-in-out]"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-semibold text-foreground flex justify-between">
            Zoom Level <span className="text-primary text-xs sm:text-sm">{zoom.toFixed(1)}x</span>
          </label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-2.5 bg-gray-200 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all hover:bg-gray-300 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>

        <hr className="border-primary/20" />

        {/* Compression Settings */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-semibold text-foreground flex justify-between items-center">
            Target Max Size{" "}
            <span className="text-primary font-mono bg-primary/10 px-1.5 sm:px-2 py-0.5 rounded-md text-xs sm:text-sm">
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
            className="w-full h-2.5 bg-gray-200 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all hover:bg-gray-300 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-semibold text-foreground flex justify-between items-center">
            Quality Target{" "}
            <span className="text-primary font-mono bg-primary/10 px-1.5 sm:px-2 py-0.5 rounded-md text-xs sm:text-sm">
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
            className="w-full h-2.5 bg-gray-200 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all hover:bg-gray-300 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-semibold text-foreground">
            Output Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full py-2.5 sm:py-3.5 pl-3 sm:pl-4 pr-10 rounded-lg sm:rounded-xl bg-white border-2 border-gray-100 hover:border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-foreground font-bold shadow-sm transition-all appearance-none cursor-pointer text-xs sm:text-base truncate"
            style={{
              backgroundImage:
                'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2310b981%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem top 50%",
              backgroundSize: "0.65rem auto",
            }}
          >
            <option value="image/jpeg">JPEG (.jpg) - Best Quality</option>
            <option value="image/png">PNG (.png) - Transparent</option>
            <option value="image/webp">WEBP (.webp) - Fast & Modern</option>
          </select>
        </div>

        <div className="mt-auto pt-3 sm:pt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex flex-1 py-3 sm:py-3.5 px-3 sm:px-4 rounded-lg sm:rounded-xl items-center justify-center gap-2 font-semibold text-foreground bg-white hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all duration-300 border-2 border-gray-200 shadow-sm disabled:opacity-50 text-sm sm:text-base"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-90 shrink-0" />{" "}
            Cancel
          </button>
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="group flex flex-1 py-3 sm:py-3.5 px-3 sm:px-4 rounded-lg sm:rounded-xl items-center justify-center gap-2 font-bold text-white bg-primary hover:bg-primary/90 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.4)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:transform-none disabled:shadow-none overflow-hidden relative text-sm sm:text-base"
          >
            <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></span>
            <span className="relative z-10 flex items-center gap-2">
              {isProcessing ? (
                <RefreshCcw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin shrink-0" />
              ) : (
                <Check className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-125 shrink-0" />
              )}
              {isProcessing ? "Processing..." : "Apply & Save"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

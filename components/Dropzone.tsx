"use client";

import React, { useCallback } from "react";
import { UploadCloud } from "lucide-react";

interface DropzoneProps {
  onImageSelect: (file: File) => void;
}

export default function Dropzone({ onImageSelect }: DropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        onImageSelect(file);
      }
    },
    [onImageSelect],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragEnter}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={`glass w-full max-w-2xl mx-auto rounded-3xl sm:rounded-[2rem] p-6 sm:p-12 text-center border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center gap-4 sm:gap-6 relative group overflow-hidden ${
        isDragging
          ? "bg-primary/10 border-primary scale-[1.02] shadow-[0_0_40px_rgba(16,185,129,0.2)]"
          : "border-primary/40 hover:bg-primary/5 hover:border-primary/60 hover:shadow-xl"
      }`}
    >
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ease-out ${
          isDragging
            ? "bg-primary text-white scale-110 rotate-12"
            : "bg-primary/10 text-primary animate-float"
        }`}
      >
        <UploadCloud
          className={`w-12 h-12 transition-transform duration-300 ${isDragging ? "scale-110" : "group-hover:scale-110 group-hover:-translate-y-1"}`}
        />
      </div>
      <div className="relative z-10 transition-transform duration-300 group-hover:translate-y-[-4px]">
        <h3
          className={`text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 transition-colors ${isDragging ? "text-primary" : "text-foreground"}`}
        >
          {isDragging
            ? "Drop it like it's hot!"
            : "Drag & Drop your image here"}
        </h3>
        <p className="text-secondary-foreground/75 text-base sm:text-lg">
          or click to browse from your computer
        </p>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        id="fileInput"
      />
      <label
        htmlFor="fileInput"
        className="mt-2 sm:mt-4 relative z-10 px-8 py-3 sm:px-10 sm:py-4 bg-primary text-primary-foreground rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer inline-block overflow-hidden"
      >
        <span className="relative z-10">Select Image</span>
        <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-500"></div>
      </label>
    </div>
  );
}

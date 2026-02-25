"use client";

import React, { useCallback } from "react";
import { UploadCloud } from "lucide-react";

interface DropzoneProps {
  onImageSelect: (file: File) => void;
}

export default function Dropzone({ onImageSelect }: DropzoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
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
      onDragOver={(e) => e.preventDefault()}
      className="glass w-full max-w-2xl mx-auto rounded-3xl p-12 text-center border-2 border-dashed border-primary/40 cursor-pointer hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center gap-6"
    >
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-bounce-slow">
        <UploadCloud className="w-12 h-12 text-primary" />
      </div>
      <div>
        <h3 className="text-3xl font-bold text-foreground mb-3">
          Drag & Drop your image here
        </h3>
        <p className="text-secondary-foreground/75 text-lg">
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
        className="mt-6 px-10 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer inline-block"
      >
        Select Image
      </label>
    </div>
  );
}

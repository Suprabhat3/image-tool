"use client";

import React, { useState, useCallback } from "react";
import { Upload, Download, Trash2, GripVertical, Settings } from "lucide-react";
import {
  prepareImagesForPDF,
  createPDFFromImages,
  createGridPDF,
  downloadPDF,
  type ImageForPDF,
  type PDFOptions,
} from "@/utils/pdfProcessor";
import clsx from "clsx";

interface PdfConverterProps {
  onCancel?: () => void;
}

type LayoutMode = "single" | "grid";

const PdfConverter: React.FC<PdfConverterProps> = ({ onCancel }) => {
  const [images, setImages] = useState<ImageForPDF[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // PDF Options
  const [pageSize, setPageSize] = useState<"a4" | "letter" | "a3" | "a5">("a4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );
  const [margin, setMargin] = useState(10);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("single");
  const [imagesPerRow, setImagesPerRow] = useState(2);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    await handleImageSelect(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleImageSelect(files);
  };

  const handleImageSelect = async (files: File[]) => {
    try {
      setIsProcessing(true);
      const newImages = await prepareImagesForPDF(files);
      setImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      console.error("Error preparing images:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOverItem = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      moveImage(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleGeneratePDF = async () => {
    if (images.length === 0) return;

    try {
      setIsProcessing(true);

      const options: PDFOptions = {
        pageSize,
        orientation,
        margin,
      };

      let pdf;
      if (layoutMode === "grid") {
        pdf = await createGridPDF(images, options, imagesPerRow);
      } else {
        pdf = await createPDFFromImages(images, options);
      }

      downloadPDF(pdf, "converted-images.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setImages([]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Upload Zone */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          Image to PDF Converter
        </h2>
        <p className="text-secondary-foreground">
          Upload multiple images and convert them to a single PDF file
        </p>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={clsx(
            "relative border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer",
            isDraggingOver
              ? "border-primary/60 bg-primary/5"
              : "border-primary/20 hover:border-primary/40",
            images.length > 0 && "border-primary/20"
          )}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            disabled={isProcessing}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          <div className="space-y-3">
            <Upload className="w-12 h-12 mx-auto text-primary/60" />
            <div>
              <p className="text-lg font-semibold text-foreground">
                Drag & drop images here
              </p>
              <p className="text-sm text-secondary-foreground mt-1">
                or click to browse from your computer
              </p>
            </div>
            <p className="text-xs text-secondary-foreground/60">
              Supports JPG, PNG, WebP, GIF and other image formats
            </p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <>
          {/* Settings Panel */}
          <div className="border border-primary/20 rounded-lg p-6 space-y-6 bg-primary/3">
            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Settings className="w-5 h-5" />
              PDF Settings
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Page Size */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Page Size
                </label>
                <select
                  value={pageSize}
                  onChange={(e) =>
                    setPageSize(
                      e.target.value as "a4" | "letter" | "a3" | "a5"
                    )
                  }
                  className="w-full px-3 py-2 rounded-md border border-primary/20 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="a4">A4 (210×297mm)</option>
                  <option value="letter">Letter (8.5×11")</option>
                  <option value="a3">A3 (297×420mm)</option>
                  <option value="a5">A5 (148×210mm)</option>
                </select>
              </div>

              {/* Orientation */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Orientation
                </label>
                <select
                  value={orientation}
                  onChange={(e) =>
                    setOrientation(e.target.value as "portrait" | "landscape")
                  }
                  className="w-full px-3 py-2 rounded-md border border-primary/20 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              {/* Layout Mode */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Layout
                </label>
                <select
                  value={layoutMode}
                  onChange={(e) => setLayoutMode(e.target.value as LayoutMode)}
                  className="w-full px-3 py-2 rounded-md border border-primary/20 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="single">One image per page</option>
                  <option value="grid">Grid layout</option>
                </select>
              </div>

              {/* Images Per Row (Grid Mode) */}
              {layoutMode === "grid" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Images Per Row
                  </label>
                  <select
                    value={imagesPerRow}
                    onChange={(e) => setImagesPerRow(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-md border border-primary/20 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
              )}

              {/* Margin */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Margin (mm): {margin}
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Image Preview and Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Selected Images ({images.length})
              </h3>
              <button
                onClick={clearAll}
                className="text-sm text-secondary-foreground hover:text-destructive transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={() => handleDragOverItem(index)}
                  onDragEnd={() => setDraggedIndex(null)}
                  className={clsx(
                    "relative group rounded-lg overflow-hidden border-2 transition-all cursor-move",
                    draggedIndex === index
                      ? "border-primary/60 opacity-60"
                      : "border-primary/20 hover:border-primary/60"
                  )}
                >
                  {/* Image Thumbnail */}
                  <img
                    src={image.dataUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover aspect-square"
                  />

                  {/* Index Badge */}
                  <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {index + 1}
                  </div>

                  {/* Drag Handle */}
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-white bg-black/40 rounded p-0.5" />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute bottom-0 left-0 right-0 bg-destructive/80 hover:bg-destructive text-destructive-foreground py-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-xs font-medium"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleGeneratePDF}
              disabled={isProcessing || images.length === 0}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors",
                isProcessing || images.length === 0
                  ? "bg-primary/40 text-foreground/60 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              )}
            >
              <Download className="w-5 h-5" />
              {isProcessing ? "Creating PDF..." : "Create & Download PDF"}
            </button>

            {onCancel && (
              <button
                onClick={onCancel}
                disabled={isProcessing}
                className="px-6 py-3 rounded-lg font-semibold border border-primary/20 hover:border-primary/60 text-foreground transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PdfConverter;

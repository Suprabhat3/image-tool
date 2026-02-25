"use client";

import React, { useState } from "react";
import Dropzone from "@/components/Dropzone";
import ImageEditor from "@/components/ImageEditor";
import BeforeAfterPreview from "@/components/BeforeAfterPreview";
import { Leaf } from "lucide-react";

export default function Home() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [processedFile, setProcessedFile] = useState<File | null>(null);
  const [step, setStep] = useState<"upload" | "edit" | "preview">("upload");

  const handleImageSelect = (file: File) => {
    setOriginalFile(file);
    setStep("edit");
  };

  const handleProcess = (original: File, processed: File) => {
    setProcessedFile(processed);
    setStep("preview");
  };

  const handleCancel = () => {
    setOriginalFile(null);
    setProcessedFile(null);
    setStep("upload");
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden py-16 px-6 sm:px-12 flex flex-col pt-24">
      {/* Decorative Blob Orbs */}
      <div className="fixed top-[-15%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
      <div className="fixed top-[20%] right-[-10%] w-[400px] h-[400px] bg-secondary/80 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-[350px] h-[350px] bg-primary/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-12 flex-1">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2 border border-primary/20 shadow-sm animate-bounce-slow">
            <Leaf className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-foreground">
            Image<span className="text-primary">Tool</span>
          </h1>
          <p className="text-xl sm:text-2xl text-secondary-foreground max-w-3xl mx-auto font-medium leading-relaxed">
            Crop, resize, and radically compress your images without breaking a
            sweat. Client-side, secure, and blazingly fast.
          </p>
        </header>

        <section className="w-full flex justify-center mt-4">
          {step === "upload" && (
            <div className="w-full flex flex-col gap-6 animate-fade-in">
              <Dropzone onImageSelect={handleImageSelect} />
              <p className="text-center text-secondary-foreground/60 text-sm mt-4 tracking-wide font-medium">
                Supports JPEG, PNG, WEBP — up to 50MB
              </p>
            </div>
          )}

          {step === "edit" && originalFile && (
            <div className="w-full animate-fade-in-up">
              <ImageEditor
                file={originalFile}
                onProcess={handleProcess}
                onCancel={handleCancel}
              />
            </div>
          )}

          {step === "preview" && originalFile && processedFile && (
            <div className="w-full animate-fade-in-up">
              <BeforeAfterPreview
                original={originalFile}
                processed={processedFile}
                onReset={handleCancel}
              />
            </div>
          )}
        </section>
      </div>

      <footer className="relative z-10 mt-auto py-8 text-center text-sm font-medium text-secondary-foreground/60">
        <p>Built perfectly for your everyday image tweaking.</p>
      </footer>
    </main>
  );
}

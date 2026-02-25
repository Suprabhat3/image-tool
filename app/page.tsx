"use client";

import React, { useState } from "react";
import Dropzone from "@/components/Dropzone";
import ImageEditor from "@/components/ImageEditor";
import BeforeAfterPreview from "@/components/BeforeAfterPreview";
import {
  Sparkles,
  Zap,
  Shield,
  Image as ImageIcon,
  Twitter,
  Linkedin,
  Globe,
} from "lucide-react";

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
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans">
      {/* Premium Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0"></div>

      {/* Decorative Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob z-0"></div>
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-emerald-200/50 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000 z-0"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-teal-100/60 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000 z-0"></div>

      {/* Navbar overlay */}
      <nav className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center animate-fade-in-up">
        <div className="flex items-center gap-2 group cursor-pointer">
          <img
            src="/image-logo.png"
            alt="Image Tool Logo"
            className="h-10 w-auto"
          />
        </div>
        <div className="hidden sm:flex gap-8 text-sm font-semibold text-secondary-foreground">
          <a href="#" className="hover:text-primary transition-colors">
            Features
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            FAQ
          </a>
        </div>
      </nav>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 flex flex-col gap-16 flex-1 items-center">
        {step === "upload" && (
          <>
            <header className="text-center space-y-6 max-w-4xl mx-auto animate-fade-in-up">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/20 text-sm font-bold text-primary shadow-sm mb-4 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" /> Client-side Processing 2.0
              </div>

              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-foreground leading-[1.1]">
                Shrink Images.
                <br />
                <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Preserve Quality.
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-secondary-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                Crop, resize, and radically compress images directly in your
                browser. Zero server uploads, absolute privacy, and blazingly
                fast.
              </p>
            </header>

            {/* Feature Mini-Bento */}
            <div
              className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-sm flex items-start gap-4 hover:bg-white/60 transition-colors">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    Lightning Fast
                  </h3>
                  <p className="text-sm text-secondary-foreground">
                    Processes locally on your device without network latency.
                  </p>
                </div>
              </div>
              <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-sm flex items-start gap-4 hover:bg-white/60 transition-colors">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    100% Private
                  </h3>
                  <p className="text-sm text-secondary-foreground">
                    Images never leave your browser. Absolute confidentiality.
                  </p>
                </div>
              </div>
              <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-sm flex items-start gap-4 hover:bg-white/60 transition-colors">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <ImageIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    Format Mastery
                  </h3>
                  <p className="text-sm text-secondary-foreground">
                    Convert flawlessly between JPEG, PNG, and Modern WebP.
                  </p>
                </div>
              </div>
            </div>

            <section className="w-full max-w-4xl mx-auto flex justify-center mt-4">
              <div
                className="w-full flex flex-col gap-6 animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="p-2 bg-white/30 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50">
                  <Dropzone onImageSelect={handleImageSelect} />
                </div>
                <p className="text-center text-secondary-foreground/60 text-sm font-semibold flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" /> Drop a massive image above to
                  see the magic
                </p>
              </div>
            </section>
          </>
        )}

        {step === "edit" && originalFile && (
          <section className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-fade-in-up">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold text-foreground">
                Perfect your Image
              </h2>
              <p className="text-secondary-foreground font-medium">
                Use the tools below to crop and set compression levels.
              </p>
            </div>
            <ImageEditor
              file={originalFile}
              onProcess={handleProcess}
              onCancel={handleCancel}
            />
          </section>
        )}

        {step === "preview" && originalFile && processedFile && (
          <section className="w-full max-w-6xl mx-auto animate-fade-in-up">
            <BeforeAfterPreview
              original={originalFile}
              processed={processedFile}
              onReset={handleCancel}
            />
          </section>
        )}
      </div>

      <footer className="relative z-10 w-full mt-auto py-8 text-center text-sm font-medium text-secondary-foreground/50 border-t border-primary/10 bg-white/20 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <p>
            Built perfectly for your everyday image tweaking without uploading
            them to unwanted servers.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://suprabhat.site"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/60 hover:bg-white rounded-full shadow-sm hover:text-primary transition-all duration-300 border border-primary/10 hover:border-primary/30"
            >
              <Globe className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/suprabhat_3"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/60 hover:bg-white rounded-full shadow-sm hover:text-primary transition-all duration-300 border border-primary/10 hover:border-primary/30"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/suprabhatt"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/60 hover:bg-white rounded-full shadow-sm hover:text-primary transition-all duration-300 border border-primary/10 hover:border-primary/30"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

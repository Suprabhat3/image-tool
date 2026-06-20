"use client";

import React from "react";
import Link from "next/link";
import DocsToPdfConverter from "@/components/DocsToPdfConverter";
import { ArrowLeft, FileType } from "lucide-react";

export default function DocsToPdfPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob z-0"></div>
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-emerald-200/50 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000 z-0"></div>

      <nav className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center animate-fade-in-up">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer shrink-0 hover:opacity-80 transition-opacity">
          <img src="/image-logo.png" alt="Image Tool Logo" className="h-8 sm:h-10 w-auto" />
        </Link>
        <div className="flex gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-secondary-foreground">
          <Link href="/pdf-tools" className="hover:text-primary transition-colors text-primary">
            PDF Tools
          </Link>
          <Link href="/features" className="hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacy
          </Link>
        </div>
      </nav>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col gap-10 sm:gap-16 flex-1 items-center pt-8 pb-12 sm:pt-16 sm:pb-24">
        <header className="text-center space-y-4 sm:space-y-6 max-w-3xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/5 rounded-full border border-primary/20 text-xs sm:text-sm font-bold text-primary shadow-sm mb-2 sm:mb-4 backdrop-blur-sm">
            <FileType className="w-3 h-3 sm:w-4 sm:h-4" /> Document Conversion
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Docs to PDF
          </h1>
          <p className="text-base sm:text-lg text-secondary-foreground max-w-2xl mx-auto">
            Convert Word documents (.docx) to PDF instantly in your browser. Choose page size, orientation, and margins before exporting.
          </p>
        </header>

        <div className="w-full">
          <DocsToPdfConverter />
        </div>

        <Link
          href="/pdf-tools"
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium mt-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to PDF Tools
        </Link>
      </div>
    </main>
  );
}

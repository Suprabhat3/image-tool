"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Layers, Zap } from "lucide-react";

export default function PdfToolsPage() {
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
          <Link href="/features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
        </div>
      </nav>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col gap-10 sm:gap-16 flex-1 items-center pt-8 pb-12 sm:pt-16 sm:pb-24">
        <header className="text-center space-y-4 sm:space-y-6 max-w-3xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/5 rounded-full border border-primary/20 text-xs sm:text-sm font-bold text-primary shadow-sm mb-2 sm:mb-4 backdrop-blur-sm">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4" /> PDF Toolkit
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">All PDF Tools</h1>
          <p className="text-base sm:text-lg text-secondary-foreground max-w-2xl mx-auto">
            Everything you need to modify, optimize, and convert PDFs directly in your browser. 100% private and lightning fast.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {/* Images to PDF */}
          <Link href="/pdf-converter" className="group flex flex-col items-center text-center p-8 bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl hover:bg-white/60 hover:-translate-y-1 transition-all">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Images to PDF</h3>
            <p className="text-sm text-secondary-foreground">Convert and combine multiple images into a structured PDF document.</p>
          </Link>

          {/* Merge PDFs */}
          <Link href="/pdf-merge" className="group flex flex-col items-center text-center p-8 bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl hover:bg-white/60 hover:-translate-y-1 transition-all">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Layers className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Merge PDFs</h3>
            <p className="text-sm text-secondary-foreground">Combine multiple existing PDF files into one continuous document easily.</p>
          </Link>

          {/* Compress PDF */}
          <Link href="/pdf-compress" className="group flex flex-col items-center text-center p-8 bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl hover:bg-white/60 hover:-translate-y-1 transition-all">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Compress PDF</h3>
            <p className="text-sm text-secondary-foreground">Reduce the file size of your PDFs by optimizing embedded images.</p>
          </Link>
        </div>

        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium mt-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </main>
  );
}

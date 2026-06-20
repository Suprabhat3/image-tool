"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, LayoutGrid, Sparkles } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ToolsGrid, { PopularToolsRow } from "@/components/ToolsGrid";
import { pdfToolCategories, imageToolCategories, popularTools } from "@/lib/tools-config";

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob z-0" />

      <SiteNav />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col gap-12 flex-1 pt-4 pb-16">
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/20 text-sm font-bold text-primary">
            <LayoutGrid className="w-4 h-4" /> Tool Hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Every tool in one place
          </h1>
          <p className="text-secondary-foreground text-base sm:text-lg">
            Image editing, PDF conversion, compression, and more — all private, all in your browser.
          </p>
        </header>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Popular</h2>
          </div>
          <PopularToolsRow tools={popularTools} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Image Tools</h2>
            <Link href="/image-tools" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
          </div>
          <ToolsGrid categories={imageToolCategories} columns={2} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">PDF Tools</h2>
            <Link href="/pdf-tools" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
          </div>
          <ToolsGrid categories={pdfToolCategories} columns={3} />
        </section>

        <Link href="/" className="flex items-center justify-center gap-2 text-primary font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <SiteFooter />
    </main>
  );
}

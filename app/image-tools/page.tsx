"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ToolsGrid from "@/components/ToolsGrid";
import { imageToolCategories } from "@/lib/tools-config";

export default function ImageToolsPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob z-0" />

      <SiteNav />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 flex flex-col gap-10 flex-1 pt-4 pb-16">
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/20 text-sm font-bold text-primary">
            <ImageIcon className="w-4 h-4" /> Image Toolkit
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Image Tools</h1>
          <p className="text-secondary-foreground">
            Compress, convert, batch process, and compare images without uploading anywhere.
          </p>
        </header>

        <ToolsGrid categories={imageToolCategories} columns={2} />

        <Link href="/tools" className="flex items-center justify-center gap-2 text-primary font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> All Tools
        </Link>
      </div>

      <SiteFooter />
    </main>
  );
}

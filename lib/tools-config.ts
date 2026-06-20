import {
  FileText,
  Layers,
  Zap,
  FileType,
  Scissors,
  RotateCw,
  Hash,
  FileOutput,
  Presentation,
  Sheet,
  Code,
  FileCode,
  Camera,
  Repeat,
  SlidersHorizontal,
  Image as ImageIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ToolCard {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export interface ToolCategory {
  id: string;
  title: string;
  description: string;
  tools: ToolCard[];
}

export const pdfToolCategories: ToolCategory[] = [
  {
    id: "convert",
    title: "Convert to PDF",
    description: "Turn documents, spreadsheets, and markup into PDF files.",
    tools: [
      { href: "/docs-to-pdf", title: "Word to PDF", description: "Convert .docx documents.", icon: FileType, color: "text-emerald-500", bg: "bg-emerald-100" },
      { href: "/ppt-to-pdf", title: "PPT to PDF", description: "Convert .pptx presentations.", icon: Presentation, color: "text-orange-500", bg: "bg-orange-100" },
      { href: "/excel-to-pdf", title: "Excel to PDF", description: "Convert spreadsheets.", icon: Sheet, color: "text-green-600", bg: "bg-green-100" },
      { href: "/html-to-pdf", title: "HTML to PDF", description: "Render HTML as PDF.", icon: Code, color: "text-indigo-500", bg: "bg-indigo-100" },
      { href: "/markdown-to-pdf", title: "Markdown to PDF", description: "Convert Markdown files.", icon: FileCode, color: "text-slate-600", bg: "bg-slate-100" },
      { href: "/pdf-converter", title: "Images to PDF", description: "Combine images into PDF.", icon: FileText, color: "text-blue-500", bg: "bg-blue-100" },
      { href: "/scan-to-pdf", title: "Scan to PDF", description: "Camera or photo scans.", icon: Camera, color: "text-stone-600", bg: "bg-stone-100" },
    ],
  },
  {
    id: "edit",
    title: "Edit & Organize",
    description: "Split, merge, rotate, and annotate your PDFs.",
    tools: [
      { href: "/pdf-merge", title: "Merge PDFs", description: "Combine multiple PDFs.", icon: Layers, color: "text-purple-500", bg: "bg-purple-100" },
      { href: "/pdf-split", title: "Split PDF", description: "Extract pages or ranges.", icon: Scissors, color: "text-rose-500", bg: "bg-rose-100" },
      { href: "/pdf-rotate", title: "Rotate & Reorder", description: "Rearrange PDF pages.", icon: RotateCw, color: "text-cyan-600", bg: "bg-cyan-100" },
      { href: "/pdf-page-numbers", title: "Page Numbers", description: "Headers, footers, numbering.", icon: Hash, color: "text-violet-500", bg: "bg-violet-100" },
    ],
  },
  {
    id: "optimize",
    title: "Optimize & Export",
    description: "Compress PDFs or export content to other formats.",
    tools: [
      { href: "/pdf-compress", title: "Compress PDF", description: "Reduce file size.", icon: Zap, color: "text-amber-500", bg: "bg-amber-100" },
      { href: "/pdf-to-word", title: "PDF to Word", description: "Extract text to DOCX.", icon: FileOutput, color: "text-teal-600", bg: "bg-teal-100" },
    ],
  },
];

export const imageToolCategories: ToolCategory[] = [
  {
    id: "edit",
    title: "Edit & Compress",
    description: "Crop, resize, and optimize your images.",
    tools: [
      { href: "/", title: "Image Editor", description: "Crop, compress, resize.", icon: ImageIcon, color: "text-primary", bg: "bg-primary/10" },
      { href: "/batch-process", title: "Batch Processing", description: "Process many images at once.", icon: Layers, color: "text-blue-500", bg: "bg-blue-100" },
    ],
  },
  {
    id: "convert",
    title: "Convert & Compare",
    description: "Change formats and preview quality side by side.",
    tools: [
      { href: "/format-converter", title: "Format Converter", description: "JPG, PNG, WEBP.", icon: Repeat, color: "text-emerald-500", bg: "bg-emerald-100" },
      { href: "/compare", title: "Compare Slider", description: "Before/after slider.", icon: SlidersHorizontal, color: "text-purple-500", bg: "bg-purple-100" },
    ],
  },
];

export const pdfTools = pdfToolCategories.flatMap((c) => c.tools);
export const imageTools = imageToolCategories.flatMap((c) => c.tools);

export const popularTools: ToolCard[] = [
  pdfTools.find((t) => t.href === "/docs-to-pdf")!,
  pdfTools.find((t) => t.href === "/pdf-merge")!,
  pdfTools.find((t) => t.href === "/pdf-compress")!,
  imageTools.find((t) => t.href === "/batch-process")!,
  imageTools.find((t) => t.href === "/format-converter")!,
  pdfTools.find((t) => t.href === "/pdf-converter")!,
];

"use client";

import React, { useState } from "react";
import { Download, RefreshCcw, Code, FileCode } from "lucide-react";
import { convertHtmlStringToPdf, convertMarkdownToPdf } from "@/utils/officeToPdf";
import type { PageOrientation, PageSize } from "@/utils/pdfProcessor";
import { downloadFile } from "@/utils/download";

type Mode = "html" | "markdown";

interface Props {
  mode: Mode;
}

const PLACEHOLDER = {
  html: `<h1>Hello World</h1>\n<p>Paste your HTML here or write content directly.</p>\n<ul>\n  <li>Item one</li>\n  <li>Item two</li>\n</ul>`,
  markdown: `# Hello World\n\nPaste your **Markdown** here.\n\n- Item one\n- Item two\n\n> A blockquote`,
};

export default function HtmlMarkdownToPdfTool({ mode }: Props) {
  const [content, setContent] = useState(PLACEHOLDER[mode]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<PageOrientation>("portrait");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<File | null>(null);

  const Icon = mode === "html" ? Code : FileCode;

  const handleConvert = async () => {
    setIsProcessing(true);
    try {
      const options = { pageSize, orientation, margin: 10 };
      const out =
        mode === "html"
          ? await convertHtmlStringToPdf(content, options, "document.pdf")
          : await convertMarkdownToPdf(content, options, "document.pdf");
      setResult(out);
    } catch {
      alert("Conversion failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (result) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl space-y-4">
        <p className="font-bold text-center">PDF generated!</p>
        <button onClick={() => downloadFile(result)} className="w-full py-4 rounded-xl font-bold text-white bg-primary flex items-center justify-center gap-2">
          <Download className="w-5 h-5" /> Download PDF
        </button>
        <button onClick={() => setResult(null)} className="w-full text-sm text-primary">Edit and convert again</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={16}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 font-mono text-sm resize-y"
        spellCheck={false}
      />
      <div className="grid grid-cols-2 gap-4">
        <select value={pageSize} onChange={(e) => setPageSize(e.target.value as PageSize)} className="px-3 py-2 rounded-xl border">
          <option value="a4">A4</option>
          <option value="letter">Letter</option>
        </select>
        <select value={orientation} onChange={(e) => setOrientation(e.target.value as PageOrientation)} className="px-3 py-2 rounded-xl border">
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </div>
      <button onClick={handleConvert} disabled={isProcessing || !content.trim()} className="w-full py-4 rounded-xl font-bold text-white bg-primary disabled:opacity-50 flex items-center justify-center gap-2">
        {isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Icon className="w-5 h-5" />}
        Convert to PDF
      </button>
    </div>
  );
}

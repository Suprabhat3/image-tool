"use client";
import ToolPageLayout from "@/components/ToolPageLayout";
import PdfMerger from "@/components/PdfMerger";
import { Layers } from "lucide-react";
export default function PdfMergePage() {
  return (
    <ToolPageLayout title="Merge PDFs" description="Combine multiple PDF files into one document. Rearrange files in your preferred order." badge="Combine Documents" icon={Layers} backHref="/pdf-tools" backLabel="Back to PDF Tools">
      <PdfMerger />
    </ToolPageLayout>
  );
}

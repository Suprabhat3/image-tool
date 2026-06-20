"use client";
import ToolPageLayout from "@/components/ToolPageLayout";
import PdfConverter from "@/components/PdfConverter";
import { FileText } from "lucide-react";
export default function PdfConverterPage() {
  return (
    <ToolPageLayout title="Convert Images to PDF" description="Upload multiple images and combine them into a single PDF. Customize page size, orientation, and layout." badge="PDF Conversion" icon={FileText} backHref="/pdf-tools" backLabel="Back to PDF Tools">
      <PdfConverter />
    </ToolPageLayout>
  );
}

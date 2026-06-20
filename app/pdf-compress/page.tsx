"use client";
import ToolPageLayout from "@/components/ToolPageLayout";
import PdfCompressor from "@/components/PdfCompressor";
import { Zap } from "lucide-react";
export default function PdfCompressPage() {
  return (
    <ToolPageLayout title="Compress PDF" description="Shrink PDF file size locally by optimizing embedded images without sacrificing quality." badge="Reduce File Size" icon={Zap} backHref="/pdf-tools" backLabel="Back to PDF Tools" maxWidth="2xl">
      <PdfCompressor />
    </ToolPageLayout>
  );
}

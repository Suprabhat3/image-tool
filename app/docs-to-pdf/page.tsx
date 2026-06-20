"use client";

import ToolPageLayout from "@/components/ToolPageLayout";
import DocsToPdfConverter from "@/components/DocsToPdfConverter";
import { FileType } from "lucide-react";

export default function DocsToPdfPage() {
  return (
    <ToolPageLayout
      title="Word to PDF"
      description="Convert Word documents (.docx) to PDF instantly in your browser. Choose page size, orientation, and margins before exporting."
      badge="Document Conversion"
      icon={FileType}
      backHref="/pdf-tools"
      backLabel="Back to PDF Tools"
    >
      <DocsToPdfConverter />
    </ToolPageLayout>
  );
}

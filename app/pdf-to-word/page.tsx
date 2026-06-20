"use client";
import ToolPageLayout from "@/components/ToolPageLayout";
import PdfToWordTool from "@/components/tools/PdfToWordTool";
import { FileOutput } from "lucide-react";
export default function Page() {
  return (
    <ToolPageLayout title="PDF to Word" description="Extract text from PDF and download as an editable Word document (.docx)." badge="Convert" icon={FileOutput}>
      <PdfToWordTool />
    </ToolPageLayout>
  );
}

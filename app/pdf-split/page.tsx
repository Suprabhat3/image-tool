"use client";
import ToolPageLayout from "@/components/ToolPageLayout";
import PdfSplitTool from "@/components/tools/PdfSplitTool";
import { Scissors } from "lucide-react";
export default function Page() {
  return (
    <ToolPageLayout title="Split PDF" description="Split a PDF into separate files by page or custom ranges." badge="Extract Pages" icon={Scissors}>
      <PdfSplitTool />
    </ToolPageLayout>
  );
}

"use client";
import ToolPageLayout from "@/components/ToolPageLayout";
import PdfRotateTool from "@/components/tools/PdfRotateTool";
import { RotateCw } from "lucide-react";
export default function Page() {
  return (
    <ToolPageLayout title="Rotate & Reorder Pages" description="Rotate individual pages and rearrange their order before downloading." badge="Edit Pages" icon={RotateCw}>
      <PdfRotateTool />
    </ToolPageLayout>
  );
}

"use client";
import ToolPageLayout from "@/components/ToolPageLayout";
import BatchProcessorTool from "@/components/tools/BatchProcessorTool";
import { Layers } from "lucide-react";
export default function Page() {
  return (
    <ToolPageLayout title="Batch Processing" description="Compress and convert multiple images at once. Download as ZIP." badge="Batch" icon={Layers} backHref="/image-tools" backLabel="Back to Image Tools">
      <BatchProcessorTool />
    </ToolPageLayout>
  );
}

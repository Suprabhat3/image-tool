"use client";
import ToolPageLayout from "@/components/ToolPageLayout";
import CompareTool from "@/components/tools/CompareTool";
import { SlidersHorizontal } from "lucide-react";
export default function Page() {
  return (
    <ToolPageLayout title="Compare Slider" description="Drag the slider to compare original and compressed images side by side." badge="Compare" icon={SlidersHorizontal} backHref="/image-tools" backLabel="Back to Image Tools">
      <CompareTool />
    </ToolPageLayout>
  );
}

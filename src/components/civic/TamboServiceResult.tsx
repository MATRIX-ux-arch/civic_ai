import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useTamboThread } from "@tambo-ai/react";
import { ServiceHeader } from "./ServiceHeader";
import { DocumentChecklist } from "./DocumentChecklist";
import { ProgressRing } from "./ProgressRing";
import { DownloadFormCard } from "./DownloadFormCard";
import { SuggestedActions } from "./SuggestedActions";
import { generatePDF } from "@/lib/pdfGenerator";
import type { CivicService } from "@/data/services";

interface TamboServiceResultProps {
  serviceName?: string;
  category?: string;
  description?: string;
  icon?: string;
  pdfTemplate?: string;
  documents?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

export default function TamboServiceResult({
  serviceName = "Unknown Service",
  category = "General",
  description = "",
  icon = "📋",
  pdfTemplate = "general",
  documents = [],
}: TamboServiceResultProps) {
  const { sendThreadMessage } = useTamboThread();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const service: CivicService = {
    id: serviceName.toLowerCase().replace(/\s+/g, "-"),
    serviceName,
    category,
    description,
    icon,
    pdfTemplate,
    documents,
  };

  const toggle = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const total = service.documents.length;
  const done = Object.values(checked).filter(Boolean).length;
  const progress = total > 0 ? (done / total) * 100 : 0;
  const isUnlocked = done === total && total > 0;

  const handleSuggestedAction = (query: string) => {
    sendThreadMessage(query, { streamResponse: true });
  };

  return (
    <div className="space-y-4">
      <ServiceHeader service={service} />

      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <DocumentChecklist
            documents={service.documents}
            checked={checked}
            onToggle={toggle}
          />
        </div>
        <div className="pt-6">
          <ProgressRing progress={progress} />
        </div>
      </div>

      <AnimatePresence>
        <DownloadFormCard
          service={service}
          isUnlocked={isUnlocked}
          onDownload={() => generatePDF(service)}
        />
      </AnimatePresence>

      <SuggestedActions onAction={handleSuggestedAction} />
    </div>
  );
}

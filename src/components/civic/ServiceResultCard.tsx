import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage } from "@/lib/chatEngine";
import { ServiceHeader } from "./ServiceHeader";
import { DocumentChecklist } from "./DocumentChecklist";
import { ProgressRing } from "./ProgressRing";
import { DownloadFormCard } from "./DownloadFormCard";
import { SuggestedActions } from "./SuggestedActions";
import { ServiceGrid } from "./ServiceGrid";
import { generatePDF } from "@/lib/pdfGenerator";

interface ServiceResultCardProps {
  message: ChatMessage;
  onSuggestedAction: (query: string) => void;
}

export function ServiceResultCard({ message, onSuggestedAction }: ServiceResultCardProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const service = message.service!;
  
  const toggle = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const total = service.documents.length;
  const done = Object.values(checked).filter(Boolean).length;
  const progress = total > 0 ? (done / total) * 100 : 0;
  const isUnlocked = done === total && total > 0;

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

      <SuggestedActions onAction={onSuggestedAction} />
    </div>
  );
}

interface SuggestionsCardProps {
  onSelect: (query: string) => void;
}

export function SuggestionsCard({ onSelect }: SuggestionsCardProps) {
  return (
    <div>
      <ServiceGrid onSelect={onSelect} />
      <SuggestedActions onAction={onSelect} />
    </div>
  );
}

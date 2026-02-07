import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ServiceDocument } from "@/data/services";

interface DocumentChecklistProps {
  documents: ServiceDocument[];
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}

export function DocumentChecklist({ documents, checked, onToggle }: DocumentChecklistProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="space-y-2"
    >
      <h4 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-3">
        Documents Required
      </h4>
      {documents.map((doc, i) => {
        const isChecked = !!checked[doc.id];
        return (
          <motion.button
            key={doc.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            onClick={() => onToggle(doc.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
              isChecked
                ? "glass neon-border bg-primary/5"
                : "glass-subtle hover:bg-card/50"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
                isChecked
                  ? "bg-primary text-primary-foreground neon-glow"
                  : "border border-muted-foreground/30"
              }`}
            >
              {isChecked && <Check className="w-3 h-3" />}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`text-base font-medium ${isChecked ? "text-foreground" : "text-foreground/80"}`}>
                {doc.name}
              </span>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">{doc.description}</p>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

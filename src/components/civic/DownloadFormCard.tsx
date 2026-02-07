import { motion } from "framer-motion";
import { Download, Lock } from "lucide-react";
import type { CivicService } from "@/data/services";

interface DownloadFormCardProps {
  service: CivicService;
  isUnlocked: boolean;
  onDownload: () => void;
}

export function DownloadFormCard({ service, isUnlocked, onDownload }: DownloadFormCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`glass p-4 mt-4 ${isUnlocked ? "neon-glow-strong neon-border" : ""}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground font-mono uppercase tracking-wide">
            {isUnlocked ? "Form Ready" : "Complete checklist to unlock"}
          </p>
          <p className="text-base font-medium text-foreground mt-1 truncate">
            {service.serviceName} — Blank Form (PDF)
          </p>
        </div>
        <motion.button
          whileHover={isUnlocked ? { scale: 1.05 } : {}}
          whileTap={isUnlocked ? { scale: 0.95 } : {}}
          onClick={isUnlocked ? onDownload : undefined}
          disabled={!isUnlocked}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-semibold transition-all ${
            isUnlocked
              ? "bg-primary text-primary-foreground neon-glow cursor-pointer hover:brightness-110"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {isUnlocked ? (
            <>
              <Download className="w-4 h-4" />
              Download
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Locked
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

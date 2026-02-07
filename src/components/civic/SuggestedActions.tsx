import { motion } from "framer-motion";

interface SuggestedActionsProps {
  onAction: (action: string) => void;
}

const suggestions = [
  { label: "Need another form?", query: "Show popular forms" },
  { label: "Report an issue", query: "I want to report a garbage problem" },
  { label: "Show all forms", query: "Show all available forms" },
  { label: "Help me choose", query: "Help me choose the right form" },
];

export function SuggestedActions({ onAction }: SuggestedActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="flex flex-wrap gap-2 mt-4"
    >
      {suggestions.map((s) => (
        <motion.button
          key={s.label}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onAction(s.query)}
          className="glass-subtle px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary hover:neon-border transition-all"
        >
          {s.label}
        </motion.button>
      ))}
    </motion.div>
  );
}

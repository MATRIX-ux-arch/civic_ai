import { motion } from "framer-motion";
import { services } from "@/data/services";

interface ServiceGridProps {
  onSelect: (query: string) => void;
}

export function ServiceGrid({ onSelect }: ServiceGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-2 gap-2 mt-3"
    >
      {services.map((s) => (
        <motion.button
          key={s.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(`I need ${s.serviceName.toLowerCase()}`)}
          className="glass-subtle p-3 text-left hover:neon-border transition-all"
        >
          <span className="text-2xl">{s.icon}</span>
          <p className="text-sm font-medium text-foreground mt-1.5 truncate">{s.serviceName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{s.category}</p>
        </motion.button>
      ))}
    </motion.div>
  );
}

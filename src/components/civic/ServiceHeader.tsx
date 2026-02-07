import { motion } from "framer-motion";
import type { CivicService } from "@/data/services";

interface ServiceHeaderProps {
  service: CivicService;
}

export function ServiceHeader({ service }: ServiceHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass neon-glow p-5 mb-4"
    >
      <div className="flex items-center gap-4">
        <div className="text-4xl">{service.icon}</div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-mono uppercase tracking-widest text-primary/80">
            {service.category}
          </span>
          <h3 className="text-xl font-bold text-foreground mt-0.5 truncate">
            {service.serviceName}
          </h3>
          <p className="text-base text-muted-foreground mt-1 line-clamp-2">
            {service.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

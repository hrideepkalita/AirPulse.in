import { motion } from "framer-motion";
import { Wind } from "lucide-react";
import { StateData, getAqiLevel, getStateAvgAqi } from "@/data/aqiData";

interface Props {
  state: StateData;
  index: number;
  onClick: () => void;
}

export default function StateCard({ state, index, onClick }: Props) {
  const avg = getStateAvgAqi(state);
  const level = getAqiLevel(avg);

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, type: "spring", stiffness: 120 }}
      whileHover={{ scale: 1.02, boxShadow: `0 0 20px hsl(${level.hsl} / 0.3)` }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="w-full rounded-2xl p-5 flex items-center gap-4 text-left transition-all duration-300 group"
      style={{
        background: "linear-gradient(135deg, hsl(0 0% 100%), hsl(210 30% 98%))",
        boxShadow: "0 4px 20px hsl(210 40% 80% / 0.2), 0 1px 4px hsl(210 40% 80% / 0.08)",
        border: `1.5px solid hsl(${level.hsl} / 0.15)`,
      }}
    >
      {/* AQI badge with pulsing dot */}
      <div className="relative">
        <div
          className="rounded-xl w-14 h-14 flex items-center justify-center text-lg font-bold shrink-0"
          style={{ backgroundColor: `hsl(${level.hsl})`, color: "white" }}
        >
          {avg}
        </div>
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2"
          style={{
            backgroundColor: `hsl(${level.hsl})`,
            borderColor: "white",
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-foreground truncate">{state.name}</h3>
        <p className="text-sm font-semibold" style={{ color: `hsl(${level.hsl})` }}>
          {level.emoji} {level.label}
        </p>
        <p className="text-xs text-muted-foreground">{state.cities.length} cities</p>
      </div>

      <Wind className="w-5 h-5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
    </motion.button>
  );
}

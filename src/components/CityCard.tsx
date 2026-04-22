import { motion } from "framer-motion";
import { CityData, getAqiLevel } from "@/data/aqiData";

interface Props {
  city: CityData;
  index: number;
  isCenter?: boolean;
}

export default function CityCard({ city, index, isCenter }: Props) {
  const level = getAqiLevel(city.aqi);

  const gradients: Record<string, string> = {
    good: "linear-gradient(135deg, hsl(145 55% 96%), hsl(160 40% 92%))",
    moderate: "linear-gradient(135deg, hsl(45 70% 96%), hsl(50 55% 92%))",
    unhealthy: "linear-gradient(135deg, hsl(25 70% 96%), hsl(15 55% 92%))",
    hazardous: "linear-gradient(135deg, hsl(0 55% 96%), hsl(350 45% 92%))",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 16 }}
      animate={{
        opacity: 1,
        scale: isCenter ? 1.04 : 1,
        y: 0,
      }}
      transition={{ delay: index * 0.04, duration: 0.35, type: "spring", stiffness: 140 }}
      className="snap-center shrink-0 w-[280px] rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: gradients[level.class],
        boxShadow: "0 4px 20px hsl(210 40% 80% / 0.2)",
        border: `1.5px solid hsl(${level.hsl} / 0.2)`,
      }}
    >
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-foreground text-base truncate">{city.name}</h4>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: `hsl(${level.hsl})`, color: "white" }}
        >
          {level.emoji} {level.label}
        </span>
      </div>

      <div className="flex items-end gap-2">
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.3, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2.5 h-2.5 rounded-full mb-2 shrink-0"
          style={{ backgroundColor: `hsl(${level.hsl})` }}
        />
        <span className="text-5xl font-extrabold leading-none" style={{ color: `hsl(${level.hsl})` }}>
          {city.aqi}
        </span>
        <span className="text-sm text-muted-foreground mb-1">AQI</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "PM2.5", value: city.pm25 },
          { label: "PM10", value: city.pm10 },
          { label: "CO", value: city.co },
        ].map((d) => (
          <div
            key={d.label}
            className="rounded-xl p-2.5 text-center"
            style={{ backgroundColor: `hsl(${level.hsl} / 0.1)` }}
          >
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{d.label}</p>
            <p className="text-sm font-bold text-foreground">{d.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

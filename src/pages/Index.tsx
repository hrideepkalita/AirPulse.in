import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CloudSun } from "lucide-react";
import { loadAqiData, StateData } from "@/data/aqiData";
import StateCard from "@/components/StateCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Index() {
  const navigate = useNavigate();
  const [states, setStates] = useState<StateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAqiData().then((data) => {
      setStates(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen max-w-lg mx-auto px-4 py-6 pb-12">
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <CloudSun className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-foreground leading-tight">AirPulse India</h1>
          <p className="text-xs text-muted-foreground">Real-time Air Quality Index</p>
        </div>
      </motion.header>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="flex flex-col gap-3"
        >
          {states.map((s, i) => (
            <StateCard key={s.slug} state={s} index={i} onClick={() => navigate(`/state/${s.slug}`)} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

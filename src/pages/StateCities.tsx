import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { loadAqiData, StateData, getAqiLevel, getStateAvgAqi, getAqiBgGradient } from "@/data/aqiData";
import CityCard from "@/components/CityCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function StateCities() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [centerIdx, setCenterIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<StateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAqiData().then((states) => {
      const found = states.find((s) => s.slug === slug) || null;
      setState(found);
      setLoading(false);
    });
  }, [slug]);

  const filtered = useMemo(() => {
    if (!state) return [];
    if (!query.trim()) return state.cities;
    const q = query.toLowerCase();
    return state.cities.filter((c) => c.name.toLowerCase().includes(q));
  }, [state, query]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    const cards = el.querySelectorAll<HTMLElement>("[data-city-card]");
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(center - cardCenter);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setCenterIdx(closest);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll, filtered]);

  if (loading) {
    return (
      <div className="min-h-screen max-w-3xl mx-auto px-4 py-6">
        <Skeleton className="h-10 w-40 mb-5 rounded-xl" />
        <Skeleton className="h-10 w-full mb-5 rounded-xl" />
        <div className="flex gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-56 flex-shrink-0 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">State not found.</p>
      </div>
    );
  }

  const avg = getStateAvgAqi(state);
  const level = getAqiLevel(avg);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen max-w-3xl mx-auto px-4 py-6 pb-12"
      style={{ background: getAqiBgGradient(avg) }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-3 mb-5"
      >
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-105"
          style={{
            background: "hsl(0 0% 100% / 0.85)",
            boxShadow: "0 2px 12px hsl(210 40% 80% / 0.2)",
          }}
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-foreground truncate">{state.name}</h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            Avg AQI:
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="inline-flex items-center gap-1 font-bold"
              style={{ color: `hsl(${level.hsl})` }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(${level.hsl})` }} />
              {avg} {level.emoji}
            </motion.span>
            <span>· {state.cities.length} locations</span>
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative mb-5"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 transition-shadow"
          style={{
            background: "hsl(0 0% 100% / 0.8)",
            boxShadow: "0 2px 12px hsl(210 40% 80% / 0.15)",
          }}
        />
      </motion.div>

      {/* Cities horizontal scroll */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scroll-snap-x flex gap-5 pb-4 -mx-4 px-4"
      >
        {filtered.map((c, i) => (
          <div key={c.name} data-city-card>
            <CityCard city={c} index={i} isCenter={i === centerIdx} />
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 w-full text-center">No cities match your search.</p>
        )}
      </div>

      {/* Disclaimer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-[11px] text-muted-foreground text-center mt-6 opacity-70"
      >
        Data based on 2024–2026 AQI trends. Simulated for demonstration purposes.
      </motion.p>
    </motion.div>
  );
}

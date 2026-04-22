export interface CityData {
  name: string;
  aqi: number;
  pm25: number;
  pm10: number;
  co: number;
}

export interface StateData {
  name: string;
  slug: string;
  cities: CityData[];
}

let _states: StateData[] = [];
let _loaded = false;

export async function loadAqiData(): Promise<StateData[]> {
  if (_loaded) return _states;
  const res = await fetch("/airData.json");
  const json = await res.json();
  _states = json.states;
  _loaded = true;
  return _states;
}

export function getStates(): StateData[] {
  return _states;
}

export function getAqiLevel(aqi: number) {
  if (aqi <= 50) return { label: "Good", class: "good", emoji: "😊", hsl: "145 63% 45%" } as const;
  if (aqi <= 100) return { label: "Moderate", class: "moderate", emoji: "😐", hsl: "45 95% 55%" } as const;
  if (aqi <= 200) return { label: "Unhealthy", class: "unhealthy", emoji: "😷", hsl: "25 95% 55%" } as const;
  return { label: "Hazardous", class: "hazardous", emoji: "⚠️", hsl: "0 75% 50%" } as const;
}

export function getAqiBgGradient(aqi: number): string {
  if (aqi <= 50) return "linear-gradient(160deg, hsl(145 70% 92%), hsl(170 50% 96%) 40%, hsl(0 0% 100%))";
  if (aqi <= 100) return "linear-gradient(160deg, hsl(45 80% 92%), hsl(50 50% 97%) 40%, hsl(0 0% 100%))";
  if (aqi <= 200) return "linear-gradient(160deg, hsl(25 80% 92%), hsl(30 50% 97%) 40%, hsl(0 0% 100%))";
  return "linear-gradient(160deg, hsl(0 60% 92%), hsl(0 40% 97%) 40%, hsl(0 0% 100%))";
}

export function getHealthTip(aqi: number): string {
  if (aqi <= 50) return "Air quality is great. Enjoy outdoor activities!";
  if (aqi <= 100) return "Acceptable air quality. Sensitive groups should limit prolonged outdoor exertion.";
  if (aqi <= 200) return "Unhealthy air. Reduce outdoor activity, especially for children and elderly.";
  return "Hazardous! Avoid all outdoor activity. Stay indoors with windows closed.";
}

export function getStateAvgAqi(state: StateData): number {
  return Math.round(state.cities.reduce((s, c) => s + c.aqi, 0) / state.cities.length);
}

export type ForecastHour = { hour: number; aqi: number };

/** Returns the lowest-AQI consecutive daylight window (2 or 3 hours). */
export function calculateBestOutdoorWindow(forecastData: ForecastHour[]): string | null {
  const daylight = forecastData.filter(({ hour, aqi }) => hour >= 6 && hour <= 20 && Number.isFinite(aqi)).sort((a, b) => a.hour - b.hour);
  let best: { start: number; end: number; average: number } | null = null;
  for (const length of [3, 2]) {
    for (let i = 0; i <= daylight.length - length; i++) {
      const block = daylight.slice(i, i + length);
      if (block.some((item, index) => index > 0 && item.hour !== block[index - 1].hour + 1)) continue;
      const average = block.reduce((sum, item) => sum + item.aqi, 0) / length;
      if (!best || average < best.average || (average === best.average && length > best.end - best.start)) best = { start: block[0].hour, end: block[length - 1].hour + 1, average };
    }
    if (best) break;
  }
  return best ? `${String(best.start).padStart(2, "0")}:00 – ${String(best.end).padStart(2, "0")}:00` : null;
}

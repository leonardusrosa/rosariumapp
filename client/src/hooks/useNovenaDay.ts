import { useState, useEffect, useCallback } from "react";

export type NovenaViewMode = "novena" | "full";

export function useNovenaDay(prayerId: number, totalDays: number) {
  const storageKey = `novena_day_${prayerId}`;
  const viewModeKey = `novena_view_${prayerId}`;

  const [selectedDay, setSelectedDayState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= totalDays) {
          return parsed;
        }
      }
    } catch {
      // LocalStorage unavailable
    }
    return 1;
  });

  const [viewMode, setViewModeState] = useState<NovenaViewMode>(() => {
    try {
      const saved = localStorage.getItem(viewModeKey);
      if (saved === "full" || saved === "novena") {
        return saved;
      }
    } catch {
      // LocalStorage unavailable
    }
    return "novena";
  });

  const setSelectedDay = useCallback(
    (day: number) => {
      const clamped = Math.max(1, Math.min(day, totalDays));
      setSelectedDayState(clamped);
      try {
        localStorage.setItem(storageKey, clamped.toString());
      } catch {
        // LocalStorage unavailable
      }
    },
    [storageKey, totalDays]
  );

  const setViewMode = useCallback(
    (mode: NovenaViewMode) => {
      setViewModeState(mode);
      try {
        localStorage.setItem(viewModeKey, mode);
      } catch {
        // LocalStorage unavailable
      }
    },
    [viewModeKey]
  );

  const nextDay = useCallback(() => {
    setSelectedDay(selectedDay + 1);
  }, [selectedDay, setSelectedDay]);

  const prevDay = useCallback(() => {
    setSelectedDay(selectedDay - 1);
  }, [selectedDay, setSelectedDay]);

  return {
    selectedDay,
    setSelectedDay,
    nextDay,
    prevDay,
    viewMode,
    setViewMode,
    isFirstDay: selectedDay <= 1,
    isLastDay: selectedDay >= totalDays,
  };
}

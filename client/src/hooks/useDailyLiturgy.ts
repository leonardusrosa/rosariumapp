import { useState, useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { DailyLiturgyData } from "@/types/liturgy";

export type LanguageMode = 'bilingual' | 'latin' | 'portuguese';

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function offsetDate(dateStr: string, daysOffset: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + daysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const fetchLiturgy = async (date: string): Promise<DailyLiturgyData> => {
  const res = await fetch(`/api/liturgy?date=${date}`);
  if (!res.ok) {
    throw new Error('Falha ao carregar a liturgia diária');
  }
  return res.json();
};

export function useDailyLiturgy(initialDate?: string) {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || getTodayString());
  const [languageMode, setLanguageMode] = useState<LanguageMode>('bilingual');

  const { data, isLoading, isError, error, refetch } = useQuery<DailyLiturgyData>({
    queryKey: ['daily-liturgy', selectedDate],
    queryFn: () => fetchLiturgy(selectedDate),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours: liturgy for a date never changes
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days in memory
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Prefetch adjacent days (yesterday & tomorrow) in the background
  useEffect(() => {
    const prevDate = offsetDate(selectedDate, -1);
    const nextDate = offsetDate(selectedDate, 1);

    queryClient.prefetchQuery({
      queryKey: ['daily-liturgy', prevDate],
      queryFn: () => fetchLiturgy(prevDate),
      staleTime: 1000 * 60 * 60 * 24
    });

    queryClient.prefetchQuery({
      queryKey: ['daily-liturgy', nextDate],
      queryFn: () => fetchLiturgy(nextDate),
      staleTime: 1000 * 60 * 60 * 24
    });
  }, [selectedDate, queryClient]);

  const goToNextDay = useCallback(() => {
    setSelectedDate((curr) => offsetDate(curr, 1));
  }, []);

  const goToPreviousDay = useCallback(() => {
    setSelectedDate((curr) => offsetDate(curr, -1));
  }, []);

  const goToToday = useCallback(() => {
    setSelectedDate(getTodayString());
  }, []);

  return {
    selectedDate,
    setSelectedDate,
    goToNextDay,
    goToPreviousDay,
    goToToday,
    data,
    isLoading,
    isError,
    error,
    refetch,
    languageMode,
    setLanguageMode,
    isToday: selectedDate === getTodayString()
  };
}

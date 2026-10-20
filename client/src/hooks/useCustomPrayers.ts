import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CustomPrayer } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

export function useCustomPrayers(userId: string | null) {
  const [localCustomPrayers, setLocalCustomPrayers] = useState<Array<{ id: number; title: string; content: string; section: string }>>([]);
  const queryClient = useQueryClient();

  // Fetch custom prayers from server if user is logged in
  const { data: serverCustomPrayers, isLoading } = useQuery({
    queryKey: [`/api/custom-prayers/${userId}`],
    enabled: !!userId,
  });

  // Create custom prayer mutation
  const createCustomPrayerMutation = useMutation({
    mutationFn: async (prayerData: { title: string; content: string; section: string }) => {
      if (!userId) {
        // Handle local storage for guest users
        const newCustomPrayer = {
          id: Date.now(),
          title: prayerData.title,
          content: prayerData.content,
          section: prayerData.section,
        };
        const updated = [...localCustomPrayers, newCustomPrayer];
        localStorage.setItem('rosary_custom_prayers', JSON.stringify(updated));
        setLocalCustomPrayers(updated);
        window.dispatchEvent(new Event('rosarium:custom-prayers-changed'));
        return newCustomPrayer;
      } else {
        const response = await apiRequest('POST', '/api/custom-prayers', {
          userId,
          title: prayerData.title,
          content: prayerData.content,
          section: prayerData.section,
          isActive: true,
        });
        return response.json();
      }
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [`/api/custom-prayers/${userId}`] });
      }
    },
  });

  // Update custom prayer mutation
  const updateCustomPrayerMutation = useMutation({
    mutationFn: async (data: { id: number; title: string; content: string; section: string }) => {
      if (!userId) {
        // Handle local storage for guest users
        const updated = localCustomPrayers.map(p => 
          p.id === data.id ? { ...p, title: data.title, content: data.content, section: data.section } : p
        );
        localStorage.setItem('rosary_custom_prayers', JSON.stringify(updated));
        setLocalCustomPrayers(updated);
        window.dispatchEvent(new Event('rosarium:custom-prayers-changed'));
        return;
      } else {
        await apiRequest('PATCH', `/api/custom-prayers/${data.id}`, {
          userId,
          title: data.title,
          content: data.content,
          section: data.section,
        });
      }
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [`/api/custom-prayers/${userId}`] });
      }
    },
  });

  // Delete custom prayer mutation
  const deleteCustomPrayerMutation = useMutation({
    mutationFn: async (prayerId: number) => {
      if (!userId) {
        // Handle local storage for guest users
        const updated = localCustomPrayers.filter(p => p.id !== prayerId);
        setLocalCustomPrayers(updated);
        window.dispatchEvent(new Event('rosarium:custom-prayers-changed'));
        localStorage.setItem('rosary_custom_prayers', JSON.stringify(updated));
        return;
      } else {
        await apiRequest('DELETE', `/api/custom-prayers/${prayerId}`, { userId });
      }
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [`/api/custom-prayers/${userId}`] });
      }
    },
  });

  // Keep multiple mounted consumers (modal and reading view), plus tabs, in sync.
  useEffect(() => {
    if (userId) return;
    const reload = () => {
      const stored = localStorage.getItem('rosary_custom_prayers');
      if (!stored) {
        setLocalCustomPrayers([]);
        return;
      }
      try {
        const parsed = JSON.parse(stored);
        setLocalCustomPrayers(Array.isArray(parsed) ? parsed : []);
      } catch {
        setLocalCustomPrayers([]);
      }
    };
    reload();
    window.addEventListener('rosarium:custom-prayers-changed', reload);
    window.addEventListener('storage', reload);
    return () => {
      window.removeEventListener('rosarium:custom-prayers-changed', reload);
      window.removeEventListener('storage', reload);
    };
  }, [userId]);

  const customPrayers = userId 
    ? (Array.isArray(serverCustomPrayers) ? serverCustomPrayers : []).map((p: CustomPrayer) => ({ 
        id: p.id, 
        title: p.title, 
        content: p.content, 
        section: p.section 
      }))
    : localCustomPrayers;

  return {
    customPrayers,
    isLoading: userId ? isLoading : false,
    addCustomPrayer: (prayerData: { title: string; content: string; section: string }) => 
      createCustomPrayerMutation.mutateAsync(prayerData),
    updateCustomPrayer: (data: { id: number; title: string; content: string; section: string }) => 
      updateCustomPrayerMutation.mutateAsync(data),
    removeCustomPrayer: (id: number) => deleteCustomPrayerMutation.mutate(id),
    isAddingCustomPrayer: createCustomPrayerMutation.isPending,
    isUpdatingCustomPrayer: updateCustomPrayerMutation.isPending,
    isRemovingCustomPrayer: deleteCustomPrayerMutation.isPending,
  };
}
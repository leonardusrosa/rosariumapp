import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Intention } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

export function useIntentions(userId: string | null) {
  const [localIntentions, setLocalIntentions] = useState<Array<{ id: number; text: string }>>([]);
  const queryClient = useQueryClient();

  // Fetch intentions from server if user is logged in
  const { data: serverIntentions, isLoading } = useQuery({
    queryKey: [`/api/intentions/${userId}`],
    enabled: !!userId,
  });

  // Create intention mutation
  const createIntentionMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!userId) {
        // Handle local storage for guest users
        const newIntention = {
          id: Date.now(),
          text,
        };
        setLocalIntentions(prev => [...prev, newIntention]);
        localStorage.setItem('rosary_intentions', JSON.stringify([...localIntentions, newIntention]));
        return newIntention;
      } else {
        const response = await apiRequest('POST', '/api/intentions', {
          userId,
          text,
          isActive: true,
        });
        return response.json();
      }
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [`/api/intentions/${userId}`] });
      }
    },
  });

  // Delete intention mutation
  const deleteIntentionMutation = useMutation({
    mutationFn: async (intentionId: number) => {
      if (!userId) {
        // Handle local storage for guest users
        const updated = localIntentions.filter(i => i.id !== intentionId);
        setLocalIntentions(updated);
        localStorage.setItem('rosary_intentions', JSON.stringify(updated));
        return;
      } else {
        await apiRequest('DELETE', `/api/intentions/${intentionId}`, { userId });
      }
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [`/api/intentions/${userId}`] });
      }
    },
  });

  // Load local intentions on mount for guest users
  useEffect(() => {
    if (!userId) {
      const stored = localStorage.getItem('rosary_intentions');
      if (stored) {
        try {
          setLocalIntentions(JSON.parse(stored));
        } catch (error) {
          localStorage.removeItem('rosary_intentions');
        }
      }
    }
  }, [userId]);

  const intentions = userId 
    ? (Array.isArray(serverIntentions) ? serverIntentions : []).map((i: Intention) => ({ id: i.id, text: i.text }))
    : localIntentions;

  return {
    intentions,
    isLoading: userId ? isLoading : false,
    addIntention: (text: string) => createIntentionMutation.mutate(text),
    removeIntention: (id: number) => deleteIntentionMutation.mutate(id),
    isAddingIntention: createIntentionMutation.isPending,
    isRemovingIntention: deleteIntentionMutation.isPending,
  };
}

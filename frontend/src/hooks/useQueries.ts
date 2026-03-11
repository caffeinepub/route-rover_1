import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Expense, TravelNote, BudgetCategory } from '../backend';
import { toast } from 'sonner';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

export function useSetTripBudget() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tripId, category, amount }: { tripId: string; category: BudgetCategory; amount: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setTripBudget(tripId, category, amount);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tripBudget', variables.tripId] });
      toast.success('Budget updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to set budget: ${error.message}`);
    },
  });
}

export function useGetTripBudget(tripId: string, category: BudgetCategory) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['tripBudget', tripId, category],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getTripBudget(tripId, category);
    },
    enabled: !!actor && !actorFetching && !!tripId,
  });
}

export function useAddExpense() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tripId, category, amount, description }: { tripId: string; category: BudgetCategory; amount: number; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addExpense(tripId, category, amount, description);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tripExpenses', variables.tripId] });
      toast.success('Expense added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add expense: ${error.message}`);
    },
  });
}

export function useGetTripExpenses(tripId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Expense[]>({
    queryKey: ['tripExpenses', tripId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTripExpenses(tripId);
    },
    enabled: !!actor && !actorFetching && !!tripId,
  });
}

export function useAddTravelNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tripId, title, content, category }: { tripId: string; title: string; content: string; category: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTravelNote(tripId, title, content, category);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tripNotes', variables.tripId] });
      toast.success('Note added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add note: ${error.message}`);
    },
  });
}

export function useGetTripNotes(tripId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TravelNote[]>({
    queryKey: ['tripNotes', tripId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTripNotes(tripId);
    },
    enabled: !!actor && !actorFetching && !!tripId,
  });
}

export function useDeleteTravelNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTravelNoteById(noteId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tripNotes'] });
      toast.success('Note deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete note: ${error.message}`);
    },
  });
}

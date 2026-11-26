import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStore } from '../api/storeApi';
import type { CreateStoreData } from '../api/storeApi';
import { useAuth } from '../context/useAuth';
import { storeKeys } from '../queryKeys/storeKeys';

export const useCreateStore = () => {
  const queryClient = useQueryClient(); //This gives us access to the shared QueryClient we configured in App.tsx.
  const { token, userId } = useAuth();

  return useMutation({
    mutationFn: (storeData: CreateStoreData) => { //The storeData argument is provided when we call mutate().
      if (!token) {
        throw new Error('Authentication token is required');
      }

      return createStore(storeData, token);
    },

    //This callback executes after the mutation succeeds. mutation means whenever we create or update new store.
    onSuccess: () => {
      if (!userId) return;

      queryClient.invalidateQueries({
        queryKey: storeKeys.lists(userId),
      });
    },
  });
};
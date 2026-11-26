
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStore } from '../api/storeApi';
import type { CreateStoreData } from '../api/storeApi';
import { useAuth } from '../context/useAuth';
import { storeKeys } from '../queryKeys/storeKeys';

interface UpdateStoreVariables {
  id: number;
  storeData: CreateStoreData;
}

export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  const { token, userId } = useAuth();

  return useMutation({
    mutationFn: ({ id, storeData }: UpdateStoreVariables) => {
      if (!token) {
        throw new Error('Authentication token is required');
      }

      return updateStore(id, storeData, token);
    },

    onSuccess: () => {
      if (!userId) return;

      queryClient.invalidateQueries({
        queryKey: storeKeys.lists(userId),
      });
    },
  });
};

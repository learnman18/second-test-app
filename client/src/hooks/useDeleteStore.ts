
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteStore } from '../api/storeApi';
import { useAuth } from '../context/useAuth';
import { storeKeys } from '../queryKeys/storeKeys';

export const useDeleteStore = () => {
  const queryClient = useQueryClient();
  const { token, userId } = useAuth();

  return useMutation({
    mutationFn: (id: number) => {
      if (!token) {
        throw new Error('Authentication token is required');
      }

      return deleteStore(id, token);
    },

    onSuccess: () => {
      if (!userId) return;

      return queryClient.invalidateQueries({
        queryKey: storeKeys.lists(userId),
      });
    },
  });
};

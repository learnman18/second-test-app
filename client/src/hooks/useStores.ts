
//React query code replaced with below commented out custom hook code.

import { useQuery } from '@tanstack/react-query';
import { getStores } from '../api/storeApi';
import type { Store } from '../api/storeApi';
import { storeKeys } from '../queryKeys/storeKeys';

export const useStores = (token: string, userId: number | null) => {
  return useQuery<Store[], Error>({
    queryKey: userId
      ? storeKeys.lists(userId)
      : ['stores', 'list', 'no-user'],

    queryFn: () => getStores(token),

    enabled: Boolean(token && userId),
  });
};


//custom hook to fetch stores from the API and manage loading and error states. 
//Now we will be replacing belwo piece of code with Tanstack/React query.

/*
import { useEffect, useState } from 'react';
import { getStores } from '../api/storeApi';
import type { Store } from '../api/storeApi';

export const useStores = (token: string, refreshKey: number) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(token)); //The purpose of Boolean() is to convert a value into an actual boolean: true or false.
  //if we keep useState(true) This always starts loading as true, even without a token but useState(Boolean(token)) Sets the initial loading state according to token availability.
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!token) return
    const controller = new AbortController(); //to abort the API request if the component unmounts or token changes

    const getStore = async () => {
      try {
        setIsLoading(true);
        setApiError('');

        const response = await getStores(token, controller.signal);
        setStores(response);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        setApiError(
          error instanceof Error ? error.message : 'Something went wrong'
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }
    getStore();

    return () => {
      controller.abort();
    }
  }, [token, refreshKey])

  return { stores, isLoading, apiError }

}
*/
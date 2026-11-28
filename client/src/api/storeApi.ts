const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { apiRequest } from './apiRequest';
export interface CreateStoreData {
  store_name: string;
  location: string;
  store_email: string;
}

interface CreateStoreResponse {
  message: string;
  store: {
    store_id: number;
    store_name: string;
    location: string | null;
    store_email: string | null;
    userId: number | null;
  };
}

export const createStore = async (storeData: CreateStoreData, token: string): Promise<CreateStoreResponse> => {
  // console.log("storeData", storeData, "API_BASE_URL", API_BASE_URL);
  return apiRequest<CreateStoreResponse>(`${API_BASE_URL}/store`, {
    method: 'POST',
    token,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      store_name: storeData.store_name,
      location: storeData.location,
      store_email: storeData.store_email,
    }),
  });
};

export interface Store {
  store_id: number;
  store_name: string;
  store_email: string | null;
  location: string | null;
  user: {
    user_id: number;
    user_name: string;
    user_email: string;
  } | null;
}

export const updateStore = (
  id: number,
  storeData: CreateStoreData,
  token: string
) => {
  return apiRequest<Store>(
    `${API_BASE_URL}/store/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(storeData),
      token,
    }
  );
};

export const getStores = async (token: string, signal?: AbortSignal): Promise<Store[]> => {
  return apiRequest<Store[]>(`${API_BASE_URL}/store`, {
    method: 'GET',
    token,
    signal,
  });
};

export const deleteStore = (id: number, token: string) => {
  return apiRequest<void>(
    `${API_BASE_URL}/store/${id}`,
    {
      method: 'DELETE',
      token,
    }
  );
};
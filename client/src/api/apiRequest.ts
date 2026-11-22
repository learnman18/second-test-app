type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export const setUnauthorizedHandler = (
  callback: UnauthorizedHandler
) => {
  unauthorizedHandler = callback;
};

export const handleUnauthorized = () => {
  unauthorizedHandler?.();
};

interface ApiRequestOptions extends RequestInit {
  token?: string;
}

export const apiRequest = async <T>(url: string, options: ApiRequestOptions = {}): Promise<T> => {
  const { token, headers, ...restOptions } = options;

  const response = await fetch(url, {
    ...restOptions,
    headers: {
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  const contentType = response.headers.get('content-type');
  //in case API respons is empty, plain-tet and 204 no-content, so we are handling both the response with data and empty data
  const data = contentType?.includes('application/json')
    ? await response.json()
    : null;

  if (response.status === 401) {
    handleUnauthorized();
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Something went wrong');
  }

  return data as T;
  //T is a generic type parameter. It means the caller specifies what type of response it expects
  //for example apiRequest<Store[]>(url); Here, T becomes Store[]. apiRequest<CreateStoreResponse>(url); Here, T becomes CreateStoreResponse.

};
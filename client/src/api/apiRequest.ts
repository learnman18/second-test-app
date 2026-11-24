
// setUnauthorizedHandler	Correct	Registers or clears the logout callback.
// handleUnauthorized	Correct	Executes the registered callback if one exists.
// isUnauthorizedHandled	Correct	Prevents repeated logout handling.
// resetUnauthorizedHandler	Correct	Allows a new session to handle 401 responses again.
// ApiErrorResponse	Correct	Describes the expected error response shape.
// Generic apiRequest<T>	Correct	Allows different API calls to specify their expected response types.

// unauthorizedHandler stores the actual logout function.
// isUnauthorizedHandled stores whether we've already triggered that logout for the current session.

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export const setUnauthorizedHandler = (callback: UnauthorizedHandler | null) => {
  unauthorizedHandler = callback;
};

export const handleUnauthorized = () => {
  unauthorizedHandler?.();
};

interface ApiRequestOptions extends RequestInit {
  token?: string;
}
interface ApiErrorResponse {
  message?: string;
}

let isUnauthorizedHandled = false;

export const resetUnauthorizedHandled = () => {
  isUnauthorizedHandled = false;
};

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

  if (response.status === 401 && !isUnauthorizedHandled) {
    isUnauthorizedHandled = true;
    handleUnauthorized();
  }

  if (!response.ok) {
    const errorData = data as ApiErrorResponse | null;
    throw new Error(errorData?.message || 'Something went wrong');
  }

  return data as T;
  //T is a generic type parameter. It means the caller specifies what type of response it expects
  //for example apiRequest<Store[]>(url); Here, T becomes Store[]. apiRequest<CreateStoreResponse>(url); Here, T becomes CreateStoreResponse.

};
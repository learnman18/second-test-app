const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface LoginCredentials {
  user_email: string;
  password: string;
}
export interface LoginResponse {
  message: string;
  token: string;
  error: string;
}

export class LoginApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'LoginApiError';
    this.statusCode = statusCode;
  }
}

export const loginUser = async (credentials: LoginCredentials): Promise<{ data: LoginResponse; statusCode: number }> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data: LoginResponse = await response.json();
  const statusCode = response.status;
  if (!response.ok) {
    throw new LoginApiError(data.error || data.message || 'Login failed', statusCode);
  }

  return { data, statusCode };
};
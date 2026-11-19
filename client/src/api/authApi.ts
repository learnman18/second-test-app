
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface LoginCredentials {
  user_email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
}

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data: LoginResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
};
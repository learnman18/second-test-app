import { useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';

//file 2
// The AuthProvider component is responsible for providing the authentication context to its child components. It manages the token state and provides a function to update it.
// Think of this as the person responsible for managing the employee access system.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string>('VALID_JWT_TOKEN'); // Initialize with a valid JWT token

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
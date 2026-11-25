import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { setUnauthorizedHandler } from '../api/apiRequest';
import { useQueryClient } from '@tanstack/react-query';

//file 2
// The AuthProvider component is responsible for providing the authentication context to its child components. It manages the token state and provides a function to update it.
// Think of this as the person responsible for managing the employee access system.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Why are we using () => here?
  // This is called lazy initialization in React.
  // Instead of reading localStorage every time the component renders, React calls this function when the state is initialized.
  // it means that the function will only be executed once when the component is first rendered, now with the help of setToken value will get updated bu this below inilization line won't run.
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const queryClient = useQueryClient();
  //we are calling this function to clear the token so user will logout and also when we logout we want to clear the react query cache so that the
  // next user who logs in doesn't see the previous user's data. This is important for security and privacy reasons.
  const logout = useCallback(() => {
    queryClient.clear();
    setToken(null);
  }, [queryClient]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  //Register callback for unauthorized API responses
  //The objective is simple: whenever an API request receives 401 Unauthorized, AuthProvider should automatically execute setToken(null).
  useEffect(() => {
    // setUnauthorizedHandler(() => {
    //   setToken(null);
    // });
    setUnauthorizedHandler(logout);

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
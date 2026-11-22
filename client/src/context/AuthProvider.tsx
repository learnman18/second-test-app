import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { setUnauthorizedHandler } from '../api/apiRequest';

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
    setUnauthorizedHandler(() => {
      setToken(null);
    });

    return () => {
      setUnauthorizedHandler(() => { });
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
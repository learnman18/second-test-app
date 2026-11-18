import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

//file 3
//created a custom hook to use the AuthContext so that we can easily access the token and setToken function in any component that needs it.
//Think of this as an employee's access card.
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

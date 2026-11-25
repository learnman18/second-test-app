import { createContext } from 'react';

//we have just kept context in three different files, we can keep all of them in one file as well. this is file 1

// Define the shape of the authentication context, which includes the token and a function to update it.
// Think of this as creating a common communication channel where authentication information will be shared.
export interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void; // Add the logout function to the context type
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
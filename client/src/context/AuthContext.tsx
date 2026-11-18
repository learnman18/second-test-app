import { createContext } from 'react';

//we have just kept context in three different files, we can keep all of them in one file as well. this is file 1

// Define the shape of the authentication context, which includes the token and a function to update it.
// Think of this as creating a common communication channel where authentication information will be shared.
export interface AuthContextType {
  token: string;
  setToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
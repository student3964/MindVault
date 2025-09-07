// import React, { createContext, useState, useContext, useEffect } from 'react';

// interface User {
//   firstName: string;
//   email: string;
// }

// interface AuthContextType {
//   token: string | null;
//   user: User | null;
//   isLoading: boolean;
//   login: (token: string) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (token) {
//         try {
//           const response = await fetch('http://localhost:5000/api/auth/me', {
//             headers: { 'x-auth-token': token }
//           });
//           if (response.ok) {
//             const data = await response.json();
//             setUser(data);
//           } else {
//             // Token is invalid, log the user out
//             localStorage.removeItem('token');
//             setToken(null);
//             setUser(null);
//           }
//         } catch (error) {
//           console.error("Failed to fetch user", error);
//           localStorage.removeItem('token');
//           setToken(null);
//           setUser(null);
//         }
//       }
//       setIsLoading(false);
//     };
//     fetchUser();
//   }, [token]);


//   const login = (newToken: string) => {
//     localStorage.setItem('token', newToken);
//     setToken(newToken);
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to easily use the auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// frontend/src/context/AuthContext.tsx

// import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// // 1. We add isLoggedIn to the type definition here
// interface AuthContextType {
//   isLoggedIn: boolean;
//   token: string | null;
//   login: (newToken: string) => void;
//   logout: () => void;
// }
// const AuthContext = createContext<AuthContextType | undefined>(undefined);
// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
//   // 2. This 'isLoggedIn' state is automatically calculated based on the token
//   const isLoggedIn = !!token;
//   useEffect(() => {
//     if (token) {
//       localStorage.setItem('token', token);
//     } else {
//       localStorage.removeItem('token');
//     }
//   }, [token]);
//   const login = (newToken: string) => {
//     setToken(newToken);
//   };
//   const logout = () => {
//     setToken(null);
//   };
//   return (
//     // 3. We provide isLoggedIn to all components that use the context
//     <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// frontend/src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// 1. Define a type for the user object
interface User {
  firstName: string;
  email: string;
}

// 2. Add the 'user' object to our context's type
interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  user: User | null; // <-- ADD THIS
  login: (newToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null); // <-- ADD USER STATE

  const isLoggedIn = !!token;

  useEffect(() => {
    // 3. This new effect will run whenever the token changes
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: { 'x-auth-token': token },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const data: User = await response.json();
          setUser(data); // Store the fetched user data
        } catch (error) {
          console.error(error);
          setUser(null); // Clear user data on error
          setToken(null); // Log out if token is invalid
        }
      } else {
        setUser(null); // If there's no token, there's no user
      }
    };

    fetchUserData();
  }, [token]); // The dependency array ensures this runs when the token is set

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    // 4. Provide the user object to the rest of the app
    <AuthContext.Provider value={{ isLoggedIn, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
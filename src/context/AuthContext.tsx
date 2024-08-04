import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAuth, onAuthStateChanged, User, browserLocalPersistence, setPersistence } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

interface AuthContextProps {
  user: User | null;
  role: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: string | null) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  role: null,
  loading: true,
  setUser: () => {},
  setRole: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            setUser(user);
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const userData = docSnap.data();
              setRole(userData.role);
            } else {
              setRole(null);
            }
          } else {
            setUser(null);
            setRole(null);
          }
          setLoading(false);
        });

        return unsubscribe;
      })
      .catch((error) => {
        console.error('Error setting persistence:', error);
        setLoading(false);
      });
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, role, loading, setUser, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

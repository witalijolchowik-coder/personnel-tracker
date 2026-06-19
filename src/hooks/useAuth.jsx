import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase.js';
import { ensureUserDocument } from '../services/userService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setError('');
      try {
        if (!user) {
          setCurrentUser(null);
          setUserProfile(null);
          return;
        }

        const profile = await ensureUserDocument(user);
        setCurrentUser(user);
        setUserProfile(profile);
      } catch (authError) {
        setCurrentUser(user || null);
        setError(authError.message || 'Nie udało się odczytać profilu użytkownika.');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setError('');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    setError('');
    await signOut(auth);
  };

  const value = useMemo(() => ({
    currentUser,
    userProfile,
    loading,
    error,
    login,
    logout,
  }), [currentUser, userProfile, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};

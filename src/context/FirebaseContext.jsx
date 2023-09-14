import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, browserLocalPersistence } from "firebase/auth";

const FB_API_KEY = "AIzaSyAPgb67_fnXfVr_uHYfw7tNrvGtzQXvivk"
export const localStorageAuthKey = `firebase:authUser:${FB_API_KEY}:[DEFAULT]`
const firebaseConfig = {
  apiKey: FB_API_KEY,
  authDomain: "linguosity-website.firebaseapp.com",
  projectId: "linguosity-website",
  storageBucket: "linguosity-website.appspot.com",
  messagingSenderId: "343920359411",
  appId: "1:343920359411:web:53679fb0e64cdcde3cc486",
  measurementId: "G-MK4707E53B"
};

const FirebaseContext = createContext();

export function FirebaseProvider({ children }) {
  const firebaseApp = initializeApp(firebaseConfig)
  const firebaseAuth = getAuth(firebaseApp)
  firebaseAuth.setPersistence(browserLocalPersistence)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!error) return
    setTimeout(() => setError(null), 5000)
  }, [error])


  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
      setUser({ name: result.user.displayName ?? result.user.email });
      setLoading(false)
      return true
    } catch (error) {
      console.log(error.message)

      if (error.message.includes("invalid-email")) {
        setError('Please type an valid email.')
      } else if (error.message.includes("user-not-found")) {
        setError("User doesn't exist. Please register.");
      } else {
        setError('Unknown error.')
        console.log(error.message)
      }
      return false
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('from logout')
      await signOut(firebaseAuth);
      localStorage.removeItem('authToken');
      setUser(null)
    } catch (error) {
      console.log(error.message)
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      setUser({ name: result.user.displayName, avatar: result.user.photoURL })
      return true
    } catch (error) {
      setError(error.message);
      return false
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      setUser({ name: result.user.displayName ?? result.user.email });
      return true
    } catch (error) {
      setError(error.message);
      return false
    } finally {
      setLoading(false);
    }
  };


  return (
    <FirebaseContext.Provider value={{
      user,
      setUser,
      loading,
      error,
      registerUser,
      login,
      logout,
      loginWithGoogle
    }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebaseAuth() {
  return useContext(FirebaseContext);
}

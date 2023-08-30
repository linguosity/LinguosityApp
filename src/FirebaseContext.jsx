import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

const FirebaseContext = createContext();

export function FirebaseProvider({ children }) {
  const firebaseConfig = {
    apiKey: "AIzaSyAPgb67_fnXfVr_uHYfw7tNrvGtzQXvivk",
    authDomain: "linguosity-website.firebaseapp.com",
    projectId: "linguosity-website",
    storageBucket: "linguosity-website.appspot.com",
    messagingSenderId: "343920359411",
    appId: "1:343920359411:web:53679fb0e64cdcde3cc486",
    measurementId: "G-MK4707E53B"
  };

  const firebaseApp = initializeApp(firebaseConfig)
  const firebaseAuth = getAuth(firebaseApp)
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
      setUser(result.user.displayName ?? result.user.email);
      setLoading(false)
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
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(firebaseAuth);
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
      setUser(result.user.displayName)
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      setUser(result.user.displayName ?? result.user.email);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <FirebaseContext.Provider value={{
      user,
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

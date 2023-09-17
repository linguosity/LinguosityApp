import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, browserLocalPersistence } from "firebase/auth";
import { child, get, getDatabase, onValue, ref, set, update } from "firebase/database"

const FB_API_KEY = "AIzaSyAPgb67_fnXfVr_uHYfw7tNrvGtzQXvivk"
export const localStorageAuthKey = `firebase:authUser:${FB_API_KEY}:[DEFAULT]`

const FB_CONFIG = {
  apiKey: FB_API_KEY,
  authDomain: "linguosity-website.firebaseapp.com",
  projectId: "linguosity-website",
  storageBucket: "linguosity-website.appspot.com",
  messagingSenderId: "343920359411",
  appId: "1:343920359411:web:53679fb0e64cdcde3cc486",
  measurementId: "G-MK4707E53B",
  databaseURL: "https://linguosity-website-default-rtdb.firebaseio.com/"
};

const DEFAULT_USER_STATE = {
  plan: 'free',
  generations: 0,
  lastLogin: '',
  customerId: '',
  subscriptionId: '',
  subscriptionStatus: ''
}

const FirebaseContext = createContext();

export function FirebaseProvider({ children }) {
  const fbApp = initializeApp(FB_CONFIG)
  const fbAuth = getAuth(fbApp)
  fbAuth.setPersistence(browserLocalPersistence)
  const fbDatabase = getDatabase(fbApp)
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    if (!error) return
    setTimeout(() => setError(null), 5000)
  }, [error])

useEffect(() => {
  if (!user) return
  const userDataRef = ref(fbDatabase, 'users/' + user.id)
  onValue(userDataRef, (snapshot) => {
    console.log('userData updated', snapshot.val())
    setUserData(snapshot.val())
  });
}, [user])
  // auth methods
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithEmailAndPassword(fbAuth, email, password);
      setUser({ id: result.user.uid, name: result.user.displayName ?? result.user.email });
      const dbEntry = await getDBEntry(result.user.uid)
      if (!dbEntry) {
        registerNewDBEntry(result.user.uid, { lastLogin: (new Date).toUTCString() })
      } else {
        updateDBEntry(result.user.uid, { lastLogin: (new Date).toUTCString() })
      }
      setLoading(false)
      return {
        success: true,
        email
      }
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
      return {
        success: false,
        email: null
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('from logout')
      await signOut(fbAuth);
      setUserData(null)
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
      const result = await signInWithPopup(fbAuth, provider);
      setUser({ id: result.user.uid, name: result.user.displayName, avatar: result.user.photoURL })
      const dbEntry = await getDBEntry(result.user.uid)
      if (!dbEntry) {
        registerNewDBEntry(result.user.uid, { lastLogin: (new Date).toUTCString() })
      } else {
        updateDBEntry(result.user.uid, { lastLogin: (new Date).toUTCString() })
      }
      return {
        success: true,
        email: result.user.email
      }
    } catch (error) {
      setError(error.message);
      return {
        success: false,
        email: null
      }
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createUserWithEmailAndPassword(fbAuth, email, password);
      setUser({ id: result.user.uid, name: result.user.displayName ?? result.user.email });
      registerNewDBEntry(result.user.uid, { lastLogin: (new Date).toUTCString() })
      return {
        success: true,
        email
      }
    } catch (error) {
      setError(error.message);
      return {
        success: false,
        email: null
      }
    } finally {
      setLoading(false);
    }
  };

  // database methods

  const registerNewDBEntry = async (userId, value) => {
    try {
      await set(ref(fbDatabase, 'users/' + userId), {...DEFAULT_USER_STATE, ...value});
    } catch (error) {
      console.log('error on registerNewEntry', error)
    }
  }

  const getDBEntry = async (userId) => {
    try {
      const result = await get(child(ref(fbDatabase), `users/${userId}`))
      if (result) {
        return result.val()
      } else {
        return null
      }
    } catch (error) {
      console.log('error on getDBEntry', error)
      return null
    }
  }

  const updateDBEntry = async (userId, value) => {
    try {
      await update(ref(fbDatabase, 'users/' + userId), value);
    } catch (error) {
      console.log('error on updateDBEntry', error)
    }
  }

  return (
    <FirebaseContext.Provider value={{
      user,
      setUser,
      userData,
      loading,
      error,
      registerUser,
      login,
      logout,
      loginWithGoogle,
      updateDBEntry,
      getDBEntry,
    }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  return useContext(FirebaseContext);
}

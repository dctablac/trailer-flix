import React, { useEffect, useState } from 'react';
import { 
    auth 
} from '../firebase.js';
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';

export const AuthContext = React.createContext();

// Wrap context provider with custom hook
export function useAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    // Get functions associated with auth
    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }
    function logIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }
    function logOut() {
        return signOut(auth);
    }

    useEffect(() => {
        // Upon app load, global auth observer is instantiated
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });

        // Upon app exit, observer is destructed thanks to useEffect
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signUp, 
        logIn, 
        logOut
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
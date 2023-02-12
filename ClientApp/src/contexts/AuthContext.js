import React, { useEffect, useState } from 'react';
import { 
    auth 
} from '../firebase.js';
import { 
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    signOut,
    updateEmail,
    updatePassword
} from 'firebase/auth';

export const AuthContext = React.createContext();

// Wrap context provider with custom hook
export function useAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(localStorage.getItem('user')); // To prevent null value on page refresh
    // Get functions associated with auth
    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }
    function logIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }
    function logOut() {
        localStorage.removeItem('user');
        return signOut(auth);
    }
    function reauthenticate(user, userCredential) {
        return reauthenticateWithCredential(user, userCredential);
    }
    function resetPassword(user, password) {
        return updatePassword(user, password);
    }
    function changeEmail(user, newEmail) {
        return updateEmail(user, newEmail);
    }
    // Credential object caller
    // eg. credential(currentUser.email, password)
    const credential = EmailAuthProvider.credential;

    useEffect(() => {
        // Upon app load, global auth observer is instantiated
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                localStorage.setItem('user', user);
            }
            setCurrentUser(user);
        });

        // Upon app exit, observer is destructed thanks to useEffect
        return unsubscribe;
    }, []);

    const value = {
        auth,
        currentUser,
        signUp, 
        logIn, 
        logOut,
        reauthenticate,
        credential,
        resetPassword,
        changeEmail
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
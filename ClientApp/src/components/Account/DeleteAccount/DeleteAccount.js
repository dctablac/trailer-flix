import React, { useState } from 'react';
import { Form, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { API_URL, ROUTE } from '../../../text';
import { authErrorMessages } from '../../../firebase';

export default function DeleteAccount() {
    const navigate = useNavigate();
    const [{ setLoading }] = useOutletContext();
    const { currentUser, reauthenticate, credential, deleteAccount } = useAuth();
    
    const [errorMsg, setErrorMsg] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disabledBtn, setDisabledBtn] = useState(true);

    async function handleSubmit(e) {
        e.preventDefault();
        if (password === '') {
            return setErrorMsg('Please enter your password.');
        }
        if (email === '') {
            return setErrorMsg('Please enter your email.');
        }
        
        try {
            setLoading(true);
            // Reauthenticate
            const userCredential = credential(email, password);
            try {
                await reauthenticate(currentUser, userCredential);
            } catch(err) {
                setLoading(false);
                return setErrorMsg('Password is incorrect.');
            }
            // Delete favorites
            await fetch(`${API_URL.FAVORITES}/${currentUser.uid}`, {
                method: 'DELETE'
            });
            // Delete account
            await deleteAccount(currentUser);
            // Return to register
            navigate(ROUTE.REGISTER);
            setLoading(false);
        } catch(err) {
            setErrorMsg(authErrorMessages[err.code] || 'Error deleting account.');
            setLoading(false);
        }
    }

    function handleChange(e, field) {
        if (errorMsg !== '') {
            setErrorMsg('');
        }
        switch (field) {
            case 'email':
                setEmail(e.target.value);
                if (e.target.value === currentUser.email) {
                    setDisabledBtn(false);
                } else {
                    setDisabledBtn(true);
                }
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            default:
                break;
        }
    }

    return (
        <main id="delete-account">
            <section className="account-page">
                <Form className="account-page-form" onSubmit={handleSubmit}>
                    <h1 className="account-page-title">Delete Account</h1>
                    <p className="account-page-form-msg critical">WARNING: This action cannot be undone.</p>
                    {
                        errorMsg !== '' &&
                        <p className="account-page-form-msg error">{errorMsg}</p>
                    }
                    <div className="account-page-form-row">
                        <label className="account-page-form-label">Email</label>
                        <input type="email" 
                            className="account-page-form-input" 
                            value={email}
                            onChange={(e) => handleChange(e,'email')}
                        />
                    </div>
                    <div className="account-page-form-row">
                        <label className="account-page-form-label">Password</label>
                        <input type="password" 
                            className="account-page-form-input" 
                            value={password}
                            onChange={(e) => handleChange(e,'password')}
                        />
                    </div>
                    <button type="submit" className="btn-account-page-submit" disabled={disabledBtn}>
                        Delete
                    </button>
                </Form>
            </section>
        </main>
    );
}

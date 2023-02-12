import React, { useState } from "react";
import { Form, useOutletContext } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import './ChangeEmail.css';

export default function ChangeEmail() {
    const [{ setLoading }] = useOutletContext();
    const { currentUser, changeEmail, reauthenticate, credential } = useAuth();

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        // Change user email
        try {
            if (email === '') {
                return setErrorMsg('New email cannot be blank.');
            }
            if (password === '') {
                return setErrorMsg('Please enter your password.');
            }
            if (email === currentUser.email) {
                return setErrorMsg('New email cannot be the same as your current one.');
            }
            // Reauthenticate user 
            const userCredential = credential(currentUser.email, password);
            try {
                setLoading(true);
                await reauthenticate(currentUser, userCredential);
                setLoading(false);
            } catch(err) {
                setLoading(false);
                return setErrorMsg('Password is incorrect.');
            }
            // Try to change email
            setLoading(true);
            await changeEmail(currentUser, email);
            setEmail('');
            setPassword('');
            setSuccessMsg('Email updated successfully.');
        } catch(err) {
            console.error(err);
            setErrorMsg('Error updating email.');
        }
        setLoading(false);
    }

    function handleChange(e, field) {
        if (errorMsg) {
            setErrorMsg('');
        } else if (successMsg) {
            setSuccessMsg('');
        }
        switch (field) {
            case "email":
                setEmail(e.target.value);
                break;
            case "password":
                setPassword(e.target.value);
                break;
            default:
                break;
        }
    }

    return (
        <section className="change-email">
            <Form className="change-email-form" onSubmit={handleSubmit}>
                <h1 className="change-email-title">Change Email</h1>
                {
                    errorMsg !== "" &&
                    <p className="change-email-form-msg error">{errorMsg}</p>
                }
                {
                    successMsg !== "" &&
                    <p className="change-email-form-msg success">{successMsg}</p>
                }
                <div className="change-email-form-row">
                    <label className="change-email-label" htmlFor="new-email">New Email</label>
                    <input className="change-email-input" 
                        type="email" 
                        id="new-email"
                        value={email} 
                        onChange={(e) => handleChange(e, "email")}
                    />
                </div>
                <div className="change-email-form-row">
                    <label className="change-email-label" htmlFor="password">Password</label>
                    <input className="change-email-input"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => handleChange(e, "password")}
                    />
                </div>
                <button className="change-email-form-btn" type="submit">
                    Submit
                </button>  
            </Form>
        </section>
    );
}
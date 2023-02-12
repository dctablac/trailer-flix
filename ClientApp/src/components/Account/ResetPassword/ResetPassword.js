import React, { useState } from "react";
import { Form, useOutletContext } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { authErrorMessages } from "../../../firebase";
import './ResetPassword.css';

export default function ResetPassword() {
    const [{ setLoading }] = useOutletContext();
    const { currentUser, reauthenticate, credential, resetPassword } = useAuth();

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (oldPassword === '') {
                return setErrorMsg('Please enter your old password.');
            }
            if (newPassword !== newPasswordConfirm || newPassword === '' || newPasswordConfirm === '') {
                return setErrorMsg('New password confirmation does not match.');
            }
            // Reauthenticate
            const userCredential = credential(currentUser.email, oldPassword);
            try {
                await reauthenticate(currentUser, userCredential);
            } catch(err) {
                return setErrorMsg('Password is incorrect.');
            }
            if (oldPassword === newPassword) {
                return setErrorMsg('New password cannot be the same as your old one.');
            }
            // Change to new password
            setLoading(true);
            await resetPassword(currentUser, newPassword);
            setOldPassword('');
            setNewPassword('');
            setNewPasswordConfirm('');
            setSuccessMsg('Password was changed successfully.');
        } catch(err) {
            setErrorMsg(authErrorMessages[err.code] || 'Error updating password.');
        }
        setLoading(false);
    }

    function handleChange(e, field) {
        if (errorMsg) {
            setErrorMsg('');
        }
        if (successMsg) {
            setSuccessMsg('');
        }
        switch (field) {
            case "oldPassword":
                setOldPassword(e.target.value);
                break;
            case "newPassword":
                setNewPassword(e.target.value);
                break;
            case "newPasswordConfirm":
                setNewPasswordConfirm(e.target.value);
                break;
            default:
                break;
        }
    }

    return (
        <section className="reset-password">
            <Form className="reset-password-form" onSubmit={handleSubmit}>
                <h1 className="account-page-title">Password Reset</h1>
                {
                    errorMsg !== "" &&
                    <p className="reset-password-form-msg error">{errorMsg}</p>
                }
                {
                    successMsg !== "" &&
                    <p className="reset-password-form-msg success">{successMsg}</p>
                }
                <div className="reset-password-form-row">
                    <label className="reset-password-label">Current Password</label>
                    <input 
                    className="reset-password-input" 
                    type="password"
                    name="old-password"
                    value={oldPassword}
                    onChange={(e) => handleChange(e, "oldPassword")}
                    />
                </div>
                <div className="reset-password-form-row">    
                    <label className="reset-password-label">New Password</label>
                    <input 
                    className="reset-password-input" 
                    type="password"
                    name="new-password"
                    value={newPassword}
                    onChange={(e) => handleChange(e, "newPassword")}
                    />
                </div>
                <div className="reset-password-form-row">
                    <label className="reset-password-label">Confirm New Password</label>
                    <input 
                    className="reset-password-input" 
                    type="password"
                    name="new-password-confirm"
                    value={newPasswordConfirm}
                    onChange={(e) => handleChange(e, "newPasswordConfirm")}
                    />
                </div>
                <button className="reset-password-form-btn" type="submit">
                    Reset
                </button>  
            </Form>
        </section>
    )
}
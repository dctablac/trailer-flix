import React, { useState } from "react";
import { useFetcher, useOutletContext } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import './ResetPassword.css';

export default function ResetPassword() {
    const [{ setLoading }] = useOutletContext();
    const { currentUser, reauthenticate, credential, resetPassword } = useAuth();
    const fetcher = useFetcher();

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            if (oldPassword === '') {
                setErrorMsg('Please enter your old password.');
                throw new Error('Please enter your old password.');
            }
            if (newPassword !== newPasswordConfirm || newPassword === '' || newPasswordConfirm === '') {
                setErrorMsg('New password confirmation does not match.');
                throw new Error('New password confirmation does not match.');
            }
            // Reauthenticate
            const userCredential = credential(currentUser.email, oldPassword);
            await reauthenticate(currentUser, userCredential);
            if (oldPassword === newPassword) {
                setErrorMsg('New password cannot be the same as your old one.');
                throw new Error('New password cannot be the same as your old one.');
            }
            // Change to new password
            await resetPassword(currentUser, newPassword);
            setOldPassword("");
            setNewPassword("");
            setNewPasswordConfirm("");
            setSuccessMsg('Password was changed successfully.');
        } catch(err) {
            console.error(err);
            console.error(err.message);
            // setErrorMsg(authErrorMessages[err.message] || err.message);
        }
        setLoading(false);
    }

    function handleChange(e, field) {
        if (errorMsg) {
            setErrorMsg("");
        }
        if (successMsg) {
            setSuccessMsg("");
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
            <fetcher.Form className="reset-password-form" onSubmit={handleSubmit}>
                <h1 className="reset-password-title">Password Reset</h1>
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
            </fetcher.Form>
        </section>
    )
}
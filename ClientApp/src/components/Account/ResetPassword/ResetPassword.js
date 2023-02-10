import React from "react";
import './ResetPassword.css';

export default function ResetPassword() {
    return (
        <section className="reset-password">
            <h1>Reset Your Password</h1>
            <Form>
                <label>Old Password</label>
                <input type="password"/>
                <label>New Password</label>
                <input type="password"/>
                <label>Confirm New Password</label>
                <input type="password"/>
            </Form>
        </section>
    )
}
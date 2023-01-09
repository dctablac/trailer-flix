import React from 'react';
import {
    Link
} from 'react-router-dom';
import './Register.css';

export default function Register() {
    return (
        <div id="register">
            <form className="register-form">
                <h2 className="register-title">Sign Up</h2>
                <input className="register-input" type="email" placeholder="Email"/>
                <input className="register-input" type="password" placeholder="Password"/>
                <button className="register-btn">Sign Up</button>
                <Link className="login-link" to="/login">Sign in</Link>
            </form>
        </div>
    )
}
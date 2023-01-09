import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
    return (
        <div id="login">
            <form className="login-form">
                <h2 className="login-title">Sign In</h2>
                <input className="login-input" type="email" placeholder="Email"/>
                <input className="login-input" type="password" placeholder="Password"/>
                <button className="login-btn">Sign In</button>
                <Link className="register-link" to="/">Sign up</Link>
            </form>
        </div>
    )
}
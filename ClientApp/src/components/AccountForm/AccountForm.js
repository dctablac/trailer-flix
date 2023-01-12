import React from "react";
import {
    Form,
    Link
} from 'react-router-dom';
import './AccountForm.css';

export default function AccountForm(props) {
    const { formType } = props;

    // Changes action text on label depending on register/login
    function formActionText() {
        return formType === 'Register' ? 'Sign Up' : 'Sign In';
    }
    // Changes action link text opposite of what the form is
    function formAltActionText() {
        return formType === 'Register' ? 'Sign In' : 'Sign Up';
    }
    // Changes action link navigation opposite of what the form is
    function formAltActionLink() {
        return formType === 'Register' ? '/login' : '/';
    }

    return (
        <div id={formType}>
            <Form className="account-form">
                <h2 className="account-form-title">{formActionText()}</h2>
                <input className="account-form-input" type="email" placeholder="Email"/>
                <input className="account-form-input" type="password" placeholder="Password"/>
                <button className="account-form-btn">{formActionText()}</button>
                <Link className="account-form-link" to={formAltActionLink()}>{formAltActionText()}</Link>
            </Form>
        </div>
    )
}
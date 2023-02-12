import React, {
    useEffect,
    useState
} from "react";
import {
    Form,
    Link,
    Outlet,
    useNavigate,
    useOutletContext
} from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { authErrorMessages } from "../../firebase.js";
import { FORM_TYPE, FORM_TEXT, ROUTE, FORM_MSG } from "../../text";
import './AuthForm.css';

export default function AuthForm(props) {
    const { formType } = props;
    const [{ setLoading, setRegisterOrLoginShowing }] = useOutletContext();
    const { signUp, logIn } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [mismatch, setMismatch] = useState(false);

    useEffect(() => {
        setRegisterOrLoginShowing(true);
        
        return () => {
            setRegisterOrLoginShowing(false);
        }
        // eslint-disable-next-line
    }, []);

    // Changes action text on label depending on register/login
    function formActionText() {
        return formType === FORM_TYPE.REGISTER ? FORM_TEXT.SIGNUP : FORM_TEXT.SIGNIN;
    }
    // Changes action link text opposite of what the form is
    function formAltActionText() {
        return formType === FORM_TYPE.REGISTER ? FORM_TEXT.SIGNIN : FORM_TEXT.SIGNUP;
    }
    // Changes navigation opposite of what the form is
    function formAltActionLink() {
        return formType === FORM_TYPE.REGISTER ? ROUTE.LOGIN : ROUTE.REGISTER;
    }

    // onSubmit changes depending if register/login
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMismatch(false);
        setErrorMsg(null);
        try {
            // If email and password are given
            if (email !== '' && password !== '') {
                // If this is the register form
                if (formType === FORM_TYPE.REGISTER) {
                    // If user has not confirmed password
                    if (confirmPassword === '') { 
                        setErrorMsg(FORM_MSG.NO_PASS_CONFIRM);
                        setLoading(false);
                    // If user did not correctly confirm password
                    } else if (password !== confirmPassword) {
                        setMismatch(true);
                        setErrorMsg(FORM_MSG.PASS_MISMATCH);
                        setLoading(false);
                    // Email, password, and password confirmed correctly
                    } else {    
                        await signUp(email, password);
                        setRegisterOrLoginShowing(false);
                        navigate(ROUTE.BROWSE);
                    } 
                // If this is the login form
                } else if (formType === FORM_TYPE.LOGIN) { // Errors caught in catch
                    await logIn(email, password);
                    setRegisterOrLoginShowing(false);
                    navigate(ROUTE.BROWSE);
                }
            // If email or password is missing    
            } else {
                setErrorMsg(FORM_MSG.NO_EMAIL_PASS);
                setLoading(false);
            }
        // Catch invalid emails, passwords, or already in use, or server error
        } catch(err) {
            setErrorMsg(authErrorMessages[err.code]);
            setLoading(false);
        }
    }

    function handleChange(value, inputId) {
        setErrorMsg(null);
        setMismatch(false);
        switch (inputId) {
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "confirm-password":
                setConfirmPassword(value);
                break;
            default:
                break;
        }
    }

    return (
        <main>
            <section id={formType} className="auth-page">
                <Outlet />
                <Form className="auth-form" onSubmit={handleSubmit}>
                    <h1 className="logo auth-form-logo">TRAILERFLIX</h1>
                    <h2 className="auth-form-title">{formActionText()}</h2>
                    {
                        errorMsg && 
                        <p className="auth-form-error">{errorMsg}</p>
                    }
                    <label htmlFor="email" className="auth-form-label">Email</label>
                    <input 
                        id="email" 
                        className={`auth-form-input ${errorMsg && email === '' && "auth-form-input-error"}`}
                        type="email" 
                        onChange={(e) => handleChange(e.target.value, "email")}
                        value={email}
                    />
                    <label htmlFor="password" className="auth-form-label">Password</label>
                    <input 
                        id="password" 
                        className={`auth-form-input ${errorMsg && password === '' ? "auth-form-input-error" : mismatch && "mismatch"}`} // 
                        type="password" 
                        onChange={(e) => handleChange(e.target.value, "password")}
                        value={password}
                    />
                    { // Show Confirm Password field in Sign Up
                        formType === FORM_TYPE.REGISTER &&
                        <>
                        <label htmlFor="confirm-password" className="auth-form-label">Confirm password</label>
                        <input
                            id="confirm-password"
                            className={`auth-form-input ${errorMsg && confirmPassword === '' ? "auth-form-input-error" : mismatch && "mismatch"}`}
                            type="password"
                            onChange={(e) => handleChange(e.target.value, "confirm-password")}
                            value={confirmPassword}
                        />
                        </>
                    }
                    <button className="auth-form-btn">{formActionText()}</button>
                    <Link className="auth-form-link" to={formAltActionLink()}>{formAltActionText()}</Link>
                </Form>
            </section>
        </main>
    )
}
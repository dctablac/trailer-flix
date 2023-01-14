import React, {
    useEffect,
    useState
} from "react";
import {
    Form,
    Link,
    useNavigate
} from 'react-router-dom';
import './AccountForm.css';
import { useAuth } from "../../contexts/AuthContext";
import { authErrorMessages } from "../../firebase.js";

export default function AccountForm(props) {
    const { currentUser, signUp, logIn } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (currentUser) {
            navigate('/browse');
        }
        // eslint-disable-next-line
    }, [currentUser]);
    const { formType } = props;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Changes action text on label depending on register/login
    function formActionText() {
        return formType === 'register' ? 'Sign Up' : 'Sign In';
    }
    // Changes action link text opposite of what the form is
    function formAltActionText() {
        return formType === 'register' ? 'Sign In' : 'Sign Up';
    }
    // Changes navigation opposite of what the form is
    function formAltActionLink() {
        return formType === 'register' ? '/login' : '/';
    }

    // onSubmit changes depending if register/login
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (email !== '' && password !== '') {
                if (formType === 'register' && password === confirmPassword) {
                    await signUp(email, password);
                    alert('User registered successfully');
                    navigate('/login');
                } else if (formType === 'login') {
                    await logIn(email, password);
                    alert('User logged in successfully');
                    navigate('/browse');
                }
            } else {
                alert('Please enter an email and password.');
            }
        } catch(err) {
            console.error(err.code);
            alert(authErrorMessages[err.code]);
        }
    }

    return (
        <div id={formType}>
            <Form className="account-form" onSubmit={handleSubmit}>
                <h2 className="account-form-title">{formActionText()}</h2>
                <input 
                id="email" 
                className="account-form-input" 
                type="email" 
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                />
                <input 
                id="password" 
                className="account-form-input" 
                type="password" 
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                />
                {
                    formType === 'register' &&
                    <input
                    id="confirm-password"
                    className="account-form-input"
                    type="password"
                    placeholder="Confirm password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    />
                }
                <button className="account-form-btn">{formActionText()}</button>
                <Link className="account-form-link" to={formAltActionLink()}>{formAltActionText()}</Link>
            </Form>
        </div>
    )
}
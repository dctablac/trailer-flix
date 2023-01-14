import React, {
    useEffect,
    useState
} from "react";
import {
    Form,
    Link,
    useNavigate
} from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { authErrorMessages } from "../../firebase.js";
import { FORM_TYPE, FORM_TEXT, ROUTE } from "../../text";
import './AccountForm.css';

export default function AccountForm(props) {
    const { formType } = props;
    const navigate = useNavigate();
    const { currentUser, signUp, logIn } = useAuth();
    useEffect(() => {
        if (currentUser) {
            navigate(ROUTE.BROWSE);
        }
        // eslint-disable-next-line
    }, [currentUser]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
        try {
            if (email !== '' && password !== '') {
                if (formType === FORM_TYPE.REGISTER && password === confirmPassword) {
                    await signUp(email, password);
                    alert('User registered successfully');
                    navigate(ROUTE.BROWSE);
                } else if (formType === FORM_TYPE.LOGIN) {
                    await logIn(email, password);
                    alert('User logged in successfully');
                    navigate(ROUTE.BROWSE);
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
                <label for="email" className="account-form-label">Email</label>
                <input 
                id="email" 
                className="account-form-input" 
                type="email" 
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                />
                <label for="password" className="account-form-label">Password</label>
                <input 
                id="password" 
                className="account-form-input" 
                type="password" 
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                />
                {
                    formType === 'register' &&
                    <>
                    <label for="confirm-password" className="account-form-label">Confirm password</label>
                    <input
                    id="confirm-password"
                    className="account-form-input"
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    />
                    </>
                }
                <button className="account-form-btn">{formActionText()}</button>
                <Link className="account-form-link" to={formAltActionLink()}>{formAltActionText()}</Link>
            </Form>
        </div>
    )
}
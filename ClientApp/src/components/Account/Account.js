import React from "react";
import { 
    useNavigate, 
    useOutletContext,
    Link, 
    Form
} from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTE } from "../../text";
import './Account.css';

export default function Account() {
    const [{ setRegisterOrLoginShowing }] = useOutletContext();
    const { currentUser, logOut } = useAuth();
    const navigate = useNavigate();
    
    // Handle log out of user
    async function handleLogOut(e) {
        e.preventDefault();
        try {
            await logOut();
            setRegisterOrLoginShowing(true);
            navigate(ROUTE.REGISTER);
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <main id="account">
            <section className="account-page account-details">
                <h1>Account</h1>
                <div className="account-detail">
                    <p>{currentUser.email}</p>
                    <Link className="reset-link" to="change-email">Change email</Link>
                </div>
                <div className="account-detail">
                    <p>Password: ********</p>
                    <Link className="reset-link" to="reset-password">Reset password</Link>
                </div>
                <div className="account-detail">
                    <Form onSubmit={handleLogOut}>
                        <button type="submit" className="btn-account-page">
                            Sign Out
                        </button>
                        <Link className="link-delete-account" to="delete-account">
                            <button className="btn-account-page">
                                Delete Account
                            </button>
                        </Link>
                    </Form>
                </div>
            </section>
        </main>
    )
}
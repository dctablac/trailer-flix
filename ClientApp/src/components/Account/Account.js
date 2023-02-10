import React from "react";
import { 
    useNavigate, 
    useOutletContext,
    Link, 
    useFetcher
} from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTE } from "../../text";
import Loader from "../Loader";
import './Account.css';

export default function Account() {
    const [{ loading, setRegisterOrLoginShowing }] = useOutletContext();
    const { logOut } = useAuth();
    const navigate = useNavigate();
    const fetcher = useFetcher();
    
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
        <>
        {
            !loading &&
            <main id="account">
                <section className="account-details-container">
                    <h1>Account</h1>
                    <article className="account-detail">
                        <p>test@test.com</p>
                        <Link className="reset-link" to="/account">Change account email</Link>
                    </article>
                    <article className="account-detail">
                        <p>Password: ********</p>
                        <Link className="reset-link" to="/account">Change password</Link>
                    </article>
                    <article className="account-detail">
                        <fetcher.Form onSubmit={handleLogOut}>
                            <button type="submit" className="btn btn-log-out">
                                Sign Out
                            </button>
                        </fetcher.Form>
                    </article>
                </section>
            </main>
        }
        {
            loading && <Loader />
        }
        </>
    )
}
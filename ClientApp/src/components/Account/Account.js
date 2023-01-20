import React from "react";
import { 
    useNavigate, 
    useOutletContext,
    Link 
} from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTE } from "../../text";
import Loader from "../Loader";
import './Account.css';

export default function Account() {
    const [{ loading }] = useOutletContext();
    const { logOut } = useAuth();
    const navigate = useNavigate();
    
    // Handle log out of user
    async function handleLogOut() {
        try {
            await logOut();
            navigate(ROUTE.REGISTER);
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <>
        {
            !loading &&
            <div id="account">
                <div className="account-details-container">
                    <h1>Account</h1>
                    {/* <h2>Account Details</h2> */}
                    <div className="account-detail">
                        <p>test@test.com</p>
                        <Link className="reset-link" to="/account">Change account email</Link>
                    </div>
                    <div className="account-detail">
                        <p>Password: ********</p>
                        <Link className="reset-link" to="/account">Change password</Link>
                    </div>
                    <div className="account-detail">
                        <button className="btn btn-log-out" onClick={handleLogOut}>Sign Out</button>
                    </div>
                </div>
            </div>
        }
        {
            loading && <Loader />
        }
        </>
    )
}
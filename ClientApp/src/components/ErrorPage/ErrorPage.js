import React from 'react';
import { 
    useNavigate, 
    useRouteError 
} from 'react-router-dom';
import './ErrorPage.css';

export default function ErrorPage() {
    const navigate = useNavigate();
    const error = useRouteError();
    console.error(error);

    return (
        <div id="error-page" className="error-page">
            <div className="error-page-content">
                <h1 id="logo" onClick={() => navigate('/browse')}>TRAILERFLIX</h1>
                <h2>Oops!</h2>
                <p>Sorry, an unexpected error has occurred.</p>
                <p>
                    <i>{`${error.status} ${error.statusText || error.message}: ${error.data.split(': ')[1]}`}</i>
                </p>
            </div>
        </div>
    );
}
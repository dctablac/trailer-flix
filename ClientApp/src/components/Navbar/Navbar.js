import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { 
    Form,
    Link,
    useNavigate,
} from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTE } from '../../text';

export default function Navbar(props) {
    const { 
        getSearchResults,
        handleSearchChange,
        searchScrolled, 
        setSearchScrolled,
        query 
    } = props;
    // To navigate upon logo click
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // Change navbar color on scroll
    function changeBackgroundColor() {
        if (window.scrollY > 0) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    }

    // If scrolled past search bar in home backdrop, place search bar in navbar
    function placeNavSearchBar() {
        if (window.scrollY >= 330) {
            setSearchScrolled(true);
        } else {
            setSearchScrolled(false);
        }
    }

    const [scrolled, setScrolled] = useState('');
    useEffect(() => {
        // Event listeners for scroll effects
        window.addEventListener('scroll', changeBackgroundColor);
        window.addEventListener('scroll', placeNavSearchBar);
        return () => {
            window.removeEventListener('scroll', changeBackgroundColor);
            window.removeEventListener('scroll', placeNavSearchBar);
        }
        // eslint-disable-next-line
    }, []);

    function navToHome() {
        navigate(ROUTE.BROWSE);
    }
    
    return (
    <nav id="navbar" className={scrolled ? "navbar scrolled" : "navbar"}>
        <h1 id="logo" className={searchScrolled && "logo"} onClick={navToHome}>TRAILERFLIX</h1>
        {
            // Navbar is scrolled past search bar
            searchScrolled && 
            <Form 
                className="search-bar-nav-form"
                action="/browse" 
                onSubmit={getSearchResults}>
                <input
                    id="q" 
                    className="search-bar search-bar-nav" 
                    onChange={handleSearchChange}
                    placeholder="Search titles or genres"
                    type="search"
                    value={query}/>
            </Form>
        }
        {
            // If logged in
            currentUser && 
            <Link className="account-settings-icon" to={ROUTE.ACCOUNT}>
                <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="white" className="bi bi-person-gear" viewBox="0 0 16 16">
                    <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382l.045-.148ZM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"/>
                </svg>
            </Link>
        }
    </nav>  
    )
}
import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { 
    Link,
    useNavigate,
} from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTE } from '../../text';
import PersonGear from '../SVG/PersonGear';
import Search from '../Search';

export default function Navbar(props) {
    const { 
        getSearchResults,
        handleSearchChange,
        searchScrolled, 
        setSearchScrolled,
        query 
    } = props;
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
    
    return (
        <header>
            <nav className={scrolled ? "navbar scrolled" : "navbar"}>
                <h1 className="logo" onClick={() => navigate(ROUTE.BROWSE)}>
                    TRAILERFLIX
                </h1>
                {
                    // Navbar is scrolled past search bar
                    searchScrolled && 
                    <Search 
                        getSearchResults={getSearchResults}
                        handleSearchChange={handleSearchChange}
                        query={query}
                        searchScrolled={searchScrolled} 
                    />
                }
                {
                    // If logged in
                    currentUser && 
                    <Link className="account-settings-icon" to={ROUTE.ACCOUNT}>
                        <PersonGear />
                    </Link>
                }
            </nav> 
        </header>
    )
}
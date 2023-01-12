import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { 
    Form, 
    useNavigate,
} from 'react-router-dom';

export default function Navbar(props) {
    // To navigate upon logo click
    const navigate = useNavigate();

    function changeBackgroundColor() {
        // Change navbar color on scroll
        if (window.scrollY > 0) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    }

    function placeNavSearchBar() {
        // If scrolled past search bar in home backdrop, place in nav
        if (window.scrollY >= 330) {
            props.setSearchScrolled(true);
        } else {
            props.setSearchScrolled(false);
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
    <nav id="navbar" className={scrolled ? "navbar scrolled" : "navbar"}>
        <h1 id="logo" onClick={() => navigate('/browse')}>TRAILERFLIX</h1>
        {props.searchScrolled && 
            <Form 
                className="search-bar-nav-form"
                action="/browse" 
                onSubmit={props.getSearchResults}>
                <input
                    id="q" 
                    className="search-bar search-bar-nav" 
                    onChange={({target}) => props.setQuery(target.value)}
                    placeholder="Search titles or genres"
                    type="search"
                    value={props.query}/>
            </Form>
        }
    </nav>  
    )
}
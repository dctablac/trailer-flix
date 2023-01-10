import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    
    return (
    <nav id="navbar">
        <h1 id="logo" 
        onClick={() => navigate('/browse')}>
            TRAILERFLIX
        </h1>
    </nav>  
    )
}
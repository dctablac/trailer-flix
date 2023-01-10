import React from "react";
import './Details.css';

export default function Details() {
    return (
        <div id="details">
            <div className="trailer-container">
                <iframe className="trailer" width="1080" height="607.5" 
                src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1" 
                title="YouTube video player" frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; 
                encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen></iframe>
            </div>
        </div>
    )
}
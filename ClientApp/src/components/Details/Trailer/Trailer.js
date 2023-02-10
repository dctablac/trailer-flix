import React from "react";

export default function Trailer(props) {
    return (
        <div className="trailer-container">
            <iframe id="player" className="trailer" width="1080" height="607.5" 
            src={`https://www.youtube.com/embed/${props.youtubeId}`} 
            title="YouTube video player" frameBorder="0" 
            allow="accelerometer; clipboard-write; encrypted-media; 
            gyroscope; picture-in-picture; web-share" 
            allowFullScreen></iframe>
        </div>
    );
}
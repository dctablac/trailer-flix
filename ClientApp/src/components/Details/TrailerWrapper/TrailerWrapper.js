import React from "react";
import { Link } from "react-router-dom";
import { ROUTE } from "../../../text";
import FavoriteBtn from "../FavoriteBtn";
import Trailer from "../Trailer/Trailer";

export default function TrailerWrapper(props) {
    const {
        backgroundImg,
        currentUser,
        info,
        isFavorite,
        youtubeId
    } = props;
    
    return (
        <section className="trailer-wrapper">
            {
                backgroundImg &&
                <img 
                    className="trailer-backdrop" 
                    src={backgroundImg}
                    alt={info.title}
                />
            }
            <div className="trailer-backdrop-screen"></div>
            <div className="browse-return-container">
                <Link to={ROUTE.BROWSE} className="browse-return">{'< '}Back to Browse</Link>
            </div>
            <h1 className="details-title">
                {info.original_title}
                <FavoriteBtn currentUser={currentUser} isFavorite={isFavorite}/>
            </h1>
            <Trailer youtubeId={youtubeId}/>
        </section>
    );
}
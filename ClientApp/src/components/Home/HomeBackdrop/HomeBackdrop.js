import React from "react";
import { TMDB } from "../../../text";
import Search from "../../Search";

export default function HomeBackdrop(props) {
    
    const {
        backdropIndex,
        popularMovies,
        query,
        handleSearchChange,
        getSearchResults,
        searchScrolled
    } = props;

    return (
        <section className="home-backdrop">
            <h2 className="home-backdrop-title">{popularMovies[backdropIndex].title}</h2>
            <div className="home-backdrop-img-screen"></div>
            <img
                key={backdropIndex}
                className="home-backdrop-img" 
                src={`${TMDB.IMG_URL}${TMDB.IMG_SIZE.BACKDROP}${popularMovies[backdropIndex].backdrop_path}`} 
                alt={popularMovies[backdropIndex].title}
            />
            {
                !searchScrolled &&
                <Search 
                    getSearchResults={getSearchResults}
                    handleSearchChange={handleSearchChange}
                    query={query} 
                />
            }
        </section>
    );
}
import React from "react";
import Carousel from "../../Carousel";

export default function HomeResults(props) {
    const {
        formatMovies,
        prevQuery,
        searchResults,
        nowPlaying,
        popular,
        upcoming,
        favorites
    } = props;

    return (
        <section className="home-results">
            {
                // 
                !searchResults && favorites != null && favorites.length > 0 &&
                <>
                    <h2 className="section-title">Favorites</h2>
                    <Carousel carouselId="favorite-movies" items={favorites} />
                </>
            }
            {
                // Initial page load, no search requests made or empty search bar
                !searchResults && 
                <>
                    <h2 className="section-title">Upcoming</h2>
                    <Carousel carouselId="upcoming-movies" items={upcoming} />
                    <h2 className="section-title">Now Playing</h2>
                    <Carousel carouselId="now-playing-movie" items={nowPlaying} />
                    <h2 className="section-title">Popular</h2>
                    <Carousel carouselId="popular-movies" items={popular} />
                </>
            }
            {
                // Search request success but no results
                searchResults && searchResults.length === 0 &&
                <h2 className="section-title">No results for "{prevQuery}"</h2>
            }
            {
                // Search request success with movies to show
                searchResults && searchResults.length > 0 &&
                <>
                    <h2 className="section-title">Results for "{prevQuery}"</h2>
                    <div className="movie-results">
                        {
                            searchResults && 
                            formatMovies(searchResults)
                        }
                    </div>
                </>
            }
        </section>
    );
}
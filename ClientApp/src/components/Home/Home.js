import React, {
    useState,
    useEffect
} from "react";
import { 
    useNavigate, 
    useLoaderData,
    useOutletContext
 } from "react-router-dom";
import Search from '../Search';
import Carousel from "../Carousel";
import { API_URL, ROUTE, TMDB } from '../../text';
import { useAuth } from "../../contexts/AuthContext";
import './Home.css';


export async function loader() {
    try {
        const upcomingRes = await fetch(API_URL.UPCOMING);
        let upcomingMovies = await upcomingRes.json();
        upcomingMovies = upcomingMovies.results;

        const nowPlayingRes = await fetch(API_URL.NOW_PLAYING);
        let nowPlayingMovies = await nowPlayingRes.json();
        nowPlayingMovies = nowPlayingMovies.results;

        const popularRes = await fetch(API_URL.POPULAR);
        let popularMovies = await popularRes.json();
        popularMovies = popularMovies.results;

        return {
            upcomingMovies,
            nowPlayingMovies,
            popularMovies
        }
    } catch(err) {
        console.error(err);
        return null;
    }
}

export default function Home() {
    const navigate = useNavigate();
    const { currentUser }  = useAuth();

    const [{
        query, 
        handleSearchChange, 
        prevQuery, 
        searchResults,
        getSearchResults,
        setDetailsShowing,
        setLoading
    }] = useOutletContext();
    useEffect(() => {
        window.scroll(0,1);
        setDetailsShowing(false);
    // eslint-disable-next-line
    }, []);
    const { 
        nowPlayingMovies,
        popularMovies, 
        upcomingMovies
    } = useLoaderData();

    const nowPlaying = formatMovies(nowPlayingMovies);
    const popular = formatMovies(popularMovies);
    const upcoming = formatMovies(upcomingMovies);

    // Get user's favorite movies
    const [favorites, setFavorites] = useState(null);
    useEffect(() => {
        async function getUserFavorites() {
            const favoriteRes = await fetch(`${API_URL.FAVORITES}/${currentUser.uid}`);
            const favoriteMovies = await favoriteRes.json();
            const favoriteFormatted = formatMovies(favoriteMovies.results);
            setFavorites(favoriteFormatted);
        }

        if (currentUser.uid !== undefined) {
            getUserFavorites();
            setLoading(false);
        }
    // eslint-disable-next-line
    }, [currentUser]);


    // State for backdrop image slideshow
    const [backdropIndex, setBackdropIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            if (backdropIndex === popularMovies.length - 1) {
                setBackdropIndex(() => 0);
            } else {
                setBackdropIndex((prevBackdropIndex) => { return prevBackdropIndex + 1; });
            }
        }, 4000);

        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [backdropIndex]);

    // Navigate to movie details
    function goToMovieDetails(movieId) {
        setLoading(true);
        navigate(`${ROUTE.DETAILS}/${movieId}`);
    }

    // Movie poster format
    function formatMovies(movies) {
        return movies.map((movie, i) => {
            return (
                <div className="movie-poster-container" key={movie.id}>
                    {
                        movie.poster_path &&
                        <img
                            className="movie-poster" 
                            src={`${TMDB.IMG_URL}${TMDB.IMG_SIZE.POSTER}${movie.poster_path}`} 
                            alt={movie.title}
                            onClick={() => goToMovieDetails(movie.id)}
                        />
                    }
                    {
                        !movie.poster_path &&
                        <div className="movie-poster poster-fill"
                        onClick={() => goToMovieDetails(movie.id)}>
                            <p className="movie-poster-fill-title">{movie.title}</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="5rem" height="5rem" fill="grey" className="bi bi-film" viewBox="0 0 16 16">
                                <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z"/>
                            </svg>
                        </div>
                    }
                </div>
            );
        });
    }

    return (
        <div id="home">
            <div className="home-backdrop">
                <h2 className="home-backdrop-title">{popularMovies[backdropIndex].title}</h2>
                <div className="home-backdrop-img-screen"></div>
                <img
                    className="home-backdrop-img" 
                    src={`${TMDB.IMG_URL}${TMDB.IMG_SIZE.BACKDROP}${popularMovies[backdropIndex].backdrop_path}`} 
                    alt={popularMovies[backdropIndex].title}
                />
                <Search 
                    query={query} 
                    handleSearchChange={handleSearchChange}
                    getSearchResults={getSearchResults}
                />
            </div>
            
            <div className="home-results">
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
            </div>
        </div>
    )
}
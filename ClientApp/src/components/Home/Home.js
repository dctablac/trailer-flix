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
import { useAuth } from "../../contexts/AuthContext";
import { ROUTE } from '../../text';
import './Home.css';


export async function loader() {
    try {
        const upcomingRes = await fetch('https://localhost:7234/api/movies/upcoming');
        const upcomingMovies = await upcomingRes.json();
        const nowPlayingRes = await fetch('https://localhost:7234/api/movies/now_playing');
        const nowPlayingMovies = await nowPlayingRes.json();
        const popularRes = await fetch('https://localhost:7234/api/movies/popular');
        const popularMovies = await popularRes.json();
        return {
            upcomingMovies,
            nowPlayingMovies,
            popularMovies
        }
    } catch(err) {
        console.error(err);
    }
}

export default function Home() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [{
        query, 
        handleSearchChange, 
        prevQuery, 
        searchResults,
        getSearchResults,
        searchScrolled,
        setDetailsShowing,
        setLoading
    }] = useOutletContext();
    useEffect(() => {
        // Redirect if not logged in
        if (!currentUser) {
            navigate(ROUTE.REGISTER);
        }
        window.scroll(0,1);
        setDetailsShowing(false);
        setLoading(false);
    // eslint-disable-next-line
    }, [])
    const { 
        nowPlayingMovies,
        popularMovies, 
        upcomingMovies
    } = useLoaderData();

    const [backdropIndex, setBackdropIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            if (backdropIndex === popularMovies.results.length - 1) {
                setBackdropIndex(() => 0);
            } else {
                setBackdropIndex((prevBackdropIndex) => prevBackdropIndex + 1);
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

    // Popular movies
    function formatMovies(movies) {
        return movies.results.map((movie, i) => {
            return <img
            className="movie-poster" 
            key={movie.id}
            src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`} 
            alt={movie.title}
            onClick={() => goToMovieDetails(movie.id)}
            />
        });
    }

    return (
        <div id="home">
            <img
                id="home-backdrop"
                className="home-backdrop" 
                src={`https://image.tmdb.org/t/p/original${popularMovies.results[backdropIndex].backdrop_path}`} 
                alt={popularMovies.results[backdropIndex].title}
            />
            <Search 
                query={query} 
                handleSearchChange={handleSearchChange}
                getSearchResults={getSearchResults}
                searchScrolled={searchScrolled}
            />
            {
                // Initial page load, no search requests made or empty search bar
                !searchResults && 
                <>
                <h2 className="section-title">Upcoming</h2>
                <Carousel carouselId="upcoming-movies" items={formatMovies(upcomingMovies)} />
                <h2 className="section-title">Now Playing</h2>
                <Carousel carouselId="now-playing-movie" items={formatMovies(nowPlayingMovies)} />
                <h2 className="section-title">Popular</h2>
                <Carousel carouselId="popular-movies" items={formatMovies(popularMovies)} />
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
                            searchResults && searchResults.map((movie, i) => {
                                    return <div className="movie-poster-container" key={movie.id}>
                                        {
                                            movie.poster_path && 
                                            <img
                                            className="movie-poster" 
                                            src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`} 
                                            alt={movie.title}
                                            onClick={() => goToMovieDetails(movie.id)}
                                            />
                                        }
                                        {
                                            !movie.poster_path &&
                                            <div 
                                            className="movie-poster poster-fill"
                                            onClick={() => goToMovieDetails(movie.id)}>
                                                <p className="movie-poster-fill-title">{movie.title}</p>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="5rem" height="5rem" fill="grey" className="bi bi-film" viewBox="0 0 16 16">
                                                    <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z"/>
                                                </svg>
                                            </div>
                                        }
                                    </div>
                            })
                        }
                    </div>
                </>
            }
        </div>
    )
}
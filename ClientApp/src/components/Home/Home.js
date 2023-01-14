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
import './Home.css';
import { useAuth } from "../../contexts/AuthContext";


export async function loader() {
    try {
        const res = await fetch('https://localhost:7234/api/movies/popular');
        const data = await res.json();
        return data;
    } catch(err) {
        console.error(err);
    }
}

export default function Home() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        // Redirect if not logged in
        if (!currentUser) {
            navigate('/');
        }
        setDetailsShowing(false);
    // eslint-disable-next-line
    }, [])
    const popularMovies = useLoaderData();
    const [
        {
            query, 
            setQuery, 
            prevQuery, 
            searchResults,
            getSearchResults,
            searchScrolled,
            setDetailsShowing
        }
    ] = useOutletContext();

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
    function goToMovieDetails(movieId)
    {
        navigate(`/details/${movieId}`);
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
                setQuery={setQuery} 
                getSearchResults={getSearchResults}
                searchScrolled={searchScrolled}
            />
                {searchResults && 
                <>
                    <h2 className="section-title">Results for "{prevQuery}"</h2>
                    <div className="search-results">
                        {
                            searchResults && searchResults.map((movie, i) => {
                                    return <div className="movie-poster-container">
                                        {
                                            movie.poster_path && 
                                            <img
                                            key={i}
                                            className="movie-poster" 
                                            src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`} 
                                            alt={movie.title}
                                            onClick={() => goToMovieDetails(movie.id)}
                                            />
                                        }
                                        {
                                            !movie.poster_path &&
                                            <div 
                                            key={i}
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
            {(!searchResults || searchResults === '') && 
            <>
                <h2 className="section-title">Popular Movies</h2>
                <div className="popular-movies">
                    {popularMovies.results.map((movie, i) => {
                        return <img
                        className="movie-poster" 
                        key={i}
                        src={`https://image.tmdb.org/t/p/w185${movie['poster_path']}`} 
                        alt={movie['title']}
                        onClick={() => navigate(`/details/${movie['id']}`)}
                        />
                    })}
                </div>
            </>
            }
        </div>
    )
}
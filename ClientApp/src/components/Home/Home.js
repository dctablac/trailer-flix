import React, {
    useState,
    useEffect
} from "react";
import { 
    useNavigate, 
    useLoaderData,
    useOutletContext
 } from "react-router-dom";
import Search from "../Search";
import './Home.css';


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
    const popularMovies = useLoaderData();
    const navigate = useNavigate();
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

    useEffect(() => {
        setDetailsShowing(false);
    // eslint-disable-next-line
    }, [])

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
                        {searchResults && searchResults.map((movie, i) => {
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
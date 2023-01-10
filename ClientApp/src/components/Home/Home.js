import React, {
    useState
} from "react";
import { 
    useNavigate, 
    useLoaderData
 } from "react-router-dom";
import Search from "../Search";
import './Home.css';


export async function loader() {
    try {
        const res = await fetch('https://localhost:7234/api/movies/popular');
        const data = await res.json();
        return data;
    } catch {
        throw new Response("", {
            status: 404,
            statusText: 'Not Found'
        });
    }
}

export default function Home() {
    const popular = useLoaderData();
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [prevQuery, setPrevQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    async function getSearchResults() {
        setPrevQuery(query);
        if (query !== '') {
            const res = await fetch(`https://localhost:7234/api/movies/search?query=${query}`);
            const data = await res.json();
            setSearchResults(data.results);
        } else {
            setSearchResults(null);
        }
    }

    return (
        <div id="home">
            <Search query={query} setQuery={setQuery} getSearchResults={getSearchResults}/>
            {searchResults && <>
            <h2 className="section-title">Results for "{prevQuery}"</h2>
            <div className="popular-movies">
                {searchResults.map((movie, i) => {
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
            {(!searchResults || searchResults === '') && <>
            <h2 className="section-title">Popular Movies</h2>
            <div className="popular-movies">
                {popular.results.map((movie, i) => {
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
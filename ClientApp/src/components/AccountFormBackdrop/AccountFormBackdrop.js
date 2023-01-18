import React from "react";
import { useLoaderData } from "react-router-dom";
import './AccountFormBackdrop.css';

export async function loader() {
    const res = await fetch('https://localhost:7234/api/movies/popular');
    const data = await res.json();
    return data.results;
}

export default function AccountFormBackdrop() {
    const popularMovies = useLoaderData();

    function formatPopularMovies() {
        return popularMovies.map((movie, i) => {
            if (movie.poster_path) {
            return <img
                    className="account-form-backdrop-img"
                    src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                    alt={movie.title}
                    />
            }
            return <div className="poster-fill"></div>
        })
    }

    return (
        <div id="account-form-backdrop">
            {formatPopularMovies()}
        </div>
    )
}
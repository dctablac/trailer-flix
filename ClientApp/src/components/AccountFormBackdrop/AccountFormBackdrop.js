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
                        key={movie.id}
                        className="account-form-backdrop-img"
                        src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                        alt={movie.title}
                        />
            }
            return <div key={movie.id} className="poster-fill"></div>
        })
    }

    return (
        <div id="account-form-backdrop">
            <div className="account-form-backdrop-screen"></div>
            {formatPopularMovies()}
        </div>
    )
}
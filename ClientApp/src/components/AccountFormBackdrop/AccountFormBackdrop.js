import React from "react";
import { useLoaderData } from "react-router-dom";
import { API_URL, TMDB } from "../../text";
import './AccountFormBackdrop.css';

export async function loader() {
    const res = await fetch(API_URL.POPULAR);
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
                        src={`${TMDB.IMG_URL}${TMDB.IMG_SIZE.POSTER}${movie.poster_path}`}
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
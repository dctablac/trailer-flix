import React from "react";
import { useLoaderData } from "react-router-dom";
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
    console.log(popular);

    return (
        <div id="home">
            <h2 className="popular-title">Popular Movies</h2>
            <div className="popular-movies">
                {popular.results.map((movie, i) => {
                    return <img
                    className="popular-movie" 
                    key={i}
                    src={`https://image.tmdb.org/t/p/w185${movie['poster_path']}`} 
                    alt={movie['title']}
                    />
                })}
            </div>
        </div>
    )
}
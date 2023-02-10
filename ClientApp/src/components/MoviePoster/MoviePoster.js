import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE, TMDB } from "../../text";
import Film from "../SVG/Film";

export default function MoviePoster(props) {
    const {
        movie,
        setLoading
    } = props;
    const navigate = useNavigate();

    // Navigate to movie details
    function goToMovieDetails(movieId) {
        setLoading(true);
        navigate(`${ROUTE.DETAILS}/${movieId}`);
    }

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
                    <Film />
                </div>
            }
        </div>
    );
}
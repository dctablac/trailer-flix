import React, {
    useState,
    useEffect
} from "react";
import { 
    useLoaderData,
    useOutletContext
 } from "react-router-dom";
 import { API_URL } from '../../text';
 import { useAuth } from "../../contexts/AuthContext";
 import HomeBackdrop from "./HomeBackdrop/HomeBackdrop";
 import HomeResults from "./HomeResults/HomeResults";
 import './Home.css';
import MoviePoster from "../MoviePoster/MoviePoster";


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
    const { currentUser }  = useAuth();
    const [{
        getSearchResults,
        handleSearchChange, 
        query, 
        prevQuery, 
        searchResults,
        searchScrolled,
        setDetailsShowing,
        setLoading
    }] = useOutletContext();
    const { 
        nowPlayingMovies,
        popularMovies, 
        upcomingMovies
    } = useLoaderData();

    // Hide navbar and reset page scroll
    useEffect(() => {
        window.scroll(0,1);
        setDetailsShowing(false);
    // eslint-disable-next-line
    }, []);

    // State for backdrop image slideshow
    const [backdropIndex, setBackdropIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setBackdropIndex((prevBackdropIndex) => {
                if (prevBackdropIndex === popularMovies.length - 1) {
                    return 0;
                }
                return prevBackdropIndex + 1;
            });
        }, 4000);

        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, []);

    // Get user's favorite movies
    const [favorites, setFavorites] = useState(null);
    useEffect(() => {
        async function getUserFavorites() {
            const favoriteRes = await fetch(`${API_URL.FAVORITES}/${currentUser.uid}`);
            const favoriteMovies = await favoriteRes.json();
            const favoriteFormatted = formatMovies(favoriteMovies.results, "favorite");
            setFavorites(favoriteFormatted);
        }

        if (currentUser.uid !== undefined) {
            setLoading(true);
            getUserFavorites();
            setLoading(false);
        }
    // eslint-disable-next-line
    }, [currentUser]);

    const [nowPlaying] = useState(formatMovies(nowPlayingMovies, "now-playing"));
    const [popular] = useState(formatMovies(popularMovies, "popular"));
    const [upcoming] = useState(formatMovies(upcomingMovies, "upcoming"));

    // Movie poster format
    function formatMovies(movies, keyString) {
        return movies.map((movie, i) => {
            return (
                <MoviePoster key={`${keyString}-${movie.id}`} movie={movie} setLoading={setLoading}/>
            );
        });
    }

    return (
        <div id="home">
            <HomeBackdrop 
                backdropIndex={backdropIndex}
                getSearchResults={getSearchResults}
                handleSearchChange={handleSearchChange}
                popularMovies={popularMovies}
                query={query}
                searchScrolled={searchScrolled}
            />
            
            <HomeResults
                favorites={favorites}
                formatMovies={formatMovies} 
                nowPlaying={nowPlaying}
                popular={popular}
                prevQuery={prevQuery}
                searchResults={searchResults}
                upcoming={upcoming}
            />
        </div>
    )
}
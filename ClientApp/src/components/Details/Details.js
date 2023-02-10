import React, { 
    useEffect, 
    useRef,
    useState 
} from "react";
import { 
    useOutletContext,
    useLoaderData
} from 'react-router-dom';
import { API_URL, TMDB } from "../../text";
import { useAuth } from "../../contexts/AuthContext";
import Carousel from "../Carousel/Carousel";
import InfoTable from "./InfoTable";
import PersonSquare from "../SVG/PersonSquare";
import TrailerWrapper from "./TrailerWrapper/TrailerWrapper";
import './Details.css';

export async function loader({ params }) {
    try {
        // Get movie details
        const res = await fetch(`${API_URL.DETAILS}/${params.movieId}`);
        const details = await res.json();
        window.scroll(0,0);
        
        return details;
    } catch(err) {
        console.error(err);

        return null;
    }
}

export async function action({ request, params }) {
    let formData = await request.formData();
    const uid = formData.get('userId');
    
    switch (request.method) {
        case "POST":
            // Add as favorite
            console.log('posting');
            await fetch(`${API_URL.FAVORITES}`, {
                method: 'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserId: uid,
                    MovieId: params.movieId
                })
            });
            break;
        case "DELETE":
            // Remove as favorite
            console.log('deleting');
            await fetch(`${API_URL.FAVORITES}/${uid}/${params.movieId}`, {
                method: 'DELETE'
            });
            break;
        default:
            throw new Response('', { status: 405 });
    }
    return null;
}

export default function Details() {
    // Get movie details before page render
    const { currentUser } = useAuth();
    const { 
        info, 
        credits, 
        youtubeId 
    } = useLoaderData();
    const isFavorite = useRef(false);

     // Remove navbar on page mount and set background image
     const [{ setDetailsShowing, setLoading }] = useOutletContext();
     const [backgroundImg, setBackgroundImg] = useState(null);
     useEffect(() => {
        setLoading(true);
        setDetailsShowing(true);
        setBackgroundImg(info.backdrop_path ? `${TMDB.IMG_URL}${TMDB.IMG_SIZE.BACKDROP}${info.backdrop_path}` : null);
        
         // Returns nav to page
         return () => {
             setDetailsShowing(false);
         };
     // eslint-disable-next-line
     }, []);

    // Update favorite in database
    useEffect(() => {
        async function getFavoriteStatus() {
            // If the user is validated
            if (currentUser.uid !== undefined) {
                const res = await fetch(`${API_URL.FAVORITES}/${currentUser.uid}/${info.id}`);
                isFavorite.current = res.ok;
                setLoading(false);
            }
        }
        getFavoriteStatus();
    // eslint-disable-next-line
    }, [currentUser]);

    // Helper to format cast and crew
    function formatPeople(people) {
        return people.map((person, i) => {
            return <div key={`${person.name}-${i}`} className="person-poster-container">
                        { // Poster path is available
                            person.profile_path &&
                            <img 
                                className="person-poster"
                                src={`${TMDB.IMG_URL}${TMDB.IMG_SIZE.POSTER}${person.profile_path}`}
                                alt={person.name}
                            /> 
                        }
                        { // Poster path is null
                            !person.profile_path &&
                            <div className="poster-fill">
                                <PersonSquare />
                            </div>
                        }
                        {/* Profile poster description */}
                        <label className="person-poster-name">
                            {person.name}
                            <br/>
                            {person.character && `(${person.character})`}
                            {person.jobs && `(${person.jobs.join(', ')})`}
                        </label>
                    </div>
        });
    }

    return (
        <>
        {info && credits &&
        <div id="details">
            <TrailerWrapper 
                backgroundImg={backgroundImg}
                currentUser={currentUser}
                info={info}
                isFavorite={isFavorite}
                youtubeId={youtubeId}
            />
            <InfoTable info={info} />
            {
                credits.cast.length > 0 &&
                <>
                <h3 className="section-title">Cast</h3>
                <Carousel carouselId="cast" items={formatPeople(credits.cast)}/>
                </>
            }
            {
                credits.crew.length > 0 &&
                <>
                <h3 className="section-title">Crew</h3>
                <Carousel carouselId="crew" items={formatPeople(credits.crew)}/>
                </>
            }
        </div>
        }
        </>
    );
}
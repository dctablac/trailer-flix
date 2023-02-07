import React, { useEffect, useRef } from "react";
import { 
    Link,
    useOutletContext,
    useLoaderData,
    useFetcher
} from 'react-router-dom';
import { API_URL, ROUTE, TMDB } from "../../text";
import { useAuth } from "../../contexts/AuthContext";
import Carousel from "../Carousel/Carousel";
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
            await fetch(`${API_URL.FAVORITES}`, {
                method: 'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // TODO: Change the UserId
                    UserId: uid,
                    MovieId: params.movieId
                })
            });
            break;
        case "DELETE":
            // Remove as favorite
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
    const { info, credits, youtubeId } = useLoaderData();
    const fetcher = useFetcher();
    let isFavorite = useRef(false);

    // Set backgroundImg if available
    let backgroundImg = null;
    if (info.backdrop_path) {
        backgroundImg = `${TMDB.IMG_URL}${TMDB.IMG_SIZE.BACKDROP}${info.backdrop_path}`;
    } 

     // Remove navbar on page mount
     const [{ setDetailsShowing, setLoading }] = useOutletContext();
     useEffect(() => {
         setLoading(true);
         setDetailsShowing(true);
 
         // Returns nav to page
         return () => {
             setDetailsShowing(false);
         };
     // eslint-disable-next-line
     }, []);

    // Update favorite in database
    useEffect(() => {
        async function getFavoriteStatus() {
            if (currentUser.uid !== undefined) {
                const res = await fetch(`${API_URL.FAVORITES}/${currentUser.uid}/${info.id}`);
                // setIsFavorite(res.ok);
                isFavorite.current = res.ok;
                setLoading(false);
            }
        }
        getFavoriteStatus();
    // eslint-disable-next-line
    }, [currentUser]);

    // Handle star state on fetcher submit
    if (fetcher.state === "submitting") {
        isFavorite.current = !isFavorite.current;
    }

    function formatPeople(people) {
        return people.map((person, i) => {
            return <div key={i} className="person-poster-container">
                        {
                            person.profile_path &&
                            <img 
                            className="person-poster"
                            src={`${TMDB.IMG_URL}${TMDB.IMG_SIZE.POSTER}${person.profile_path}`}
                            alt={person.name}/> 
                        }
                        {
                            !person.profile_path &&
                            <div className="poster-fill">
                                <svg xmlns="http://www.w3.org/2000/svg" width="5rem" height="5rem" fill="grey" className="bi bi-person-square" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z"/>
                                </svg>
                            </div>
                        }
                        <label className="person-poster-name">
                            {person.name}
                            <br/>
                            {person.character && `(${person.character})`}
                            {person.jobs && `(${formatJobs(person.jobs)})`}
                        </label>
                    </div>
        });
    }

    function formatObjectList(list) {
        return list.map(item => item.name).join(', ');
    }
    
    function formatMoney(money) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        });
        return formatter.format(money);
    }

    function formatJobs(jobs) {
        return jobs.join(', ');
    }

    return (
        <>
        {info && credits &&
        <div id="details">
            <div className="trailer-wrapper">
                {
                    backgroundImg &&
                    <img 
                        className="trailer-backdrop" 
                        src={backgroundImg}
                        alt={info.title}
                    />
                }
                <div className="trailer-backdrop-screen"></div>
                <div className="browse-return-container">
                    <Link to={ROUTE.BROWSE} className="browse-return">{'< '}Back to Browse</Link>
                </div>
                <h2 className="details-title">
                    {info.original_title}
                    <fetcher.Form className="favorite-form" method={isFavorite.current ? "delete" : "post"}>
                        <button 
                        type="submit" 
                        className="star-container" 
                        name="userId" 
                        value={currentUser.uid}>
                        {
                            isFavorite.current ?
                            <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-star-fill" width="2rem" height="2rem" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                            </svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-star" width="2rem" height="2rem" fill="currentColor"  viewBox="0 0 16 16">
                                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                            </svg>
                        }
                        </button>
                    </fetcher.Form>
                </h2>
                <div className="trailer-container">
                    <iframe id="player" className="trailer" width="1080" height="607.5" 
                    src={`https://www.youtube.com/embed/${youtubeId}`} 
                    title="YouTube video player" frameBorder="0" 
                    allow="accelerometer; clipboard-write; encrypted-media; 
                    gyroscope; picture-in-picture; web-share" 
                    allowFullScreen></iframe>
                </div>
            </div>
            <table className="info-container">
                <tbody>
                    <tr>
                        <td className="info-overview" colSpan={2}>{info.overview}</td>
                    </tr>
                    <tr>
                        <td>Release Date</td>
                        <td>{info.release_date}</td>
                    </tr>
                    <tr>
                        <td>Revenue</td>
                        <td>{formatMoney(info.revenue)}</td>
                    </tr>
                    <tr>
                        <td>Genres</td>
                        <td>{formatObjectList(info.genres)}</td>
                    </tr>
                    <tr>
                        <td>Budget</td>
                        <td>{formatMoney(info.budget)}</td>
                    </tr>
                    <tr>
                        <td>Production</td>
                        <td>{formatObjectList(info.production_companies)}</td>
                    </tr>
                    <tr>
                        <td>Runtime</td>
                        <td>{`${info.runtime} minutes`}</td>
                    </tr>
                </tbody>
            </table>
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
                <h3 className="detail-title section-title">Crew</h3>
                <Carousel carouselId="crew" items={formatPeople(credits.crew)}/>
                </>
            }
        </div>
        }
        </>
    );
}
import React, { useEffect, useState } from "react";
import { 
    Link,
    useLocation, 
    useOutletContext
} from 'react-router-dom';
import Carousel from "../Carousel/Carousel";
import './Details.css';

export default function Details() {
    const url = useLocation();
    const movieId = url.pathname.split('/')[2];

    // Remove navbar on page mount
    const [{ setDetailsShowing }] = useOutletContext();
    useEffect(() => {
        // window.scroll(0,50);
        setDetailsShowing(true);
        // Returns nav to page
        return () => {
            setDetailsShowing(false);
        };
    // eslint-disable-next-line
    }, [])
    
    // Get movie details on page render
    const [credits, setCredits] = useState(null);
    const [info, setInfo] = useState(null);
    useEffect(() => {
        async function getMovieDetails() {
            try {
                const res = await fetch(`https://localhost:7234/api/movies/${movieId}`);
                const data = await res.json();
                setInfo(data.info);
                setCredits(data.credits);
            } catch(err) {
                console.error(err);
            }
        }
        getMovieDetails();
    }, [movieId])

    return (
        <>
        {info && credits &&
        <div id="details">
            <h2 className="detail-title">
                <Link to='/browse' className="browse-return">{'< '}Back to Browse</Link>
                {info.original_title}
            </h2>
            <div className="trailer-container">
                <iframe id="player" className="trailer" width="1080" height="607.5" 
                src="https://www.youtube.com/embed/jfKfPfyJRdk?rel=0&autoplay=1&controls=0" 
                title="YouTube video player" frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; 
                encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen></iframe>
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
            <h3 className="detail-title section-title">Cast</h3>
            <Carousel carouselId="cast" items={formatPeople(credits.cast)}/>
            <h3 className="detail-title section-title">Crew</h3>
            <Carousel carouselId="crew" items={formatPeople(credits.crew)}/>
        </div>
        }
        </>
    );

    function formatPeople(people) {
        return people.map((person, i) => {
            return <div key={i} className="person-poster-container">
                        {
                            person.profile_path &&
                            <img 
                            className="person-poster"
                            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
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
                            {`${person.name} `}
                            <br/>
                            {person.character && `(${person.character})`}
                            {person.job && `(${person.job})`}
                        </label>
                    </div>
        });
    }

    function formatObjectList(list) {
        let formatted = '';
        const lastIndex = list.length - 1;
        for (let i = 0; i < lastIndex; i++) {
            formatted += `${list[i].name}, `;
        }
        formatted += list[lastIndex].name;
        return formatted;
    }
    
    function formatMoney(money) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        });
        return formatter.format(money);
    }
}
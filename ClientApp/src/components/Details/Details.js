import React, { useEffect, useState } from "react";
import { 
    useLocation
} from 'react-router-dom';
import './Details.css';

export default function Details() {
    const url = useLocation();
    const movieId = url.pathname.split('/')[2];

    const [credits, setCredits] = useState(null);
    const [info, setInfo] = useState(null);
    useEffect(() => {
        async function getMovieDetails() {
            try {
                const res = await fetch(`https://localhost:7234/api/movies/${movieId}`);
                const data = await res.json();
                setInfo(data.info);
                setCredits(data.credits);
            } catch {
                throw new Response('', {
                    status: 404,
                    statusText: 'Not Found'
                });
            }
        }
        getMovieDetails();
    }, [movieId])

    return (
        <div id="details">
            <h2 className="detail-title">{info && info.original_title}</h2>
            <div className="trailer-container">
                <iframe className="trailer" width="1080" height="607.5" 
                src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1" 
                title="YouTube video player" frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; 
                encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen></iframe>
            </div>
            {info &&
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
            }
            <h3 className="detail-title section-title">Cast</h3>
            <div className="people-container">
                <div className="people-carousel">
                    {credits && formatPeople(credits.cast)}
                </div>
            </div>
            <h3 className="detail-title section-title">Crew</h3>
            <div className="people-container">
                <div className="people-carousel">
                    {credits && formatPeople(credits.crew)}
                </div>
            </div>

        </div>
    );

    function formatPeople(people) {
        return people.map((person, i) => {
            if (!person.profile_path)
            {
                return <div className="poster-fill">{person.name}</div>
            }
            return <img 
                    key={i}
                    src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                    alt={person.name}/>
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
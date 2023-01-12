import React, { useEffect, useState } from "react";
import { 
    Link,
    useLocation, 
    useOutletContext
} from 'react-router-dom';
import './Details.css';

export default function Details() {
    const url = useLocation();
    const movieId = url.pathname.split('/')[2];

    function scrollListener() {
        const maxScroll = this.scrollWidth - this.clientWidth;
        if (this.scrollLeft === 0) {
            this.children[0].style.opacity = 0;
            this.children[2].style.opacity = 1;
        } else if (this.scrollLeft === maxScroll) {
            this.children[0].style.opacity = 1;
            this.children[2].style.opacity = 0;
        } else {
            this.children[0].style.opacity = 1;
            this.children[2].style.opacity = 1;
        }
    }

    // Carousel buttons will shift panels accordingly
    const scrollCarouselLeft = ({ target }) => {
        target.parentNode.scrollLeft -= target.parentNode.clientWidth;
    }
    const scrollCarouselRight = ({ target }) => {
        target.parentNode.scrollLeft += target.parentNode.clientWidth;
    }

    // Remove navbar on page mount, set event listeners for carousels
    const [{ setDetailsShowing }] = useOutletContext();
    useEffect(() => {
        // window.scroll(0,60);
        setDetailsShowing(true);

        // Get event listeners on the carousels to disable buttons
        // depending on scrollLeft values
        const carousels = document.querySelectorAll('.people-carousel-container');
        carousels.forEach((carousel) => {
            carousel.addEventListener('scroll', scrollListener);
        });

        // Cleans up event listeners and returns nav to page
        return () => {
            setDetailsShowing(false);

            carousels.forEach((carousel) => {
                carousel.removeEventListener('scroll', scrollListener);
            })
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
        <div id="details">
            <h2 className="detail-title">
                <Link to='/browse' className="browse-return">{'< '}Back to Browse</Link>
                {info && info.original_title}
            </h2>
            <div className="trailer-container">
                <iframe id="player" className="trailer" width="1080" height="607.5" 
                src="https://www.youtube.com/embed/jfKfPfyJRdk?rel=0&autoplay=1&controls=0" 
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
            <div className="people-carousel-container">
                <button className="carousel-btn carousel-btn-left" onClick={scrollCarouselLeft}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                        <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                    </svg>
                </button>
                <div className="people-carousel">
                    {credits && formatPeople(credits.cast)}
                </div>
                <button className="carousel-btn carousel-btn-right" onClick={scrollCarouselRight}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                    </svg>
                </button>
            </div>
            <h3 className="detail-title section-title">Crew</h3>
            <div className="people-carousel-container">
                <button className="carousel-btn carousel-btn-left" onClick={scrollCarouselLeft}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                        <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                    </svg>
                </button>
                <div className="people-carousel">
                    {credits && formatPeople(credits.crew)}
                </div>
                <button className="carousel-btn carousel-btn-right" onClick={scrollCarouselRight}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                    </svg>
                </button>
            </div>

        </div>
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
                            <div className="poster-fill"></div>
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
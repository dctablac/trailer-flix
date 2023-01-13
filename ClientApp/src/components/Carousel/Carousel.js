import React, { useEffect } from 'react';
import './Carousel.css';

export default function Carousel(props) {
    const { carouselId, items, itemType } = props;

    useEffect(() => {
        // Get event listeners on the carousels to disable buttons
        // depending on scrollLeft values
        const carouselContainer = document.getElementById(carouselId);
        carouselContainer.addEventListener('scroll', scrollListener);
        return () => {
            carouselContainer.removeEventListener('scroll', scrollListener);
        }
        //eslint-disable-next-line
    }, []) 

    function scrollListener() {
        const carouselContainer = document.getElementById(carouselId);
        // 'this' is the carousel-container that called this listener.
        const maxScroll = carouselContainer.scrollWidth - carouselContainer.clientWidth;
        // If scroll is moved to far left, hide left button
        if (carouselContainer.scrollLeft === 0) {
            // [0]: left button
            // [1]: carousel
            // [2]: right button
            carouselContainer.children[0].style.opacity = 0; // hide left button
            carouselContainer.children[2].style.opacity = 1; // show right button
        } else if (this.scrollLeft === maxScroll) {
            carouselContainer.children[0].style.opacity = 1; // show left button
            carouselContainer.children[2].style.opacity = 0; // hide right button
        } else {
            // In the middle of the carousel, show both buttons
            carouselContainer.children[0].style.opacity = 1;
            carouselContainer.children[2].style.opacity = 1;
        }
    }

    function scrollCarouselLeft({ target }) {
        target.parentNode.scrollLeft -= target.parentNode.clientWidth;
    }
    function scrollCarouselRight({ target }) {
        target.parentNode.scrollLeft += target.parentNode.clientWidth;
    }

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

    return (
        <div className="carousel-container" id={carouselId}>
            <button className="carousel-btn carousel-btn-left" onClick={scrollCarouselLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                    <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                </svg>
            </button>
            <div className="carousel">
                {itemType === 'person' && formatPeople(items)}
            </div>
            <button className="carousel-btn carousel-btn-right" onClick={scrollCarouselRight}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                    <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                </svg>
            </button>
        </div>
    )
}
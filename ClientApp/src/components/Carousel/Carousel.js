import React, { useEffect } from 'react';
import './Carousel.css';

export default function Carousel(props) {
    const { carouselId, items } = props;

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
        const maxScroll = carouselContainer.scrollWidth - carouselContainer.clientWidth;
        const leftBtn = carouselContainer.children[0];
        const rightBtn = carouselContainer.children[2];
        // If scroll is moved to far left, hide left button
        if (carouselContainer.scrollLeft < 50) {
            leftBtn.style.opacity = 0;
            rightBtn.style.opacity = 1;
        // If scroll is moved to far right, hide right button
        } else if (this.scrollLeft === maxScroll) {
            leftBtn.style.opacity = 1;
            rightBtn.style.opacity = 0;
        // If in the middle of the carousel, show both buttons
        } else {
            leftBtn.style.opacity = 1;
            rightBtn.style.opacity = 1;
        }
    }

    function scrollCarouselLeft({ target }) {
        target.parentNode.scrollLeft -= target.parentNode.clientWidth;
    }
    function scrollCarouselRight({ target }) {
        target.parentNode.scrollLeft += target.parentNode.clientWidth;
    }

    return (
        <div className="carousel-container" id={carouselId}>
            <button className="carousel-btn carousel-btn-left" onClick={scrollCarouselLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                    <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                </svg>
            </button>
            <div className="carousel">
                {items}
            </div>
            <button className="carousel-btn carousel-btn-right" onClick={scrollCarouselRight}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                    <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                </svg>
            </button>
        </div>
    )
}
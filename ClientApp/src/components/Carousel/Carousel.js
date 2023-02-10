import React, { useEffect, useState } from 'react';
import CaretLeftFill from '../SVG/CaretLeftFill';
import CaretRightFill from '../SVG/CaretRightFill/CaretRightFill';
import './Carousel.css';

export default function Carousel(props) {
    const { carouselId, items } = props;

    const [isShort, setIsShort] = useState(false);

    useEffect(() => {
        const carouselContainer = document.getElementById(carouselId);
        if (carouselContainer.scrollWidth <= carouselContainer.clientWidth) {
            setIsShort(true);
        } else {
            // Get event listeners on the carousels to disable buttons
            // depending on scrollLeft values
            carouselContainer.addEventListener('scroll', scrollListener);

            return () => {
                carouselContainer.removeEventListener('scroll', scrollListener);
            }
        }
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (isShort) {
            // To let page load completely before trying to attach event listener
            setTimeout(() => {
                // Double check that it really is short
                const carouselContainer = document.getElementById(carouselId);
                if (carouselContainer.scrollWidth > carouselContainer.clientWidth) {
                    setIsShort(false);
                    carouselContainer.scrollLeft = 0;
                    // Get event listeners on the carousels to disable buttons
                    // depending on scrollLeft values
                    carouselContainer.addEventListener('scroll', scrollListener);

                    return () => {
                        carouselContainer.removeEventListener('scroll', scrollListener);
                        console.log('removed listener');
                    }
                }
            }, 1000);
        }
    // eslint-disable-next-line
    }, [isShort])

    // 
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
            {
                !isShort &&
                <button className="carousel-btn carousel-btn-left" onClick={scrollCarouselLeft}>
                     <CaretLeftFill />
                </button>
            }
            <div className="carousel">
                {items}
            </div>
            {
                !isShort &&
                <button className="carousel-btn carousel-btn-right" onClick={scrollCarouselRight}>
                    <CaretRightFill />
                </button>
            }
        </div>
    )
}
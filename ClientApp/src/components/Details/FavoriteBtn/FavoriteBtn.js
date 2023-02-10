import React from "react";
import { useFetcher } from "react-router-dom";
import Star from "../../SVG/Star";
import StarFill from "../../SVG/StarFill";

export default function Favorite(props) {
    const {
        currentUser,
        isFavorite
    } = props;
    const fetcher = useFetcher();

    return (
        <fetcher.Form className="favorite-form" method={isFavorite ? "delete" : "post"}>
            <button 
                type="submit" 
                className="star-container" 
                name="userId" 
                value={currentUser.uid}
            >
            {
                isFavorite ?
                <StarFill /> :
                <Star />
            }
            </button>
        </fetcher.Form>
    );
}
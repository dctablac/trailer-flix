import React from "react";
import { 
    useFetcher
} from "react-router-dom";
import Star from "../../SVG/Star";
import StarFill from "../../SVG/StarFill";

export default function Favorite(props) {
    const {
        currentUser,
        isFavorite
    } = props;
    const fetcher = useFetcher();

    // Handle star state on fetcher submit
    if (fetcher.state === "submitting") {
        isFavorite.current = !isFavorite.current;
    }

    return (
        <fetcher.Form 
            className="favorite-form" 
            method={isFavorite.current ? "delete" : "post"}
        >
            <button 
                type="submit" 
                className="star-container" 
                name="userId" 
                value={currentUser.uid}
            >
            {
                isFavorite.current ?
                <StarFill /> :
                <Star />
            }
            </button>
        </fetcher.Form>
    );
}
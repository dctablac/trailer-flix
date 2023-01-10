import React from 'react';
import { Form } from 'react-router-dom';
import './Search.css';

export default function Search(props) {
    return (
        <Form 
            id="search" 
            action="/browse" 
            onSubmit={props.getSearchResults}>
            <input
                id="q" 
                className="search-bar" 
                onChange={({target}) => props.setQuery(target.value)}
                placeholder="Search titles or genres"
                type="search"
                value={props.query}
            />
        </Form>
    )
}
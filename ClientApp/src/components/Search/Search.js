import React from 'react';
import { Form } from 'react-router-dom';
import './Search.css';

export default function Search(props) {
    return (
        <Form 
            id="search" 
            action="/browse" 
            onSubmit={props.getSearchResults}>
                {!props.searchScrolled && 
                    <input
                        id="q" 
                        className="search-bar" 
                        onChange={props.handleSearchChange}
                        placeholder="Search titles or genres"
                        type="search"
                        value={props.query}
                    />
                }
        </Form>
    )
}
import React from 'react';
import { Form } from 'react-router-dom';
import { ROUTE } from '../../text';
import './Search.css';

export default function Search(props) {
    const { 
        getSearchResults,
        handleSearchChange,
        query,
        searchScrolled
    } = props;
    return (
        <Form 
            className={searchScrolled ? "search-bar-nav-form" : "search-bar-form"} 
            action={ROUTE.BROWSE}
            onSubmit={getSearchResults}>
                <input
                    id="q" 
                    className={searchScrolled ? "search-bar-nav" : "search-bar"}
                    onChange={handleSearchChange}
                    placeholder="Search movie titles"
                    type="search"
                    value={query}
                />
        </Form>
    )
}
import React from 'react';
import { Form } from 'react-router-dom';
import { ROUTE } from '../../text';
import './Search.css';

export default function Search(props) {
    const { 
        getSearchResults,
        handleSearchChange,
        query
    } = props;
    return (
        <Form 
            id="search" 
            action={ROUTE.BROWSE}
            onSubmit={getSearchResults}>
                <input
                    id="q" 
                    className={"search-bar"}
                    onChange={handleSearchChange}
                    placeholder="Search titles or genres"
                    type="search"
                    value={query}
                />
        </Form>
    )
}
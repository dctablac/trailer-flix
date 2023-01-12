import React, {
  useState
} from 'react';
import {
  Outlet
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  const [query, setQuery] = useState('');
  const [prevQuery, setPrevQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  
  // Track if user has scrolled past the search bar position in backdrop
  const [searchScrolled, setSearchScrolled] = useState(false);

  async function getSearchResults() {
      setPrevQuery(query);
      if (query !== '') {
          try {
              const res = await fetch(`https://localhost:7234/api/movies/search?query=${query}`);
              const data = await res.json();
              setSearchResults(data.results);
              window.scroll(0,550);
          } catch(err) {
              console.error(err);
          }
      } else { // Empty searches should flush results in the state to reset home page
          setSearchResults(null);
      }
  }

  return (
    <>
      <Navbar 
        query={query} 
        setQuery={setQuery} 
        searchScrolled={searchScrolled} 
        setSearchScrolled={setSearchScrolled}
        getSearchResults={getSearchResults}
      />
      <Outlet 
        context={
          [
            query, 
            setQuery, 
            prevQuery, 
            searchResults, 
            getSearchResults,
            searchScrolled,
            setSearchScrolled
          ]
        }
      />
      <Footer />
    </>
  );
}

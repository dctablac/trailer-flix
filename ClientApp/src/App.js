import React, {
  useState
} from 'react';
import {
  Outlet
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  const [query, setQuery] = useState('');
  // For search result tag so user can repopulate query in search bar
  // without changing the tag text
  const [prevQuery, setPrevQuery] = useState('');
  // Search results on the home page
  const [searchResults, setSearchResults] = useState(null);
  // To hide navbar when on movie details page
  const [detailsShowing, setDetailsShowing] = useState(false);
  // Track if user has scrolled past the search bar position in backdrop
  const [searchScrolled, setSearchScrolled] = useState(false);

  async function getSearchResults() {
      setPrevQuery(query);
      if (query !== '') {
          try {
              const res = await fetch(`https://localhost:7234/api/movies/search?query=${query}`);
              const data = await res.json();
              setSearchResults(data.results);
              // Scroll down to search results
              window.scroll(0,550);
          } catch(err) {
              console.error(err);
          }
      } else { // Empty searches should flush results in the state to reset home page
          setSearchResults(null);
      }
  }

  return (
    <AuthProvider>
      {!detailsShowing &&
        <Navbar 
        query={query} 
        setQuery={setQuery} 
        searchScrolled={searchScrolled} 
        setSearchScrolled={setSearchScrolled}
        getSearchResults={getSearchResults}
        />
      }
      <Outlet 
        context={
          [
            {
              query, 
              setQuery, 
              prevQuery, 
              searchResults, 
              getSearchResults,
              searchScrolled,
              setSearchScrolled,
              setDetailsShowing
            }
          ]
        }
      />
      <Footer />
    </AuthProvider>
  );
}

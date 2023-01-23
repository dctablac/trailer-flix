import React, {
  useState
} from 'react';
import {
  Outlet
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import Loader from './components/Loader';
import { API_URL } from './text';

export default function App() {
  const [query, setQuery] = useState('');
  // For search result tag so user can repopulate query in search bar
  // without changing the tag text
  const [prevQuery, setPrevQuery] = useState('');
  // Search results on the home page
  const [searchResults, setSearchResults] = useState(null);
  // To hide navbar when on movie details page
  const [detailsShowing, setDetailsShowing] = useState(false);
  // To hide navbar and footer when at login/register pages
  const [registerOrLoginShowing, setRegisterOrLoginShowing] = useState(true);
  // Track if user has scrolled past the search bar position in backdrop
  const [searchScrolled, setSearchScrolled] = useState(false);
  // Track if app is loading a page
  const [loading, setLoading] = useState(false);

  async function getSearchResults() {
      setLoading(true);
      setPrevQuery(query);
      if (query !== '') {
          try {
              const uri = `${API_URL.SEARCH}?query=${query}`;
              const res = await fetch(uri);
              const data = await res.json();
              setSearchResults(data.results);
              setLoading(false);
              // Scroll down to search results
              window.scroll(0,550);
          } catch(err) {
              console.error(err);
          }
      }
      setLoading(false);
  }

  function handleSearchChange({ target }) {
    setQuery(target.value);
    if (target.value === '') {
      setSearchResults(null);
    }
  }

  return (
    <AuthProvider>
      {loading && <Loader />}
      {
        !detailsShowing && !registerOrLoginShowing &&
        <Navbar 
          query={query} 
          handleSearchChange={handleSearchChange} 
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
              handleSearchChange,
              prevQuery, 
              searchResults, 
              getSearchResults,
              searchScrolled,
              setSearchScrolled,
              setDetailsShowing,
              loading,
              setLoading,
              setRegisterOrLoginShowing
            }
          ]
        }
      />
      {
        !registerOrLoginShowing &&
        <Footer />
      }
    </AuthProvider>
  );
}

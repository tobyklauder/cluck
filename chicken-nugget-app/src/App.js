import './App.css';
import React, { useState, useEffect } from 'react';
import SearchBar from './search';
import axios from 'axios';

function App() {
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/products');
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchData();
  }, []); // Run this effect only once when the component mounts

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  const handleRating = async (productId, rating) => {
    try {
      // Update the rating on the server
      await axios.put('http://localhost:5001/api/products', { productId, rating });

      // Update the searchResults state with the new rating
      const updatedResults = searchResults.map((result) => {
        if (result.id === productId) {
          return { ...result, rating };
        }
        return result;
      });

      setSearchResults(updatedResults);
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  return (
    <div className="App">
      <body> 
      <img src="/nugg.png" alt="nugg"/>
        <SearchBar onSearch={handleSearch} />
        <div id = "results"> 
        {searchResults.map((result) => (
          <div key={result.id} className="chicken">
            <h3>{result.brand_name}</h3> 
            <p>{result.description}</p>
            <p>{result.ingredients}</p> 

            <div className="rating-buttons">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} className="rating-button" onClick={() => handleRating(result.id, value)}>{value}</button>
              ))}
            </div>

            <p>Current Rating: {result.rating}</p>
          </div>
        ))}
        </div> 
      </body> 
    </div>
  );
}

export default App;

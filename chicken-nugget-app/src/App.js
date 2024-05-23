import './App.css';
import React, { useState, useEffect } from 'react';
import SearchBar from './search';
import axios from 'axios';

function App() {
  // State variables
  const [searchResults, setSearchResults] = useState([]); // Stores the search results
  const [bestNugget, setBestNugget] = useState(null); // Stores the best nugget

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch best nugget and search results data from the API
        const [bestNuggetResponse, searchResultsResponse] = await Promise.all([
          axios.get('http://localhost:5001/api/best_nugget'),
          axios.get('http://localhost:5001/api/products'),
        ]);

        // Update the state with the fetched data
        setBestNugget(bestNuggetResponse.data[0]);
        setSearchResults(searchResultsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Update the rating of the best nugget
  const updateBestNuggetRating = async (newRating) => {
    try {
      // Send a PUT request to update the rating of the best nugget
      const response = await axios.put('http://localhost:5001/api/products', { productId: bestNugget.id, rating: newRating });
      // Update the best nugget with the new rating
      let updatedBestNugget = { ...bestNugget, rating: response.data.rating };
      setBestNugget(updatedBestNugget);
    } catch (error) {
      console.error('Error updating best nugget rating:', error);
    }
  };

  // Handle search results
  const handleSearch = (results) => {
    setSearchResults(results);
  };

  // Update the best nugget
  const updateBestNugget = (newBestNugget) => {
    setBestNugget(newBestNugget);
  };

  // Handle rating update
  const handleRating = async (productId, rating) => {
    try {
      // Send a PUT request to update the rating of a product
      const response = await axios.put('http://localhost:5001/api/products', { productId, rating });
      let newRating = response.data.rating;

      // If the updated rating is for the best nugget, update its rating
      if (bestNugget && bestNugget.id === productId) {
        updateBestNuggetRating(newRating);
      }

      // Update the search results with the new rating
      setSearchResults((prevResults) => {
        return prevResults.map((result) => {
          if (result.id === productId) {
            return { ...result, rating: newRating };
          }
          return result;
        });
      });

    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  return (
    <div className="App">
      <body>
        <img src="/nugg.png" alt="nugg" />
        
        <div id="results">
          {/* Display the best nugget */}
          {bestNugget && (
            <div id="best" key={bestNugget.id} className="chicken">
              <h3>{bestNugget.brand_name}</h3>
              <p>{bestNugget.description}</p>
              <p>Ingredients: {bestNugget.ingredients}</p>

              {/* Display rating buttons */}
              <div className="rating-buttons">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} className="rating-button" onClick={() => handleRating(bestNugget.id, value)}>
                    {value}
                  </button>
                ))}
              </div>

              <p>Current Rating: {bestNugget.rating.toFixed(2)}</p>
            </div>
          )}

          {/* Display the search bar */}
          <SearchBar onSearch={handleSearch} />

          {/* Display search results */}
          {searchResults.map((result) => (
            <div key={result.id} className="chicken">
              <h3>{result.brand_name}</h3>
              <p>{result.description}</p>
              <p>Ingredients: {result.ingredients}</p>

              {/* Display rating buttons */}
              <div className="rating-buttons">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} className="rating-button" onClick={() => handleRating(result.id, value)}>
                    {value}
                  </button>
                ))}
              </div>

              <p>Current Rating: {result.rating.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </body>
    </div>
  );
}

export default App;

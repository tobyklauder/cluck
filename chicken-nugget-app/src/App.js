import './App.css';
import React, { useState, useEffect } from 'react';
import SearchBar from './search';
import axios from 'axios';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [bestNugget, setBestNugget] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bestNuggetResponse, searchResultsResponse] = await Promise.all([
          axios.get('http://localhost:5001/api/best_nugget'),
          axios.get('http://localhost:5001/api/products'),
        ]);

        setBestNugget(bestNuggetResponse.data[0]);
        setSearchResults(searchResultsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const updateBestNuggetRating = async (newRating) => {
    try {
      const response = await axios.put('http://localhost:5001/api/products', { productId: bestNugget.id, rating: newRating });
      let updatedBestNugget = { ...bestNugget, rating: response.data.rating };
      setBestNugget(updatedBestNugget);
    } catch (error) {
      console.error('Error updating best nugget rating:', error);
    }
  };

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  const updateBestNugget = (newBestNugget) => {
    setBestNugget(newBestNugget);
  };
  

  const handleRating = async (productId, rating) => {
    try {
      const response = await axios.put('http://localhost:5001/api/products', { productId, rating });
      let newRating = response.data.rating;

      if (bestNugget && bestNugget.id === productId) {
        updateBestNuggetRating(newRating);
      }

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
          {bestNugget && (
            <div id = "best" key={bestNugget.id} className="chicken">
              <h3>{bestNugget.brand_name}</h3>
              <p>{bestNugget.description}</p>
              <p>Ingredients: {bestNugget.ingredients}</p>

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

          <SearchBar onSearch={handleSearch} />

          {searchResults.map((result) => (
            <div key={result.id} className="chicken">
              <h3>{result.brand_name}</h3>
              <p>{result.description}</p>
              <p>Ingredients: {result.ingredients}</p>

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

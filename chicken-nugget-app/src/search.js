import React, { useState } from 'react';
import axios from 'axios';

function SearchBar({ onSearch }) {
  const [brand, setBrand] = useState('');
  const [product, setProduct] = useState(''); 

  
  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  const handleProductChange = (e) => {
    setProduct(e.target.value)
  }; 

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:5001/api/products', {
        params: {
          brand: brand,
          product: product
        }
      });
      onSearch(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <form  onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search brand..."
        value={brand}
        onChange={handleBrandChange}
      />
      <input 
        type="text"
        placeholder="Search product..."
        value={product}
        onChange={handleProductChange}
        />
      <button  type="submit">Search</button>
    </form>
  );
}

export default SearchBar;

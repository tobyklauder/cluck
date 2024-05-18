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
    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', width: '50%', marginLeft: '25%', marginRight: '25%'}}>
      <input
        type="text"
        placeholder="Search brand..."
        value={brand}
        onChange={handleBrandChange}
        style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', flexGrow: 1 }}
      />
      <input 
        type="text"
        placeholder="Search product..."
        value={product}
        onChange={handleProductChange}
        style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', flexGrow: 1 }}
      />
      <button type="submit" style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #007BFF', backgroundColor: '#007BFF', color: 'white', cursor: 'pointer' }}>Search</button>
    </form>
  );  
}

export default SearchBar;

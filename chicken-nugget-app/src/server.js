const cors = require('cors');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const dbPath = '../../chicken_nuggs.db';
const db = new sqlite3.Database(dbPath);


db.serialize(() => {
  db.all('SELECT * FROM chicken_nuggets LIMIT 1', (err, rows) => {
    if (err) {
      console.error('Error querying database:', err.message);
    } else {
      console.log('Database connected successfully!');
      console.log('Sample row:', rows[0]);
    }
  });
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/api/products', (req, res) => {
    const { brand, product } = req.query;


    const sql = `SELECT DISTINCT * FROM chicken_nuggets WHERE brand_name LIKE '%${brand}%' AND description LIKE '%${product}%'`;
    db.all(sql, (err, rows) => {
      if (err) {
        console.error('Error executing query:', err.message); 
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(rows);
    });
  });
  

  app.put('/api/products', (req, res) => {
    const { productId, rating } = req.body;
  
    // Fetch the existing rating from the database
    const fetchSql = `SELECT rating FROM chicken_nuggets WHERE id = ?`;
    db.get(fetchSql, [productId], (err, row) => {
      if (err) {
        console.error('Error fetching existing rating:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (!row) {
        console.error(`Product with ID ${productId} not found`);
        return res.status(404).json({ error: `Product with ID ${productId} not found` });
      }
  
      // Calculate the new average rating
      const existingRating = row.rating;
      const newRating = rating; 
  
      // Update the product's rating in the database
      const updateSql = `UPDATE chicken_nuggets SET rating = ? WHERE id = ?`;
      db.run(updateSql, [newRating, productId], function(err) {
        if (err) {
          console.error('Error updating rating:', err.message);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log(`Rating updated successfully for product with ID ${productId}`);
        
        // Respond with the new average rating
        res.json({ rating: newRating });
      });
    });
  });
  
  


app.listen(5001, () => {
  console.log('Server is running on port 5001');
});

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


    const sql = `
  SELECT DISTINCT chicken_nuggets.*, ratings.rating AS rating
  FROM chicken_nuggets
  LEFT JOIN ratings ON chicken_nuggets.id = ratings.chicken_nugget_id
  WHERE chicken_nuggets.brand_name LIKE '%${brand}%' AND chicken_nuggets.description LIKE '%${product}%'
    `;

    db.all(sql, (err, rows) => {
      if (err) {
        console.error('Error executing query:', err.message); 
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(rows);
    });
  });


app.get('/api/best_nugget', (req, res) => {
    const sql = `SELECT 
    chicken_nuggets.id, 
    chicken_nuggets.brand_name, 
    chicken_nuggets.description, 
    chicken_nuggets.ingredients, 
    MAX(ratings.rating) AS rating
FROM 
    chicken_nuggets
LEFT JOIN 
    ratings ON chicken_nuggets.id = ratings.chicken_nugget_id
GROUP BY 
    chicken_nuggets.id, 
    chicken_nuggets.brand_name, 
    chicken_nuggets.description, 
    chicken_nuggets.ingredients
ORDER BY 
    rating DESC
LIMIT 
    1;
`

    db.all(sql, (err, rows) => {
        if (err) {
            console.error('Error executing query:', err.message); 
            return res.status(500).json({error: 'Internal Server Error'}); 
        }

        res.json(rows)
    }); 
}); 
    

  app.put('/api/products', (req, res) => {
    const { productId, rating } = req.body;
  
    // Fetch the existing rating and total ratings from the database
    const fetchSql = `SELECT rating, total_ratings FROM ratings WHERE chicken_nugget_id = ?`;
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
      const totalRatings = row.total_ratings;
      const newTotalRatings = totalRatings + 1;
      const newRating = ((existingRating * totalRatings) + rating) / newTotalRatings;
  
      // Update the product's rating and total ratings in the database
      const updateSql = `UPDATE ratings SET rating = ?, total_ratings = ? WHERE chicken_nugget_id = ?`;
      db.run(updateSql, [newRating, newTotalRatings, productId], function(err) {
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

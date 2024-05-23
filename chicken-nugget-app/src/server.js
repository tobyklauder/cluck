// include dependencies 
const cors = require('cors');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

// test connection to the database
const app = express();
const dbPath = '../chicken_nuggs.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});


// set up the server to serve static files from build 
app.use(express.static(path.join(__dirname, 'build')));

// ensure the application uses cors
app.use(cors());

// set up parsing for incoming request bodies 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set up default headers 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


// get the products as a result of a query including brand name and product description 
app.get('/api/products', (req, res) => {

    // get the brand and product from the query. 
    const { brand, product } = req.query;

    // the sql query from the database 
    const sql = `
  SELECT DISTINCT chicken_nuggets.*, ratings.rating AS rating
  FROM chicken_nuggets
  LEFT JOIN ratings ON chicken_nuggets.id = ratings.chicken_nugget_id
  WHERE chicken_nuggets.brand_name LIKE '%${brand}%' AND chicken_nuggets.description LIKE '%${product}%'
    `;

    // execute the sql query (handling errors)
    db.all(sql, (err, rows) => {
      if (err) {
        console.error('Error executing query:', err.message); 
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // respond with all resulting entries
      res.json(rows);
    });
  });


// api endpoint to determine the current best nugget (or chicken product in the database)
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
  
    // get the rating for the current product by it's product id 
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
  
      // calculate the new rating (average of new + existing)
      const existingRating = row.rating;
      const totalRatings = row.total_ratings;
      const newTotalRatings = totalRatings + 1;
      const newRating = ((existingRating * totalRatings) + rating) / newTotalRatings;
  
      // update the rating for the product 
      const updateSql = `UPDATE ratings SET rating = ?, total_ratings = ? WHERE chicken_nugget_id = ?`;
      db.run(updateSql, [newRating, newTotalRatings, productId], function(err) {
        if (err) {
          console.error('Error updating rating:', err.message);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log(`Rating updated successfully for product with ID ${productId}`);
  
        // respond with the new average rating to be displayed on the site 
        res.json({ rating: newRating });
      });
    });
  });
  
  


app.listen(5001, () => {
  console.log('Server is running on port 5001');
});

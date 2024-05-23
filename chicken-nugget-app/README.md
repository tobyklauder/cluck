# cluck 

my response to the question "what is the best chicken product in america?". 

# Development Methodology 

Originally, I searched on Kaggle for a Chicken Nugget Database of some kind - but could only find a cost vs weight comparison for chicken nuggets at Wendy's and McDonalds. Interesting, but not quite what I was looking for. 

So, I generated an API key for [text](https://fdc.nal.usda.gov/) and got 10,000 branded chicken products (the maximum page size for a single request). 
(see chicken-nugget-app/data_generation/scrape.py). 

From there, I created an sqlite database using the sqlite3 database consisting of two tables (ratings, and chicken_nuggets). 

I set up an API using Express.js (chicken-nugget-app/src/server.js). It defines several routes that handle different HTTP requests and interact with a SQLite database. The API allows clients to retrieve and update data related to chicken nuggets and other chicken products. 

Finally, using React - I was able to successfully implement a front end website where users can search for chicken products according to brand and product, and then rank them accordingly. 

# Where can I use it? 

Currently, I'm making some additional tweaks before hosting the site online. Stay tuned for more information! 
import sqlite3
import csv 

conn = sqlite3.connect('chicken_nuggs.db')

cursor = conn.cursor() 

cursor.execute('''CREATE TABLE IF NOT EXISTS chicken_nuggets (
                  id INTEGER PRIMARY KEY, 
                  brand_owner TEXT, 
                  brand_name TEXT, 
                  description TEXT, 
                  ingredients TEXT
    )''')

cursor.execute('''CREATE TABLE IF NOT EXISTS ratings (
                id INTEGER PRIMARY KEY, 
                chicken_nugget_id INTEGER, 
                total_ratings INTEGER DEFAULT 0, 
                rating FLOAT DEFAULT 0.0,
                FOREIGN KEY (chicken_nugget_id) REFERENCES chicken_nuggets(id) 
                
    )''')

with open('chicken_nuggets_data.csv', 'r') as file: 
    csv_reader = csv.reader(file)
    next(csv_reader)
    for row in csv_reader: 
        cursor.execute('INSERT INTO chicken_nuggets (brand_owner, brand_name, description, ingredients) VALUES (?, ?, ?, ?)', row)
        nugget_id = cursor.lastrowid  # Get the ID of the inserted row
        cursor.execute('INSERT INTO ratings (chicken_nugget_id) VALUES (?)', (nugget_id,))



conn.commit() 
conn.close() 
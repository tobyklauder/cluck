import sqlite3
import csv 

conn = sqlite3.connect('chicken_nuggs.db')

cursor = conn.cursor() 

cursor.execute('''CREATE TABLE IF NOT EXISTS chicken_nuggets (
                  id INTEGER PRIMARY KEY, 
                  brand_owner TEXT, 
                  brand_name TEXT, 
                  description TEXT, 
                  ingredients TEXT, 
                  rating FLOAT
    )''')

with open('chicken_nuggets_data.csv', 'r') as file: 
    csv_reader = csv.reader(file)
    next(csv_reader)
    for row in csv_reader: 
        cursor.execute('INSERT INTO chicken_nuggets (brand_owner, brand_name, description, ingredients, rating) VALUES (?, ?, ?, ?, 0.0)', row)



conn.commit() 
conn.close() 
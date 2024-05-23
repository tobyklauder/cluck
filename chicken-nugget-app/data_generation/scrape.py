import csv
import requests
import json 

# endpoint 
url = "https://api.nal.usda.gov/fdc/v1/foods/search"


# Load API key from credentials.json
with open("chicken-nugget-app/data_generation/credentials.json") as f:
    credentials = json.load(f)
    api_key = credentials['api_key']


# Parameters for the request
params = {
    "api_key": api_key,
    "query": "chicken",
    "dataType": "Branded",
    "pageSize": 10000  
}

# Make the request
response = requests.get(url, params=params)


if response.status_code == 200:
    data = response.json()
    
    foods = data['foods']
    
    food_data = [] 
    for food in foods: 
        values = {} 
        
        if food['dataType'] == 'Branded': 
            try: 
                values["brand_owner"] = food['brandOwner']
                values["brand_name"] = food['brandName']
                values["description"] = food['description']
                values["ingredients"] = food['ingredients']
                
                food_data.append(values)
            except KeyError:
                print("Values missing!") 
    
    # Specify the path to save the CSV file
    csv_file_path = "chicken-nugget-app/data_generation/chicken_nuggets_data.csv"

    # Define the CSV fieldnames based on the keys in your data
    fieldnames = ["brand_owner", "brand_name", "description", "ingredients"]

    # Write the data to the CSV file
    with open(csv_file_path, mode='w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for item in food_data:
            writer.writerow(item)
else:
    print("Failed to retrieve data:", response.status_code, response.text)

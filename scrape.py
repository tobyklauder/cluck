import csv
import requests

# API endpoint for the FoodData Central API
url = "https://api.nal.usda.gov/fdc/v1/foods/search"

# Your API key from the USDA FoodData Central
api_key = "RJUa0EtC0YsMTYMB9pgY8ULAgtUR41ZELFsbKx5W"

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
    csv_file_path = "chicken_nuggets_data.csv"

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

from pymongo import MongoClient
import pandas as pd

# connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")

db = client["agripredict"]
collection = db["farms"]

# fetch data
data = list(collection.find())

print("Records fetched:", len(data))

df = pd.json_normalize(data)

print(df.columns)
print(df.head())
features = df[[
    "soil_data.ph",
    "soil_data.nitrogen",
    "soil_data.phosphorus",
    "soil_data.potassium",
    "sensor_data.temperature",
    "sensor_data.humidity",
    "sensor_data.soil_moisture"
]]

target = df["ai_outputs.predicted_yield"]
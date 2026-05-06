from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

latest_sensor_data = {
    "temperature": 0,
    "humidity": 0,
    "soil_moisture": 0
}

class SensorData(BaseModel):
    temperature: float
    humidity: float
    soil_moisture: int

@router.post("/sensor")
async def receive_sensor_data(data: SensorData):

    global latest_sensor_data

    latest_sensor_data = {
        "temperature": data.temperature,
        "humidity": data.humidity,
        "soil_moisture": data.soil_moisture
    }

    return {
        "message": "Sensor data received"
    }

@router.get("/sensor")
async def get_sensor_data():
    return latest_sensor_data
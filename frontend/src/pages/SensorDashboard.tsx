import { useEffect, useState } from "react";
import { apiClient } from "../api";
import type { SensorResponse } from "../api";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

interface ChartData {
    time: string;
    temperature: number;
    humidity: number;
    soil_moisture: number;
}

export default function SensorDashboard() {

    const [sensorData, setSensorData] = useState<SensorResponse>({
        temperature: 0,
        humidity: 0,
        soil_moisture: 0
    });

    const [chartData, setChartData] = useState<ChartData[]>([]);

    const fetchSensorData = async () => {
        try {

            const data = await apiClient.getSensorData();

            setSensorData(data);

            const currentTime = new Date().toLocaleTimeString();

            setChartData(prev => [
                ...prev.slice(-9),
                {
                    time: currentTime,
                    temperature: data.temperature,
                    humidity: data.humidity,
                    soil_moisture: data.soil_moisture
                }
            ]);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {

        fetchSensorData();

        const interval = setInterval(() => {
            fetchSensorData();
        }, 3000);

        return () => clearInterval(interval);

    }, []);

    const soilStatus =
        sensorData.soil_moisture < 300
            ? "Dry"
            : sensorData.soil_moisture < 700
                ? "Moderate"
                : "Wet";

    return (
        <div className="space-y-8">

            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Sensor Dashboard
                </h1>

                <p className="text-slate-500 mt-2">
                    Real-time farm monitoring system
                </p>
            </div>

            {/* Cards */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                    <p className="text-slate-500">Temperature</p>

                    <h2 className="text-4xl font-bold mt-2">
                        {sensorData.temperature}°C
                    </h2>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                    <p className="text-slate-500">Humidity</p>

                    <h2 className="text-4xl font-bold mt-2">
                        {sensorData.humidity}%
                    </h2>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                    <p className="text-slate-500">Soil Moisture</p>

                    <h2 className="text-4xl font-bold mt-2">
                        {soilStatus}
                    </h2>
                </div>

            </div>

            {/* Chart */}

            <div className="bg-white rounded-2xl p-6 shadow-sm border">

                <h2 className="text-xl font-bold mb-6">
                    Live Sensor Analytics
                </h2>

                <div className="h-[400px]">

                    <ResponsiveContainer width="100%" height="100%">

                        <LineChart data={chartData}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="time" />

                            <YAxis />

                            <Tooltip />

                            <Line
                                type="monotone"
                                dataKey="temperature"
                                stroke="#ef4444"
                                strokeWidth={3}
                            />

                            <Line
                                type="monotone"
                                dataKey="humidity"
                                stroke="#3b82f6"
                                strokeWidth={3}
                            />

                            <Line
                                type="monotone"
                                dataKey="soil_moisture"
                                stroke="#22c55e"
                                strokeWidth={3}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </div>
    );
}
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Thermometer,
  Droplets
} from 'lucide-react';

const Oximeter = () => {
  const [readings, setReadings] = useState([]);
  const [latestReading, setLatestReading] = useState(null);
  const [stats, setStats] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Temperature state
  const [temperatureReadings, setTemperatureReadings] = useState([]);
  const [latestTemperature, setLatestTemperature] = useState(null);
  const [temperatureStats, setTemperatureStats] = useState(null);

  // Fetch latest reading
  const fetchLatestReading = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/oximeter/readings/latest');
      const data = await response.json();
      
      console.log('Latest reading data:', data); // Debug log
      
      if (data.success && data.reading) {
        setLatestReading(data.reading);
        setIsConnected(true);
        setError(null);
        console.log('Updated reading:', data.reading); // Debug log
      } else {
        setIsConnected(false);
        console.log('No reading available'); // Debug log
      }
    } catch (err) {
      console.error('Error fetching latest reading:', err);
      setIsConnected(false);
      setError('Failed to connect to oximeter device');
    }
  };

  // Fetch recent readings
  const fetchRecentReadings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/oximeter/readings?limit=10');
      const data = await response.json();
      
      if (data.success) {
        setReadings(data.readings);
      }
    } catch (err) {
      console.error('Error fetching recent readings:', err);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/oximeter/readings/stats?days=7');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch latest temperature reading
  const fetchLatestTemperature = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/temperature/readings/latest');
      const data = await response.json();
      
      if (data.success && data.reading) {
        setLatestTemperature(data.reading);
        setIsConnected(true);
      }
    } catch (err) {
      console.error('Error fetching latest temperature reading:', err);
    }
  };

  // Fetch recent temperature readings
  const fetchRecentTemperatureReadings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/temperature/readings?limit=10');
      const data = await response.json();
      
      if (data.success) {
        setTemperatureReadings(data.readings);
      }
    } catch (err) {
      console.error('Error fetching recent temperature readings:', err);
    }
  };

  // Fetch temperature statistics
  const fetchTemperatureStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/temperature/readings/stats?days=7');
      const data = await response.json();
      
      if (data.success) {
        setTemperatureStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching temperature stats:', err);
    }
  };

  // Refresh all data
  const refreshData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchLatestReading(),
      fetchRecentReadings(),
      fetchStats(),
      fetchLatestTemperature(),
      fetchRecentTemperatureReadings(),
      fetchTemperatureStats()
    ]);
    setIsLoading(false);
  };

  // Auto-refresh every 2 seconds for more responsive updates
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Get status color based on readings
  const getStatusColor = (heartRate, spo2) => {
    if (!heartRate || !spo2) return 'text-gray-500';
    
    if (heartRate < 60 || heartRate > 100 || spo2 < 95) {
      return 'text-red-500';
    } else if (heartRate >= 60 && heartRate <= 100 && spo2 >= 95) {
      return 'text-green-500';
    } else {
      return 'text-yellow-500';
    }
  };

  // Get status icon
  const getStatusIcon = (heartRate, spo2) => {
    if (!heartRate || !spo2) return AlertCircle;
    
    if (heartRate < 60 || heartRate > 100 || spo2 < 95) {
      return AlertCircle;
    } else if (heartRate >= 60 && heartRate <= 100 && spo2 >= 95) {
      return CheckCircle;
    } else {
      return AlertCircle;
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Health Monitoring</h2>
          <p className="text-gray-600">Real-time heart rate, SpO2, temperature, and humidity monitoring</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Current Reading */}
      {(latestReading || latestTemperature) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Reading</h3>
            {latestReading && (
              <div className="flex items-center space-x-2">
                {React.createElement(getStatusIcon(latestReading.heart_rate, latestReading.spo2), {
                  className: `w-5 h-5 ${getStatusColor(latestReading.heart_rate, latestReading.spo2)}`
                })}
                <span className={`text-sm font-medium ${getStatusColor(latestReading.heart_rate, latestReading.spo2)}`}>
                  {latestReading.finger_detected ? 'Finger Detected' : 'No Finger'}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Heart Rate */}
            {latestReading && (
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Heart Rate</h4>
                <p className="text-3xl font-bold text-gray-900">
                  {latestReading.heart_rate || '--'}
                </p>
                <p className="text-sm text-gray-500">BPM</p>
              </div>
            )}

            {/* SpO2 */}
            {latestReading && (
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">SpO2</h4>
                <p className="text-3xl font-bold text-gray-900">
                  {latestReading.spo2 ? latestReading.spo2.toFixed(1) : '--'}
                </p>
                <p className="text-sm text-gray-500">%</p>
              </div>
            )}

            {/* Temperature */}
            {latestTemperature && (
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Thermometer className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Temperature</h4>
                <p className="text-3xl font-bold text-gray-900">
                  {latestTemperature.temperature ? latestTemperature.temperature.toFixed(1) : '--'}
                </p>
                <p className="text-sm text-gray-500">°C</p>
              </div>
            )}

            {/* Humidity */}
            {latestTemperature && (
              <div className="text-center">
                <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Droplets className="w-8 h-8 text-cyan-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Humidity</h4>
                <p className="text-3xl font-bold text-gray-900">
                  {latestTemperature.humidity ? latestTemperature.humidity.toFixed(1) : '--'}
                </p>
                <p className="text-sm text-gray-500">%</p>
              </div>
            )}
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            {latestReading && latestTemperature && (
              <>Oximeter: {formatTime(latestReading.timestamp)} | Temperature: {formatTime(latestTemperature.timestamp)}</>
            )}
            {latestReading && !latestTemperature && (
              <>Last updated: {formatTime(latestReading.timestamp)}</>
            )}
            {latestTemperature && !latestReading && (
              <>Last updated: {formatTime(latestTemperature.timestamp)}</>
            )}
          </div>
        </motion.div>
      )}

      {/* Statistics */}
      {(stats || temperatureStats) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Oximeter Statistics */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Oximeter - 7-Day Statistics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Avg Heart Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgHeartRate || '--'}</p>
                  <p className="text-xs text-gray-500">BPM</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Avg SpO2</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgSpO2 || '--'}</p>
                  <p className="text-xs text-gray-500">%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Readings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalReadings || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Valid Readings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.validReadings || 0}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Temperature Statistics */}
          {temperatureStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature & Humidity - 7-Day Statistics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Avg Temperature</p>
                  <p className="text-2xl font-bold text-gray-900">{temperatureStats.avgTemperature || '--'}</p>
                  <p className="text-xs text-gray-500">°C</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Avg Humidity</p>
                  <p className="text-2xl font-bold text-gray-900">{temperatureStats.avgHumidity || '--'}</p>
                  <p className="text-xs text-gray-500">%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Min Temp</p>
                  <p className="text-2xl font-bold text-gray-900">{temperatureStats.minTemperature || '--'}</p>
                  <p className="text-xs text-gray-500">°C</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Max Temp</p>
                  <p className="text-2xl font-bold text-gray-900">{temperatureStats.maxTemperature || '--'}</p>
                  <p className="text-xs text-gray-500">°C</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Recent Readings */}
      {(readings.length > 0 || temperatureReadings.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Oximeter Readings */}
          {readings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Oximeter Readings</h3>
              
              <div className="space-y-3">
                {readings.slice(0, 5).map((reading, index) => (
                  <div
                    key={reading.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        reading.finger_detected ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          HR: {reading.heart_rate || '--'} BPM | SpO2: {reading.spo2 ? reading.spo2.toFixed(1) : '--'}%
                        </p>
                        <p className="text-xs text-gray-500">{formatTime(reading.timestamp)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {reading.heart_rate && reading.spo2 && (
                        <>
                          {reading.heart_rate >= 60 && reading.heart_rate <= 100 && reading.spo2 >= 95 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent Temperature Readings */}
          {temperatureReadings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Temperature Readings</h3>
              
              <div className="space-y-3">
                {temperatureReadings.slice(0, 5).map((reading, index) => (
                  <div
                    key={reading.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Temp: {reading.temperature ? reading.temperature.toFixed(1) : '--'}°C | 
                          Humidity: {reading.humidity ? reading.humidity.toFixed(1) : '--'}%
                        </p>
                        <p className="text-xs text-gray-500">{formatTime(reading.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* No Data State */}
      {!latestReading && !latestTemperature && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Sensor Data</h3>
          <p className="text-gray-600 mb-4">
            Connect your ESP32 device to start monitoring your heart rate, SpO2, temperature, and humidity.
          </p>
          <button
            onClick={refreshData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Check Connection
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Oximeter;


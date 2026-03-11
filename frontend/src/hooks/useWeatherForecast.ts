import { useQuery } from '@tanstack/react-query';

interface WeatherCondition {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: string;
  precipitationProbability: number;
}

interface WeatherAlert {
  severity: 'low' | 'moderate' | 'high';
  type: string;
  description: string;
}

interface WeatherData {
  current: WeatherCondition;
  forecast: DailyForecast[];
  alerts: WeatherAlert[];
}

const getWeatherIcon = (code: number): string => {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '☁️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '🌨️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '🌨️';
  return '⛈️';
};

const getConditionText = (code: number): string => {
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 48) return 'Cloudy';
  if (code <= 67) return 'Rainy';
  if (code <= 77) return 'Snowy';
  if (code <= 82) return 'Showers';
  if (code <= 86) return 'Snow Showers';
  return 'Thunderstorm';
};

export function useWeatherForecast(lat: number, lng: number) {
  return useQuery<WeatherData>({
    queryKey: ['weather', lat, lng],
    queryFn: async () => {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=5`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();

      const current: WeatherCondition = {
        temperature: Math.round(data.current.temperature_2m),
        condition: getConditionText(data.current.weather_code),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        icon: getWeatherIcon(data.current.weather_code),
      };

      const forecast: DailyForecast[] = data.daily.time.map((date: string, index: number) => ({
        date,
        tempMax: Math.round(data.daily.temperature_2m_max[index]),
        tempMin: Math.round(data.daily.temperature_2m_min[index]),
        condition: getConditionText(data.daily.weather_code[index]),
        icon: getWeatherIcon(data.daily.weather_code[index]),
        precipitationProbability: data.daily.precipitation_probability_max[index] || 0,
      }));

      const alerts: WeatherAlert[] = [];
      
      if (data.current.wind_speed_10m > 50) {
        alerts.push({
          severity: 'high',
          type: 'High Wind',
          description: 'Strong winds expected. Exercise caution when traveling.',
        });
      } else if (data.current.wind_speed_10m > 30) {
        alerts.push({
          severity: 'moderate',
          type: 'Moderate Wind',
          description: 'Moderate winds. Be aware of changing conditions.',
        });
      }

      const maxPrecip = Math.max(...data.daily.precipitation_probability_max.slice(0, 3));
      if (maxPrecip > 70) {
        alerts.push({
          severity: 'moderate',
          type: 'Heavy Rain Expected',
          description: 'High chance of precipitation in the coming days. Plan accordingly.',
        });
      }

      if (data.current.temperature_2m > 35) {
        alerts.push({
          severity: 'moderate',
          type: 'High Temperature',
          description: 'Very hot conditions. Stay hydrated and avoid prolonged sun exposure.',
        });
      } else if (data.current.temperature_2m < -10) {
        alerts.push({
          severity: 'moderate',
          type: 'Extreme Cold',
          description: 'Very cold conditions. Dress warmly and limit outdoor exposure.',
        });
      }

      return { current, forecast, alerts };
    },
    staleTime: 10 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
  });
}

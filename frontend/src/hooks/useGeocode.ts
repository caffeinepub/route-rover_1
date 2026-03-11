import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

interface GeocodeResult {
  name: string;
  lat: number;
  lng: number;
  country: string;
}

export function useGeocode(cityName: string) {
  const [debouncedCity, setDebouncedCity] = useState(cityName);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCity(cityName);
    }, 500);

    return () => clearTimeout(timer);
  }, [cityName]);

  return useQuery<GeocodeResult | null>({
    queryKey: ['geocode', debouncedCity],
    queryFn: async () => {
      if (!debouncedCity || debouncedCity.length < 2) {
        return null;
      }

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(debouncedCity)}&format=json&limit=1`
      );

      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();

      if (data.length === 0) {
        return null;
      }

      return {
        name: data[0].display_name.split(',')[0],
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        country: data[0].display_name.split(',').slice(-1)[0].trim(),
      };
    },
    enabled: debouncedCity.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}

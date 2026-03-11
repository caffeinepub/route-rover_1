import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { useDestination } from '../contexts/DestinationContext';
import { calculateDistance } from '../utils/distance';
import { formatDistance } from '../utils/format';
import { DESTINATIONS } from '../data/destinations';

const PRESET_ORIGINS = [
  { name: 'London', coordinates: { lat: 51.5074, lng: -0.1278 } },
  { name: 'Berlin', coordinates: { lat: 52.5200, lng: 13.4050 } },
  { name: 'Madrid', coordinates: { lat: 40.4168, lng: -3.7038 } },
  { name: 'Los Angeles', coordinates: { lat: 34.0522, lng: -118.2437 } },
  { name: 'Singapore', coordinates: { lat: 1.3521, lng: 103.8198 } },
];

export default function MapDistanceView() {
  const { selectedDestination, origin, setOrigin, setSelectedDestination } = useDestination();
  const [mapError, setMapError] = useState(false);
  const [selectedOriginPreset, setSelectedOriginPreset] = useState(PRESET_ORIGINS[0].name);
  const [selectedDestPreset, setSelectedDestPreset] = useState(selectedDestination?.id || DESTINATIONS[0].id);

  useEffect(() => {
    const preset = PRESET_ORIGINS.find(p => p.name === selectedOriginPreset);
    if (preset) {
      setOrigin(preset);
    }
  }, [selectedOriginPreset, setOrigin]);

  useEffect(() => {
    const dest = DESTINATIONS.find(d => d.id === selectedDestPreset);
    if (dest) {
      setSelectedDestination(dest);
    }
  }, [selectedDestPreset, setSelectedDestination]);

  const distance = origin && selectedDestination
    ? calculateDistance(
        origin.coordinates.lat,
        origin.coordinates.lng,
        selectedDestination.coordinates.lat,
        selectedDestination.coordinates.lng
      )
    : 0;

  const mapUrl = origin && selectedDestination
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${Math.min(origin.coordinates.lng, selectedDestination.coordinates.lng) - 5},${Math.min(origin.coordinates.lat, selectedDestination.coordinates.lat) - 5},${Math.max(origin.coordinates.lng, selectedDestination.coordinates.lng) + 5},${Math.max(origin.coordinates.lat, selectedDestination.coordinates.lat) + 5}&layer=mapnik&marker=${origin.coordinates.lat},${origin.coordinates.lng}&marker=${selectedDestination.coordinates.lat},${selectedDestination.coordinates.lng}`
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
          Map & Distance
        </h2>
        <p className="text-muted-foreground">
          Calculate distances between locations
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <Card className="border-2 border-amber-200/50 dark:border-amber-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              Route Settings
            </CardTitle>
            <CardDescription>Select your origin and destination</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Origin Selection */}
            <div className="space-y-2">
              <Label>Origin</Label>
              <Select value={selectedOriginPreset} onValueChange={setSelectedOriginPreset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_ORIGINS.map(preset => (
                    <SelectItem key={preset.name} value={preset.name}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {origin && (
                <p className="text-xs text-muted-foreground">
                  Coordinates: {origin.coordinates.lat.toFixed(4)}, {origin.coordinates.lng.toFixed(4)}
                </p>
              )}
            </div>

            {/* Destination Selection */}
            <div className="space-y-2">
              <Label>Destination</Label>
              <Select value={selectedDestPreset} onValueChange={setSelectedDestPreset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DESTINATIONS.map(dest => (
                    <SelectItem key={dest.id} value={dest.id}>
                      {dest.name}, {dest.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDestination && (
                <p className="text-xs text-muted-foreground">
                  Coordinates: {selectedDestination.coordinates.lat.toFixed(4)}, {selectedDestination.coordinates.lng.toFixed(4)}
                </p>
              )}
            </div>

            {/* Distance Display */}
            {distance > 0 && (
              <div className="rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950 dark:to-orange-950 p-6 text-center">
                <div className="mb-2 text-sm font-medium text-amber-800 dark:text-amber-200">
                  Total Distance
                </div>
                <div className="text-4xl font-bold text-amber-900 dark:text-amber-100">
                  {formatDistance(distance)} km
                </div>
                <div className="mt-2 text-xs text-amber-700 dark:text-amber-300">
                  Straight-line distance between locations
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map Display */}
        <Card className="border-2 border-orange-200/50 dark:border-orange-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              Interactive Map
            </CardTitle>
            <CardDescription>View your route on the map</CardDescription>
          </CardHeader>
          <CardContent>
            {mapUrl && !mapError ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <iframe
                  title="Route Map"
                  src={mapUrl}
                  className="h-full w-full border-0"
                  onError={() => setMapError(true)}
                />
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {mapError
                    ? 'Map could not be loaded. Distance calculation is still available above.'
                    : 'Select origin and destination to view the map.'}
                </AlertDescription>
              </Alert>
            )}

            {origin && selectedDestination && (
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="font-medium">Origin:</span>
                  <span className="text-muted-foreground">{origin.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="font-medium">Destination:</span>
                  <span className="text-muted-foreground">
                    {selectedDestination.name}, {selectedDestination.country}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

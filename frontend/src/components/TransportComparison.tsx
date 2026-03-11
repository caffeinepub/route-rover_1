import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Train, Bus, Plane, Leaf, Clock, DollarSign } from 'lucide-react';
import { useDestination } from '../contexts/DestinationContext';
import { useGeocode } from '../hooks/useGeocode';
import { calculateDistance } from '../utils/distance';
import { formatCurrency } from '../utils/format';
import { DESTINATIONS } from '../data/destinations';

interface TransportOption {
  type: string;
  icon: React.ReactNode;
  duration: string;
  cost: number;
  comfort: number;
  ecoFriendly: boolean;
  available: boolean;
}

const PRESET_ORIGINS = [
  { name: 'London', coordinates: { lat: 51.5074, lng: -0.1278 } },
  { name: 'Berlin', coordinates: { lat: 52.5200, lng: 13.4050 } },
  { name: 'Madrid', coordinates: { lat: 40.4168, lng: -3.7038 } },
  { name: 'Los Angeles', coordinates: { lat: 34.0522, lng: -118.2437 } },
  { name: 'Singapore', coordinates: { lat: 1.3521, lng: 103.8198 } },
];

export default function TransportComparison() {
  const { selectedDestination, origin, setOrigin } = useDestination();
  const [originInput, setOriginInput] = useState('');
  const [usePreset, setUsePreset] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState(PRESET_ORIGINS[0].name);

  const { data: geocodeResult } = useGeocode(originInput);

  useEffect(() => {
    if (usePreset) {
      const preset = PRESET_ORIGINS.find(p => p.name === selectedPreset);
      if (preset) {
        setOrigin(preset);
      }
    } else if (geocodeResult) {
      setOrigin({
        name: geocodeResult.name,
        coordinates: { lat: geocodeResult.lat, lng: geocodeResult.lng },
      });
    }
  }, [usePreset, selectedPreset, geocodeResult, setOrigin]);

  const distance = origin && selectedDestination
    ? calculateDistance(
        origin.coordinates.lat,
        origin.coordinates.lng,
        selectedDestination.coordinates.lat,
        selectedDestination.coordinates.lng
      )
    : 0;

  const calculateOptions = (): TransportOption[] => {
    if (!distance) return [];

    const carDuration = Math.round(distance / 80);
    const trainDuration = Math.round(distance / 120);
    const busDuration = Math.round(distance / 70);
    const planeDuration = Math.round(distance / 700 + 2);

    return [
      {
        type: 'Car',
        icon: <Car className="h-6 w-6" />,
        duration: `${carDuration}h`,
        cost: distance * 0.15,
        comfort: 3,
        ecoFriendly: false,
        available: distance < 2000,
      },
      {
        type: 'Train',
        icon: <Train className="h-6 w-6" />,
        duration: `${trainDuration}h`,
        cost: distance * 0.12,
        comfort: 4,
        ecoFriendly: true,
        available: distance < 3000,
      },
      {
        type: 'Bus',
        icon: <Bus className="h-6 w-6" />,
        duration: `${busDuration}h`,
        cost: distance * 0.08,
        comfort: 2,
        ecoFriendly: false,
        available: distance < 1500,
      },
      {
        type: 'Plane',
        icon: <Plane className="h-6 w-6" />,
        duration: `${planeDuration}h`,
        cost: distance * 0.20,
        comfort: 4,
        ecoFriendly: false,
        available: distance > 300,
      },
    ].filter(option => option.available);
  };

  const options = calculateOptions();

  const fastestOption = options.reduce((prev, curr) => 
    parseInt(prev.duration) < parseInt(curr.duration) ? prev : curr
  , options[0]);

  const cheapestOption = options.reduce((prev, curr) => 
    prev.cost < curr.cost ? prev : curr
  , options[0]);

  const ecoOption = options.find(opt => opt.ecoFriendly);

  return (
    <Card className="border-2 border-orange-200/50 dark:border-orange-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bus className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          Transport Comparison
        </CardTitle>
        <CardDescription>
          Compare travel options from your origin to {selectedDestination?.name || 'destination'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Origin Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Origin:</Label>
            <div className="flex gap-2">
              <button
                className={`rounded-md px-3 py-1 text-sm transition-colors ${
                  usePreset
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setUsePreset(true)}
              >
                Preset
              </button>
              <button
                className={`rounded-md px-3 py-1 text-sm transition-colors ${
                  !usePreset
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setUsePreset(false)}
              >
                Custom
              </button>
            </div>
          </div>

          {usePreset ? (
            <Select value={selectedPreset} onValueChange={setSelectedPreset}>
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
          ) : (
            <Input
              placeholder="Enter city name..."
              value={originInput}
              onChange={(e) => setOriginInput(e.target.value)}
            />
          )}
        </div>

        {/* Quick Summary */}
        {options.length > 0 && (
          <div className="rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950 dark:to-amber-950 p-4">
            <h3 className="mb-2 font-semibold text-orange-900 dark:text-orange-100">Quick Comparison</h3>
            <div className="space-y-1 text-sm text-orange-800 dark:text-orange-200">
              <p>Fastest: {fastestOption.type} ({fastestOption.duration})</p>
              <p>Cheapest: {cheapestOption.type} ({formatCurrency(cheapestOption.cost)})</p>
              {ecoOption && <p>Eco-friendly: {ecoOption.type}</p>}
            </div>
          </div>
        )}

        {/* Transport Options */}
        <div className="grid gap-4 md:grid-cols-2">
          {options.map((option) => {
            const isFastest = option.type === fastestOption.type;
            const isCheapest = option.type === cheapestOption.type;
            const isEco = option.ecoFriendly;

            return (
              <div
                key={option.type}
                className="rounded-lg border-2 border-orange-200/50 dark:border-orange-800/50 p-4 transition-all hover:shadow-lg"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-orange-600 dark:text-orange-400">{option.icon}</div>
                    <span className="font-semibold">{option.type}</span>
                  </div>
                  <div className="flex gap-1">
                    {isFastest && (
                      <Badge className="bg-amber-600 hover:bg-amber-700">
                        <Clock className="mr-1 h-3 w-3" />
                        Fastest
                      </Badge>
                    )}
                    {isCheapest && (
                      <Badge className="bg-orange-600 hover:bg-orange-700">
                        <DollarSign className="mr-1 h-3 w-3" />
                        Cheapest
                      </Badge>
                    )}
                    {isEco && (
                      <Badge className="bg-green-600 hover:bg-green-700">
                        <Leaf className="mr-1 h-3 w-3" />
                        Eco
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{option.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Cost:</span>
                    <span className="font-medium">{formatCurrency(option.cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Comfort:</span>
                    <span className="font-medium">{'⭐'.repeat(option.comfort)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {options.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Select an origin to see transport options
          </p>
        )}
      </CardContent>
    </Card>
  );
}

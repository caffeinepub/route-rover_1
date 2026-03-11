import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DESTINATIONS, Destination } from '../data/destinations';
import { useDestination } from '../contexts/DestinationContext';
import { MapPin, Sun, Snowflake, Leaf, Flower, Check } from 'lucide-react';

const getSeasonIcon = (season: string) => {
  switch (season) {
    case 'spring':
      return <Flower className="h-4 w-4" />;
    case 'summer':
      return <Sun className="h-4 w-4" />;
    case 'fall':
      return <Leaf className="h-4 w-4" />;
    case 'winter':
      return <Snowflake className="h-4 w-4" />;
    default:
      return <Sun className="h-4 w-4" />;
  }
};

export default function PopularDestinations() {
  const { selectedDestination, setSelectedDestination } = useDestination();
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const regions = ['all', ...Array.from(new Set(DESTINATIONS.map(d => d.region)))];

  const filteredDestinations = DESTINATIONS.filter(dest => 
    filterRegion === 'all' || dest.region === filterRegion
  );

  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'country') return a.country.localeCompare(b.country);
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
            Popular Destinations
          </h2>
          <p className="text-muted-foreground">
            Discover amazing places around the world
          </p>
        </div>

        <div className="flex gap-2">
          <Select value={filterRegion} onValueChange={setFilterRegion}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <SelectItem key={region} value={region}>
                  {region === 'all' ? 'All Regions' : region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="country">Country</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedDestinations.map((destination) => {
          const isSelected = selectedDestination?.id === destination.id;

          return (
            <Card 
              key={destination.id} 
              className={`group overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
                isSelected ? 'ring-2 ring-amber-500 dark:ring-amber-400' : ''
              }`}
              onClick={() => setSelectedDestination(destination)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedDestination(destination);
                }
              }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {isSelected && (
                  <Badge className="absolute right-3 top-3 bg-amber-600 hover:bg-amber-700">
                    <Check className="mr-1 h-3 w-3" />
                    Selected
                  </Badge>
                )}
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="text-xl font-bold">{destination.name}</h3>
                  <p className="text-sm opacity-90">{destination.country}</p>
                </div>
              </div>
              <CardHeader>
                <CardDescription className="line-clamp-2">
                  {destination.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {getSeasonIcon(destination.season)}
                  <span>Best time: {destination.bestTime}</span>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Top Attractions:</p>
                  <div className="flex flex-wrap gap-1">
                    {destination.highlights.slice(0, 3).map(highlight => (
                      <Badge key={highlight} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDestination(destination);
                  }}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {isSelected ? 'Selected' : 'Select Destination'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Hotel, Star, MapPin, DollarSign, Wifi, Coffee, Car } from 'lucide-react';

interface HotelSuggestionsProps {
  destination: string;
}

interface Hotel {
  id: string;
  name: string;
  rating: number;
  price: number;
  distance: number;
  amenities: string[];
  image: string;
  reviews: number;
}

export default function HotelSuggestions({ destination }: HotelSuggestionsProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockHotels: Hotel[] = [
        {
          id: '1',
          name: 'Grand Plaza Hotel',
          rating: 4.8,
          price: 150,
          distance: 0.5,
          amenities: ['WiFi', 'Parking', 'Breakfast'],
          image: '/assets/generated/destination-grid.dim_800x600.png',
          reviews: 1250,
        },
        {
          id: '2',
          name: 'City Center Inn',
          rating: 4.5,
          price: 95,
          distance: 1.2,
          amenities: ['WiFi', 'Breakfast'],
          image: '/assets/generated/travel-hero.dim_1200x600.png',
          reviews: 890,
        },
        {
          id: '3',
          name: 'Luxury Suites',
          rating: 4.9,
          price: 220,
          distance: 0.8,
          amenities: ['WiFi', 'Parking', 'Breakfast', 'Pool'],
          image: '/assets/generated/world-map-destinations.dim_800x600.png',
          reviews: 2100,
        },
      ];
      
      setHotels(mockHotels);
      setLoading(false);
    };

    fetchHotels();
  }, [destination]);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'parking':
        return <Car className="h-4 w-4" />;
      case 'breakfast':
        return <Coffee className="h-4 w-4" />;
      default:
        return <Hotel className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Stay & Book</CardTitle>
          <CardDescription>Loading hotel suggestions for {destination}...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Stay & Book in {destination}</CardTitle>
            <CardDescription>Nearby hotels and accommodations</CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            {hotels.length} Available
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden border-2 transition-all hover:shadow-lg">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Hotel Image */}
                <div className="relative h-48 overflow-hidden md:h-auto">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name}
                    className="h-full w-full object-cover"
                  />
                  <Badge className="absolute right-2 top-2 bg-white/90 text-black">
                    <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
                    {hotel.rating}
                  </Badge>
                </div>

                {/* Hotel Details */}
                <div className="col-span-2 p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{hotel.name}</h3>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {hotel.distance} km from center
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        ${hotel.price}
                      </div>
                      <div className="text-xs text-muted-foreground">per night</div>
                    </div>
                  </div>

                  <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    {hotel.rating} ({hotel.reviews.toLocaleString()} reviews)
                  </div>

                  {/* Amenities */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {hotel.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Hotel className="mr-2 h-4 w-4" />
                      Book Now
                    </Button>
                    <Button variant="outline">View Details</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filter Options */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <DollarSign className="mr-2 h-4 w-4" />
            Price Range
          </Button>
          <Button variant="outline" size="sm">
            <Star className="mr-2 h-4 w-4" />
            Rating
          </Button>
          <Button variant="outline" size="sm">
            <MapPin className="mr-2 h-4 w-4" />
            Distance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

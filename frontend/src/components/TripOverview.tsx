import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  imageUrl: string;
}

interface TripOverviewProps {
  trip: Trip;
}

export default function TripOverview({ trip }: TripOverviewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDuration = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg">
        <img
          src={trip.imageUrl}
          alt={trip.destination}
          className="h-64 w-full object-cover"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 text-blue-500" />
            <div>
              <p className="font-medium">Destination</p>
              <p className="text-muted-foreground">{trip.destination}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="mt-1 h-5 w-5 text-purple-500" />
            <div>
              <p className="font-medium">Dates</p>
              <p className="text-muted-foreground">
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="mt-1 h-5 w-5 text-pink-500" />
            <div>
              <p className="font-medium">Duration</p>
              <p className="text-muted-foreground">
                {getDuration()} {getDuration() === 1 ? 'day' : 'days'}
              </p>
            </div>
          </div>

          {trip.description && (
            <div>
              <p className="font-medium mb-2">Description</p>
              <p className="text-muted-foreground">{trip.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

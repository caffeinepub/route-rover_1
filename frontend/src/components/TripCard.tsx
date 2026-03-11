import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Trash2, ChevronRight } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import TripDetailsDialog from './TripDetailsDialog';

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  imageUrl: string;
}

interface TripCardProps {
  trip: Trip;
  onDelete: (tripId: string) => void;
  onSelect: (trip: Trip) => void;
  defaultView?: 'overview' | 'budget' | 'notes';
}

export default function TripCard({ trip, onDelete, onSelect, defaultView }: TripCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntil = () => {
    const start = new Date(trip.startDate);
    const today = new Date();
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntil();
  const isUpcoming = daysUntil > 0;
  const isPast = daysUntil < 0;

  return (
    <>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative h-48 overflow-hidden">
          <img
            src={trip.imageUrl}
            alt={trip.destination}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-xl font-bold text-white">{trip.name}</h3>
          </div>
          {isUpcoming && daysUntil <= 30 && (
            <Badge className="absolute right-3 top-3 bg-blue-500">
              {daysUntil} days
            </Badge>
          )}
          {isPast && (
            <Badge className="absolute right-3 top-3 bg-gray-500">
              Past
            </Badge>
          )}
        </div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {trip.destination}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </div>
            </div>
          </div>
          {trip.description && (
            <CardDescription className="line-clamp-2">
              {trip.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowDetails(true)}
          >
            View Details
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Trip</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{trip.name}"? This action cannot be undone and will remove all associated expenses and notes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(trip.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <TripDetailsDialog
        trip={trip}
        open={showDetails}
        onOpenChange={setShowDetails}
        defaultView={defaultView}
      />
    </>
  );
}

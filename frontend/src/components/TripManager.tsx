import { useState } from 'react';
import { UserProfile } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateTripDialog from './CreateTripDialog';
import TripCard from './TripCard';
import { useLocalStorage } from 'react-use';

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  imageUrl: string;
}

interface TripManagerProps {
  userProfile: UserProfile;
  defaultView?: 'overview' | 'budget' | 'notes';
}

export default function TripManager({ userProfile, defaultView = 'overview' }: TripManagerProps) {
  const [trips, setTrips] = useLocalStorage<Trip[]>('trips', []);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const handleCreateTrip = (trip: Trip) => {
    setTrips([...(trips || []), trip]);
    setIsCreateDialogOpen(false);
  };

  const handleDeleteTrip = (tripId: string) => {
    setTrips((trips || []).filter(t => t.id !== tripId));
    if (selectedTrip?.id === tripId) {
      setSelectedTrip(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">My Trips</h2>
          <p className="text-muted-foreground">Plan and manage your travel adventures</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Trip
        </Button>
      </div>

      {/* Trips Grid */}
      {!trips || trips.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center py-12">
            <CardTitle>No trips yet</CardTitle>
            <CardDescription>
              Create your first trip to start planning your adventure
            </CardDescription>
            <div className="pt-4">
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                variant="outline"
                size="lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Trip
              </Button>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              onDelete={handleDeleteTrip}
              onSelect={setSelectedTrip}
              defaultView={defaultView}
            />
          ))}
        </div>
      )}

      <CreateTripDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateTrip={handleCreateTrip}
        userProfile={userProfile}
      />
    </div>
  );
}

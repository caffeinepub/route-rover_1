import { useState } from 'react';
import { UserProfile } from '../backend';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  imageUrl: string;
}

interface CreateTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTrip: (trip: Trip) => void;
  userProfile: UserProfile;
}

const DESTINATION_IMAGES: Record<string, string> = {
  'Paris': '/assets/generated/destination-grid.dim_800x600.png',
  'Tokyo': '/assets/generated/world-map-destinations.dim_800x600.png',
  'Bali': '/assets/generated/travel-hero.dim_1200x600.png',
  'New York': '/assets/generated/dashboard-mockup.dim_1200x800.png',
  'London': '/assets/generated/destination-grid.dim_800x600.png',
  'default': '/assets/generated/world-map-destinations.dim_800x600.png',
};

export default function CreateTripDialog({ open, onOpenChange, onCreateTrip, userProfile }: CreateTripDialogProps) {
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trip: Trip = {
      id: `trip-${Date.now()}`,
      name: name.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      description: description.trim(),
      imageUrl: DESTINATION_IMAGES[destination] || DESTINATION_IMAGES.default,
    };

    onCreateTrip(trip);
    
    // Reset form
    setName('');
    setDestination('');
    setStartDate('');
    setEndDate('');
    setDescription('');
  };

  const suggestedDestinations = userProfile.preferredDestinations.length > 0
    ? userProfile.preferredDestinations
    : ['Paris', 'Tokyo', 'Bali', 'New York', 'London', 'Rome', 'Barcelona', 'Dubai'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Trip</DialogTitle>
          <DialogDescription>
            Plan your next adventure by filling in the details below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Trip Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Summer Vacation 2025"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <Select value={destination} onValueChange={setDestination} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {suggestedDestinations.map(dest => (
                    <SelectItem key={dest} value={dest}>
                      {dest}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you planning to do on this trip?"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={!name.trim() || !destination || !startDate || !endDate}
            >
              Create Trip
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Info, Wallet, FileText } from 'lucide-react';
import TripOverview from './TripOverview';
import TripBudget from './TripBudget';
import TripNotes from './TripNotes';

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  imageUrl: string;
}

interface TripDetailsDialogProps {
  trip: Trip;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultView?: 'overview' | 'budget' | 'notes';
}

export default function TripDetailsDialog({ trip, open, onOpenChange, defaultView = 'overview' }: TripDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState(defaultView);

  const handleTabChange = (value: string) => {
    if (value === 'overview' || value === 'budget' || value === 'notes') {
      setActiveTab(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{trip.name}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="gap-2">
              <Info className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="budget" className="gap-2">
              <Wallet className="h-4 w-4" />
              Budget
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] pr-4">
            <TabsContent value="overview" className="space-y-4">
              <TripOverview trip={trip} />
            </TabsContent>

            <TabsContent value="budget" className="space-y-4">
              <TripBudget tripId={trip.id} />
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <TripNotes tripId={trip.id} />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

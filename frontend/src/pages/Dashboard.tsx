import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Wallet, FileText, Compass, Map, MessageSquare } from 'lucide-react';
import Header from '../components/Header';
import TripManager from '../components/TripManager';
import DestinationExplorer from '../components/DestinationExplorer';
import WeatherWidget from '../components/WeatherWidget';
import TransportComparison from '../components/TransportComparison';
import MapDistanceView from '../components/MapDistanceView';
import ChatAssistant from '../components/ChatAssistant';

export default function Dashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const [activeTab, setActiveTab] = useState('trips');

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/login' });
    }
  }, [identity, navigate]);

  if (!identity || profileLoading || !userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
            Welcome back, {userProfile.name}!
          </h1>
          <p className="text-muted-foreground">
            Plan your next adventure with real-time insights
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <TabsTrigger value="trips" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Trips</span>
            </TabsTrigger>
            <TabsTrigger value="destinations" className="flex items-center gap-2">
              <Compass className="h-4 w-4" />
              <span className="hidden sm:inline">Destinations</span>
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <Compass className="h-4 w-4" />
              <span className="hidden sm:inline">Weather</span>
            </TabsTrigger>
            <TabsTrigger value="transport" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Transport</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Map</span>
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Assistant</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trips" className="space-y-6">
            <TripManager userProfile={userProfile} />
          </TabsContent>

          <TabsContent value="destinations" className="space-y-6">
            <DestinationExplorer userProfile={userProfile} />
          </TabsContent>

          <TabsContent value="weather" className="space-y-6">
            <WeatherWidget />
          </TabsContent>

          <TabsContent value="transport" className="space-y-6">
            <TransportComparison />
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <MapDistanceView />
          </TabsContent>

          <TabsContent value="assistant" className="space-y-6">
            <ChatAssistant />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

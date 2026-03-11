import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Navigation, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

interface TrafficVisualizationProps {
  destination: string;
}

interface TrafficData {
  congestionLevel: 'low' | 'medium' | 'high';
  averageSpeed: number;
  incidents: number;
  estimatedDelay: number;
  routes: Array<{
    name: string;
    duration: number;
    distance: number;
    traffic: 'light' | 'moderate' | 'heavy';
  }>;
}

export default function TrafficVisualization({ destination }: TrafficVisualizationProps) {
  const [traffic, setTraffic] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraffic = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTraffic: TrafficData = {
        congestionLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        averageSpeed: Math.floor(Math.random() * 40) + 30,
        incidents: Math.floor(Math.random() * 5),
        estimatedDelay: Math.floor(Math.random() * 20),
        routes: [
          { name: 'Main Route', duration: 45, distance: 32, traffic: 'light' },
          { name: 'Scenic Route', duration: 55, distance: 38, traffic: 'moderate' },
          { name: 'Highway Route', duration: 40, distance: 35, traffic: 'heavy' },
        ],
      };
      
      setTraffic(mockTraffic);
      setLoading(false);
    };

    fetchTraffic();
  }, [destination]);

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTrafficColor = (traffic: string) => {
    switch (traffic) {
      case 'light':
        return 'text-green-600';
      case 'moderate':
        return 'text-yellow-600';
      case 'heavy':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Traffic & Routes</CardTitle>
          <CardDescription>Loading traffic data for {destination}...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!traffic) return null;

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Traffic & Routes to {destination}</CardTitle>
            <CardDescription>Real-time traffic conditions and route optimization</CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Traffic Overview */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border-2 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${getCongestionColor(traffic.congestionLevel)}`} />
              <span className="text-sm text-muted-foreground">Congestion</span>
            </div>
            <div className="text-2xl font-bold capitalize">{traffic.congestionLevel}</div>
          </div>

          <div className="rounded-lg border-2 p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Avg Speed</span>
            </div>
            <div className="text-2xl font-bold">{traffic.averageSpeed} km/h</div>
          </div>

          <div className="rounded-lg border-2 p-4">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Incidents</span>
            </div>
            <div className="text-2xl font-bold">{traffic.incidents}</div>
          </div>

          <div className="rounded-lg border-2 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Delay</span>
            </div>
            <div className="text-2xl font-bold">{traffic.estimatedDelay} min</div>
          </div>
        </div>

        {/* Route Options */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Available Routes</h3>
          <div className="space-y-3">
            {traffic.routes.map((route, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border-2 p-4 transition-all hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <Navigation className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="font-semibold">{route.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {route.distance} km • {route.duration} min
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className={getTrafficColor(route.traffic)}>
                  {route.traffic} traffic
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Alerts */}
        {traffic.incidents > 0 && (
          <Alert className="mt-6" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {traffic.incidents} traffic incident{traffic.incidents > 1 ? 's' : ''} reported on your route
            </AlertDescription>
          </Alert>
        )}

        {/* Map Placeholder */}
        <div className="mt-6 overflow-hidden rounded-lg border-2">
          <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Navigation className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Interactive map visualization</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

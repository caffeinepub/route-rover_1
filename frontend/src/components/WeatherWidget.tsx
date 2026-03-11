import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Cloud, Droplets, Wind, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useDestination } from '../contexts/DestinationContext';
import { useWeatherForecast } from '../hooks/useWeatherForecast';

export default function WeatherWidget() {
  const { selectedDestination } = useDestination();

  const { data: weather, isLoading, error } = useWeatherForecast(
    selectedDestination?.coordinates.lat || 48.8566,
    selectedDestination?.coordinates.lng || 2.3522
  );

  if (isLoading) {
    return (
      <Card className="border-2 border-amber-200/50 dark:border-amber-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            Weather Forecast
          </CardTitle>
          <CardDescription>
            Loading weather data for {selectedDestination?.name || 'Paris'}...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-amber-200/50 dark:border-amber-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Unable to load weather data. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-rose-600 hover:bg-rose-700';
      case 'moderate':
        return 'bg-orange-600 hover:bg-orange-700';
      default:
        return 'bg-amber-600 hover:bg-amber-700';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'moderate':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-2 border-amber-200/50 dark:border-amber-800/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          Weather Forecast
        </CardTitle>
        <CardDescription>
          Current conditions for {selectedDestination?.name || 'Paris'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Weather */}
        <div className="rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950 dark:to-orange-950 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-5xl font-bold text-amber-900 dark:text-amber-100">
                {weather.current.temperature}°C
              </div>
              <div className="mt-2 text-lg text-amber-800 dark:text-amber-200">
                {weather.current.condition}
              </div>
            </div>
            <div className="text-6xl">{weather.current.icon}</div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <Droplets className="h-5 w-5" />
              <span>{weather.current.humidity}% Humidity</span>
            </div>
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <Wind className="h-5 w-5" />
              <span>{weather.current.windSpeed} km/h Wind</span>
            </div>
          </div>
        </div>

        {/* Weather Alerts */}
        {weather.alerts.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">Weather Alerts</h3>
            {weather.alerts.map((alert, index) => (
              <Alert key={index} className="border-l-4" style={{ borderLeftColor: alert.severity === 'high' ? '#dc2626' : alert.severity === 'moderate' ? '#ea580c' : '#f59e0b' }}>
                <div className="flex items-start gap-2">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <AlertTitle className="text-sm font-semibold">
                      {alert.type}
                    </AlertTitle>
                    <AlertDescription className="text-xs">
                      {alert.description}
                    </AlertDescription>
                  </div>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
              </Alert>
            ))}
          </div>
        )}

        {/* 5-Day Forecast */}
        <div>
          <h3 className="mb-3 font-semibold text-amber-900 dark:text-amber-100">5-Day Forecast</h3>
          <div className="grid grid-cols-5 gap-2">
            {weather.forecast.map((day, index) => (
              <div
                key={index}
                className="rounded-lg bg-amber-50 dark:bg-amber-950/50 p-3 text-center transition-all hover:bg-amber-100 dark:hover:bg-amber-900/50"
              >
                <div className="text-xs font-medium text-muted-foreground">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="my-2 text-2xl">{day.icon}</div>
                <div className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                  {day.tempMax}°
                </div>
                <div className="text-xs text-muted-foreground">{day.tempMin}°</div>
                {day.precipitationProbability > 30 && (
                  <div className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                    {day.precipitationProbability}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

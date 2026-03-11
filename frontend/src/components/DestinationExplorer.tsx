import { UserProfile } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sun, Snowflake, Leaf, Flower } from 'lucide-react';
import { DESTINATIONS } from '../data/destinations';

interface DestinationExplorerProps {
  userProfile: UserProfile;
}

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

export default function DestinationExplorer({ userProfile }: DestinationExplorerProps) {
  const userInterests = userProfile.interests.map(i => i.toLowerCase());
  
  const getMatchScore = (destination: typeof DESTINATIONS[0]) => {
    const matches = destination.interests.filter(interest =>
      userInterests.includes(interest.toLowerCase())
    );
    return matches.length;
  };

  const sortedDestinations = [...DESTINATIONS].sort((a, b) => {
    const scoreA = getMatchScore(a);
    const scoreB = getMatchScore(b);
    return scoreB - scoreA;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
          Explore Destinations
        </h2>
        <p className="text-muted-foreground">
          Discover amazing places tailored to your interests
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedDestinations.map((destination) => {
          const matchScore = getMatchScore(destination);
          const isRecommended = matchScore > 0;

          return (
            <Card key={destination.name} className="group overflow-hidden border-2 border-amber-200/50 dark:border-amber-800/50 transition-all hover:shadow-lg">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {isRecommended && (
                  <Badge className="absolute right-3 top-3 bg-amber-600 hover:bg-amber-700">
                    Recommended
                  </Badge>
                )}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{destination.name}</CardTitle>
                    <CardDescription className="mt-2">
                      {destination.description}
                    </CardDescription>
                  </div>
                </div>
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

                {isRecommended && (
                  <div>
                    <p className="text-sm font-medium mb-2">Matches your interests:</p>
                    <div className="flex flex-wrap gap-1">
                      {destination.interests
                        .filter(interest => userInterests.includes(interest.toLowerCase()))
                        .map(interest => (
                          <Badge key={interest} variant="secondary" className="text-xs bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100">
                            {interest}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '../backend';
import { X } from 'lucide-react';

const INTEREST_OPTIONS = [
  'Adventure', 'Culture', 'Food', 'Nature', 'Beach', 'Mountains',
  'History', 'Photography', 'Shopping', 'Nightlife', 'Relaxation', 'Wildlife'
];

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [budgetPreference, setBudgetPreference] = useState('2000');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [destinationInput, setDestinationInput] = useState('');

  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const addDestination = () => {
    if (destinationInput.trim() && !destinations.includes(destinationInput.trim())) {
      setDestinations([...destinations, destinationInput.trim()]);
      setDestinationInput('');
    }
  };

  const removeDestination = (dest: string) => {
    setDestinations(destinations.filter(d => d !== dest));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profile: UserProfile = {
      name: name.trim(),
      email: email.trim(),
      interests: selectedInterests,
      preferredDestinations: destinations,
      budgetPreference: parseFloat(budgetPreference) || 2000,
    };

    saveProfile(profile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Welcome! Let's Set Up Your Profile</CardTitle>
            <CardDescription>
              Tell us about yourself to get personalized travel recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              {/* Budget Preference */}
              <div className="space-y-2">
                <Label htmlFor="budget">Typical Trip Budget (USD)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={budgetPreference}
                  onChange={(e) => setBudgetPreference(e.target.value)}
                  placeholder="2000"
                  min="0"
                  step="100"
                />
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <Label>Travel Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map(interest => (
                    <Badge
                      key={interest}
                      variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Preferred Destinations */}
              <div className="space-y-2">
                <Label htmlFor="destination">Preferred Destinations</Label>
                <div className="flex gap-2">
                  <Input
                    id="destination"
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    placeholder="e.g., Paris, Tokyo, Bali"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDestination())}
                  />
                  <Button type="button" onClick={addDestination} variant="outline">
                    Add
                  </Button>
                </div>
                {destinations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {destinations.map(dest => (
                      <Badge key={dest} variant="secondary" className="gap-1">
                        {dest}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeDestination(dest)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
                disabled={isPending || !name.trim() || !email.trim()}
              >
                {isPending ? 'Saving...' : 'Complete Setup'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

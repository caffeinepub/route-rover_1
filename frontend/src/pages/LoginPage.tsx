import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Wallet, FileText, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggingIn, identity } = useInternetIdentity();

  useEffect(() => {
    if (identity) {
      navigate({ to: '/dashboard' });
    }
  }, [identity, navigate]);

  const handleLogin = async () => {
    try {
      await login();
      toast.success('Successfully logged in!');
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <Button
            variant="ghost"
            className="mb-8 transition-all hover:scale-105"
            onClick={() => navigate({ to: '/' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="mb-12 text-center">
            <div className="mb-6 flex justify-center animate-fade-in">
              <img 
                src="/assets/Logo 7.jpeg" 
                alt="Route Rover Logo" 
                className="h-24 w-24 rounded-2xl object-cover shadow-lg transition-transform hover:scale-105"
              />
            </div>
            <h1 className="mb-4 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-5xl font-bold text-transparent animate-fade-in-delay-1">
              Route Rover
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground animate-fade-in-delay-2">
              Your personal travel companion for creating unforgettable journeys. Plan, budget, and organize all your adventures in one place.
            </p>
          </div>

          <div className="mb-12 overflow-hidden rounded-2xl shadow-2xl animate-fade-in-delay-3">
            <img
              src="/assets/generated/travel-hero.dim_1200x600.png"
              alt="Travel Planning"
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 border-amber-200/50 dark:border-amber-800/50 transition-all hover:shadow-lg hover:scale-105">
              <CardHeader>
                <MapPin className="mb-2 h-8 w-8 text-amber-600 dark:text-amber-400" />
                <CardTitle className="text-lg">Destination Explorer</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Discover amazing destinations with detailed information and recommendations
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 transition-all hover:shadow-lg hover:scale-105">
              <CardHeader>
                <Sparkles className="mb-2 h-8 w-8 text-orange-600 dark:text-orange-400" />
                <CardTitle className="text-lg">Smart Itineraries</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create personalized trip plans tailored to your preferences and interests
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-rose-200/50 dark:border-rose-800/50 transition-all hover:shadow-lg hover:scale-105">
              <CardHeader>
                <Wallet className="mb-2 h-8 w-8 text-rose-600 dark:text-rose-400" />
                <CardTitle className="text-lg">Budget Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track expenses and stay within budget with detailed financial insights
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200/50 dark:border-amber-800/50 transition-all hover:shadow-lg hover:scale-105">
              <CardHeader>
                <FileText className="mb-2 h-8 w-8 text-amber-600 dark:text-amber-400" />
                <CardTitle className="text-lg">Travel Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Organize all your travel documents, notes, and important information
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <Card className="mx-auto max-w-md border-2 border-amber-200/50 dark:border-amber-800/50 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Get Started</CardTitle>
              <CardDescription>
                Sign in with Internet Identity to start planning your next adventure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all hover:scale-105"
                size="lg"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Sign In with Internet Identity'
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Secure authentication powered by Internet Identity
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="border-t bg-white/50 py-8 backdrop-blur-sm dark:bg-gray-900/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{' '}
          <a 
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Compass, 
  Sparkles, 
  Bus, 
  Wallet, 
  Bell,
  ChevronRight,
  Globe,
  MessageSquare,
  TrendingUp,
  Users,
  Star,
  Zap,
  Shield,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import PopularDestinations from '../components/PopularDestinations';

export default function HomePage() {
  const navigate = useNavigate();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const prefersReducedMotion = useReducedMotion();
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [counters, setCounters] = useState({ trips: 0, destinations: 0, users: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (identity) {
      navigate({ to: '/dashboard' });
    }
  }, [identity, navigate]);

  // Intersection observer for stats counter animation
  useEffect(() => {
    if (prefersReducedMotion || !statsRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsVisible) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [prefersReducedMotion, statsVisible]);

  // Animated counter effect
  useEffect(() => {
    if (!statsVisible || prefersReducedMotion) {
      setCounters({ trips: 10000, destinations: 500, users: 5000 });
      return;
    }

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounters({
        trips: Math.floor(10000 * progress),
        destinations: Math.floor(500 * progress),
        users: Math.floor(5000 * progress),
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [statsVisible, prefersReducedMotion]);

  const handleLogin = async () => {
    try {
      await login();
      toast.success('Successfully logged in!');
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
    }
  };

  const handleNavigateToDashboard = () => {
    if (identity) {
      navigate({ to: '/dashboard' });
    } else {
      navigate({ to: '/login' });
    }
  };

  const parallaxOffset = prefersReducedMotion ? 0 : scrollY * 0.5;
  const mouseParallaxX = prefersReducedMotion ? 0 : (mousePosition.x - window.innerWidth / 2) * 0.02;
  const mouseParallaxY = prefersReducedMotion ? 0 : (mousePosition.y - window.innerHeight / 2) * 0.02;

  const features = [
    {
      icon: MapPin,
      title: 'Plan Your Journey',
      description: 'Create personalized itineraries with smart recommendations',
      gradient: 'from-amber-500 to-orange-600',
      color: 'amber',
      action: handleNavigateToDashboard,
    },
    {
      icon: Compass,
      title: 'Explore Destinations',
      description: 'Discover hidden gems and popular attractions worldwide',
      gradient: 'from-orange-500 to-rose-600',
      color: 'orange',
      action: () => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      icon: Sparkles,
      title: 'Smart Discovery',
      description: 'Get personalized recommendations based on your preferences',
      gradient: 'from-rose-500 to-pink-600',
      color: 'rose',
      action: handleNavigateToDashboard,
    },
    {
      icon: Wallet,
      title: 'Budget Tracking',
      description: 'Keep your expenses organized and under control',
      gradient: 'from-purple-500 to-indigo-600',
      color: 'purple',
      action: handleNavigateToDashboard,
    },
    {
      icon: Bus,
      title: 'Transport Options',
      description: 'Compare routes, prices, and travel times instantly',
      gradient: 'from-blue-500 to-cyan-600',
      color: 'blue',
      action: handleNavigateToDashboard,
    },
    {
      icon: MessageSquare,
      title: 'AI Assistant',
      description: 'Get instant answers to all your travel questions',
      gradient: 'from-green-500 to-emerald-600',
      color: 'green',
      action: handleNavigateToDashboard,
    },
  ];

  const benefits = [
    { icon: Zap, title: 'Lightning Fast', description: 'Real-time updates and instant responses' },
    { icon: Shield, title: 'Secure & Private', description: 'Your data is protected with blockchain technology' },
    { icon: Clock, title: 'Save Time', description: 'Plan trips 10x faster with smart automation' },
    { icon: Star, title: 'Personalized', description: 'Recommendations tailored to your preferences' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
      {/* Interactive Hero Section */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out"
          style={{
            backgroundImage: `url('/assets/Logo 7.jpeg')`,
            transform: `translate(${mouseParallaxX}px, ${mouseParallaxY + parallaxOffset}px) scale(1.1)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-amber-900/70 via-orange-900/50 to-transparent backdrop-blur-[1px]" />
        </div>

        {!prefersReducedMotion && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)] animate-pulse-slow" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="particle particle-1" />
              <div className="particle particle-2" />
              <div className="particle particle-3" />
              <div className="particle particle-4" />
              <div className="particle particle-5" />
              <div className="particle particle-6" />
              <div className="particle particle-7" />
              <div className="particle particle-8" />
            </div>
          </>
        )}

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
          <div className={`mb-8 ${!prefersReducedMotion ? 'animate-float' : ''}`}>
            <div className="relative">
              {!prefersReducedMotion && (
                <div className="absolute inset-0 animate-ping-slow rounded-3xl bg-amber-400/30 blur-xl" />
              )}
              <img 
                src="/assets/Logo 7.jpeg" 
                alt="Route Rover Logo" 
                className={`relative mx-auto h-40 w-40 rounded-3xl object-cover shadow-2xl ring-4 ring-amber-400/40 ${!prefersReducedMotion ? 'transition-all duration-500 hover:scale-110 hover:ring-amber-300/60' : ''}`}
              />
            </div>
          </div>
          
          <h1 className={`mb-6 text-6xl font-bold tracking-tight md:text-7xl lg:text-8xl ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}>
            Discover Your Next
            <span className={`block bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent ${!prefersReducedMotion ? 'animate-gradient' : ''}`}>
              Adventure
            </span>
          </h1>
          
          <p className={`mb-10 max-w-2xl text-xl text-amber-50 md:text-2xl drop-shadow-lg ${!prefersReducedMotion ? 'animate-fade-in-delay-1' : ''}`}>
            Plan, explore, and experience the world with real-time insights and personalized recommendations
          </p>

          <div className={`flex flex-wrap gap-4 justify-center ${!prefersReducedMotion ? 'animate-fade-in-delay-2' : ''}`}>
            <Button 
              size="lg" 
              className={`bg-gradient-to-r from-amber-600 to-orange-600 text-lg font-semibold hover:from-amber-700 hover:to-orange-700 shadow-2xl ${!prefersReducedMotion ? 'transition-all duration-300 hover:scale-110 hover:shadow-amber-500/50' : ''}`}
              onClick={handleNavigateToDashboard}
            >
              <Compass className="mr-2 h-5 w-5" />
              Start Planning
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className={`border-2 border-amber-300/50 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:border-amber-200/70 ${!prefersReducedMotion ? 'transition-all duration-300 hover:scale-110' : ''}`}
              onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Globe className="mr-2 h-5 w-5" />
              Explore Destinations
            </Button>
          </div>
        </div>

        {!prefersReducedMotion && (
          <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce-slow">
            <div className="flex flex-col items-center gap-2">
              <ChevronRight className="h-8 w-8 rotate-90 text-amber-200 animate-pulse" />
              <span className="text-xs text-amber-200 font-medium">Scroll to explore</span>
            </div>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div className={`${!prefersReducedMotion && statsVisible ? 'animate-fade-in-up' : ''}`}>
              <div className="text-5xl font-bold mb-2">{counters.trips.toLocaleString()}+</div>
              <div className="text-xl opacity-90">Trips Planned</div>
            </div>
            <div className={`${!prefersReducedMotion && statsVisible ? 'animate-fade-in-delay-1' : ''}`}>
              <div className="text-5xl font-bold mb-2">{counters.destinations.toLocaleString()}+</div>
              <div className="text-xl opacity-90">Destinations</div>
            </div>
            <div className={`${!prefersReducedMotion && statsVisible ? 'animate-fade-in-delay-2' : ''}`}>
              <div className="text-5xl font-bold mb-2">{counters.users.toLocaleString()}+</div>
              <div className="text-xl opacity-90">Happy Travelers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-100/30 to-transparent dark:via-orange-950/30"
          style={{ transform: prefersReducedMotion ? 'none' : `translateY(${scrollY * 0.1}px)` }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-16 text-center">
            <Badge className="mb-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0">
              Why Choose Route Rover
            </Badge>
            <h2 className="mb-4 text-5xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
              Travel Smarter, Not Harder
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of travel planning with cutting-edge features
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
            {benefits.map((benefit, index) => (
              <Card 
                key={index}
                className={`text-center border-2 border-amber-200/50 dark:border-amber-800/50 ${!prefersReducedMotion ? 'transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20' : ''}`}
              >
                <CardHeader>
                  <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 ${!prefersReducedMotion ? 'transition-transform duration-500 hover:rotate-12' : ''}`}>
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section id="destinations" className="py-24 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-100/30 to-transparent dark:via-amber-950/30"
          style={{ transform: prefersReducedMotion ? 'none' : `translateY(${scrollY * 0.2}px)` }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <PopularDestinations />
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-24 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.1),transparent_70%)]"
          style={{ transform: prefersReducedMotion ? 'none' : `translateY(${scrollY * 0.15}px)` }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-16 text-center">
            <Badge className="mb-4 bg-gradient-to-r from-orange-600 to-rose-600 text-white border-0">
              All-in-One Platform
            </Badge>
            <h2 className="mb-4 text-5xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground">Powerful features to make your journey unforgettable</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;
              
              return (
                <Card 
                  key={index}
                  className={`group overflow-hidden border-2 border-${feature.color}-200/50 dark:border-${feature.color}-800/50 cursor-pointer ${!prefersReducedMotion ? 'transition-all duration-500 hover:scale-105 hover:shadow-2xl' : ''} ${isActive ? 'ring-4 ring-amber-400/50' : ''}`}
                  onClick={feature.action}
                  onMouseEnter={() => setActiveFeature(index)}
                  onMouseLeave={() => setActiveFeature(null)}
                >
                  <div className={`h-48 overflow-hidden bg-gradient-to-br ${feature.gradient} relative`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_70%)]" />
                    {!prefersReducedMotion && isActive && (
                      <div className="absolute inset-0 bg-white/10 animate-pulse" />
                    )}
                    <div className="flex h-full items-center justify-center">
                      <Icon className={`h-24 w-24 text-white opacity-20 ${!prefersReducedMotion ? 'transition-all duration-500 group-hover:scale-125 group-hover:rotate-12' : ''}`} />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                      {feature.title}
                    </CardTitle>
                    <CardDescription>
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className={`w-full bg-gradient-to-r ${feature.gradient} hover:opacity-90`} variant="default">
                      Get Started
                      <ChevronRight className={`ml-2 h-4 w-4 ${!prefersReducedMotion ? 'transition-transform group-hover:translate-x-1' : ''}`} />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h2 className={`mb-6 text-5xl font-bold ${!prefersReducedMotion ? 'animate-fade-in-up' : ''}`}>
            Ready to Start Your Adventure?
          </h2>
          <p className={`mb-10 text-xl opacity-90 max-w-2xl mx-auto ${!prefersReducedMotion ? 'animate-fade-in-delay-1' : ''}`}>
            Join thousands of travelers who trust Route Rover for their journey planning
          </p>
          <Button 
            size="lg"
            className={`bg-white text-orange-600 hover:bg-amber-50 text-lg font-semibold shadow-2xl ${!prefersReducedMotion ? 'transition-all duration-300 hover:scale-110 animate-fade-in-delay-2' : ''}`}
            onClick={handleNavigateToDashboard}
          >
            <Compass className="mr-2 h-5 w-5" />
            Start Planning Now
          </Button>
        </div>
      </section>

      {/* Footer */}
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

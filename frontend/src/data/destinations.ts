export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  interests: string[];
  bestTime: string;
  season: string;
  highlights: string[];
}

export const DESTINATIONS: Destination[] = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    description: 'The City of Light offers iconic landmarks, world-class museums, and exquisite cuisine.',
    image: '/assets/generated/destination-grid.dim_800x600.png',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    interests: ['Culture', 'Food', 'History', 'Photography'],
    bestTime: 'Spring (April-June)',
    season: 'spring',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Champs-Élysées'],
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    description: 'A fascinating blend of ancient traditions and cutting-edge technology.',
    image: '/assets/generated/world-map-destinations.dim_800x600.png',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    interests: ['Culture', 'Food', 'Shopping', 'History'],
    bestTime: 'Spring (March-May)',
    season: 'spring',
    highlights: ['Senso-ji Temple', 'Shibuya Crossing', 'Mount Fuji', 'Tsukiji Market'],
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    description: 'Tropical paradise with stunning beaches, rice terraces, and spiritual temples.',
    image: '/assets/generated/travel-hero.dim_1200x600.png',
    coordinates: { lat: -8.3405, lng: 115.0920 },
    interests: ['Beach', 'Nature', 'Relaxation', 'Culture'],
    bestTime: 'Summer (April-October)',
    season: 'summer',
    highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Sacred Monkey Forest'],
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'USA',
    region: 'North America',
    description: 'The city that never sleeps, offering endless entertainment and cultural experiences.',
    image: '/assets/generated/dashboard-mockup.dim_1200x800.png',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    interests: ['Culture', 'Shopping', 'Nightlife', 'Food'],
    bestTime: 'Fall (September-November)',
    season: 'fall',
    highlights: ['Statue of Liberty', 'Central Park', 'Times Square', 'Broadway'],
  },
  {
    id: 'swiss-alps',
    name: 'Swiss Alps',
    country: 'Switzerland',
    region: 'Europe',
    description: 'Breathtaking mountain scenery perfect for skiing and outdoor adventures.',
    image: '/assets/generated/destination-grid.dim_800x600.png',
    coordinates: { lat: 46.8182, lng: 8.2275 },
    interests: ['Mountains', 'Adventure', 'Nature', 'Photography'],
    bestTime: 'Winter (December-March)',
    season: 'winter',
    highlights: ['Matterhorn', 'Jungfraujoch', 'Lake Geneva', 'Interlaken'],
  },
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    region: 'Europe',
    description: 'Stunning island with white-washed buildings, blue domes, and spectacular sunsets.',
    image: '/assets/generated/world-map-destinations.dim_800x600.png',
    coordinates: { lat: 36.3932, lng: 25.4615 },
    interests: ['Beach', 'Relaxation', 'Photography', 'Culture'],
    bestTime: 'Summer (May-September)',
    season: 'summer',
    highlights: ['Oia Sunset', 'Red Beach', 'Ancient Akrotiri', 'Fira Town'],
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    region: 'Middle East',
    description: 'Futuristic city with luxury shopping, ultramodern architecture, and desert adventures.',
    image: '/assets/generated/destination-grid.dim_800x600.png',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    interests: ['Luxury', 'Shopping', 'Adventure', 'Architecture'],
    bestTime: 'Winter (November-March)',
    season: 'winter',
    highlights: ['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall', 'Desert Safari'],
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    description: 'Ancient city with millennia of history, art, and world-renowned Italian cuisine.',
    image: '/assets/generated/world-map-destinations.dim_800x600.png',
    coordinates: { lat: 41.9028, lng: 12.4964 },
    interests: ['History', 'Culture', 'Food', 'Architecture'],
    bestTime: 'Spring (April-June)',
    season: 'spring',
    highlights: ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Roman Forum'],
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    description: 'Harbor city with iconic landmarks, beautiful beaches, and vibrant culture.',
    image: '/assets/generated/travel-hero.dim_1200x600.png',
    coordinates: { lat: -33.8688, lng: 151.2093 },
    interests: ['Beach', 'Culture', 'Nature', 'Adventure'],
    bestTime: 'Summer (December-February)',
    season: 'summer',
    highlights: ['Opera House', 'Harbour Bridge', 'Bondi Beach', 'Blue Mountains'],
  },
];

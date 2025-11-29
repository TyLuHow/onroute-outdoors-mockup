export interface Trail {
  id: string;
  name: string;
  location: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Extreme';
  rating: number;
  distance: string; // e.g., "5.2 mi"
  duration: string; // e.g., "2h 30m"
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface RouteRequest {
  start: string;
  destination: string;
}

export interface AppState {
  view: 'home' | 'map';
  route: RouteRequest | null;
  trails: Trail[];
  loading: boolean;
  selectedTrail: Trail | null;
}

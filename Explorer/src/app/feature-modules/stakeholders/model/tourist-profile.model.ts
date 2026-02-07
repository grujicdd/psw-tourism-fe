export interface TouristProfile {
  id: number;
  name: string;
  surname: string;
  email: string;
  interestIds: number[];
  receiveRecommendations: boolean;
}

export interface UpdateTouristProfile {
  interestIds: number[];
  receiveRecommendations: boolean;
}

export interface Interest {
  id: number;
  name: string;
}

// Predefined interests from backend
export const INTERESTS: Interest[] = [
  { id: 1, name: 'Nature' },
  { id: 2, name: 'Art' },
  { id: 3, name: 'Sport' },
  { id: 4, name: 'Shopping' },
  { id: 5, name: 'Food' }
];
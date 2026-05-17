// ─── Core data types used across the whole app ───────────────────

export interface UserStats {
  badges: number;
  posts: number;
  followers: number;
  following: number;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  photoUrl?: string;
}

export interface User {
  id: string | number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string; // kept for local AsyncStorage auth — replace with Firebase later
  profileImage: string | null;
  coverImage: string | null;
  bio: string;
  cars: Car[];
  groups: string[];
  stats: UserStats;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
  memberCount: number;
  isPublic: boolean;
}

export interface CarEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  organizer: string;
  imageUrl?: string;
  isVerified: boolean;
}

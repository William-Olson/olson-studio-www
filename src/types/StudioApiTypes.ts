export enum StudioBadgeTypes {
  Achievement = 'achievement',
  Administrative = 'administrative'
}

export interface StudioApiBadge {
  id: string;
  friendlyName: string;
  name: string;
  description: string;
  type: StudioBadgeTypes;
  isPublic: boolean;
  created: string;
  updated: string;
  rarity: number;
  obtained?: Date;
  unread?: boolean;
  userId?: string;
}

export interface StudioApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  provider?: string;
  created_at?: string;
  updated_at?: string;
  badges: StudioApiBadge[];
}

export interface RevokeSessionResponse {
  success: boolean;
  sessionId: string;
}

export interface StudioApiSession {
  id?: string;
  userId?: string;
  clientIp?: string;
  userAgent?: string;
  lastActivity: Date;
}

export interface StudioApiSessions {
  success: boolean;
  results?: StudioApiSession[];
}

export interface StudioApiUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  provider?: string;
  created_at?: string;
  updated_at?: string;
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

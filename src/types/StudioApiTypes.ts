export interface StudioApiUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  provider?: string;
}

export interface RevokeSessionResponse {
  success: boolean;
  sessionId: string;
}

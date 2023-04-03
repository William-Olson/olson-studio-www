export interface PagedResponse<T> {
  success?: boolean;
  page: number;
  page_size: boolean;
  results?: T[];
}

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

export interface StudioApiAdminChore {
  id: string;
  choreChartId: string;
  name: string;
  description: string;
  scheduleDays: string;
  created: Date;
  updated: Date;
  // events: Array<any>;
}

export interface StudioApiAdminChart {
  id: string;
  assignee: string;
  createdBy: string;
  name: string;
  description: string;
  streak: number;
  score: number;
  recurring: boolean;
  dueTime: string;
  created: Date;
  updated: Date;
  chores: Array<StudioApiAdminChore>;
}

export enum ChoreEventStatus {
  TODO = 'TODO',
  NEEDS_CHECK = 'NEEDS_CHECK',
  COMPLETED = 'COMPLETED'
}

export interface StudioApiChartEvent {
  id: string;
  choreChartId: string;
  choreId: string;
  rating: number; // 0 - 5
  due: Date; // Utc
  completed?: Date;
  created: Date;
  updated: Date;
  status: ChoreEventStatus;
}

export type StudioApiAdminCharts = PagedResponse<StudioApiAdminChart>;

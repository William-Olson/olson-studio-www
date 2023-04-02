export interface ChoreChartPayload {
  name: string;
  assignee: string;
  description: string;
  dueTime: string; // '18:00'
}

export interface ChorePayload {
  name: string;
  description: string;
  scheduleDays: string;
}

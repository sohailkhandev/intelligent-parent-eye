export interface AlertAppsUsageSocketApp {
  appName: string;
  usage: string;
  icon?: string | null;
}

export interface AlertAppsUsageSocketPayload {
  childName: string;
  childId: string;
  hours: number;
  reportingDayStart: string;
  apps: AlertAppsUsageSocketApp[];
}

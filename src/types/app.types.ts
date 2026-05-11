interface IAdmin {
  _id?: string;
  fullName?: string;
  role?: string;
  type?: "super_admin" | "admin";
  email?: string;
  profilePicture?: string;
  lastLogin?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  code?: string;
}

/** Parent from /parents/me */
interface IParent {
  _id: string;
  fullName: string;
  email: string;
  code: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Child in parent's children array (from /parents/me) */
interface IChild {
  _id: string;
  parent: string;
  name: string;
  ageGroup: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface IChildApp {
  _id: string;
  appName: string;
  packageName: string;
  icon?: string;
  blocked: boolean;
  appUsage?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  allAppUsage?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

type IChildAppFilter = "today" | "week" | "month";

interface IAlertApp {
  _id: string;
  appName: string;
  usage: string;
  icon: string | null;
}

interface IAlert {
  _id: string;
  hours: number;
  reportingDayStart: string;
  apps: IAlertApp[];
  createdAt: string;
  updatedAt: string;
  child: string;
  childName: string;
  __v?: number;
}

export type {
  IAdmin,
  IParent,
  IChild,
  IChildApp,
  IChildAppFilter,
  IAlertApp,
  IAlert,
};
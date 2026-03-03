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

export type { IAdmin, IParent, IChild };
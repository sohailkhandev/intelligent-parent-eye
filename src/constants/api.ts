// base url API Configuration
export const API_BASE_URL = "https://intelligent-parent-eye-d319f90326af.herokuapp.com/";
export const SOCKET_BASE_URL = API_BASE_URL.replace(/\/$/, "");

export const API_URLS = {
  login: "/parents/login",
  register: "/parents/signup",
  alerts: "/parents/alerts",
  children: "/parents/children",
  childApps: "/parents/apps",
  childAppRestriction: "/parents/children",
  forgotPassword: "/parents/forgot-password",
  resetPassword: "/parents/reset-password",
  me: "/parents/me",
  verifyEmail: "/parents/verify-email",
  logout: "/parents/logout",
  changePassword: "/parents/change-password",
  profile: "/parents/profile",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URLS } from "@constants";
import { api } from "@utils";

export interface ProfileData {
  fullName: string;
  gender: string;
  ageGroup: string;
  preferredGender: string;
  introduction: string;
  country: string;
}

export interface CompleteProfileParams {
  profileData: ProfileData;
  avatar?: File;
}

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileLanguageParams {
  language: string;
}

export const updateProfileLanguage = async (params: ProfileLanguageParams) => {
  try {
    const response = await api.put(API_URLS.profileLanguage, params);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to update language";
    throw new Error(errorMessage);
  }
};

export const updateProfile = async (profileData: ProfileData) => {
  try {
    const response = await api.put(API_URLS.profile, profileData);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to update profile";
    throw new Error(errorMessage);
  }
};

export const uploadProfilePicture = async (avatar: File) => {
  try {
    const formData = new FormData();
    formData.append("avatar", avatar);
    const response = await api.put(API_URLS.profilePicture, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to upload profile picture";
    throw new Error(errorMessage);
  }
};

export const completeProfile = async ({ profileData, avatar }: CompleteProfileParams) => {
  try {
    await updateProfile(profileData);
    if (avatar) {
      await uploadProfilePicture(avatar);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to complete profile";
    throw new Error(errorMessage);
  }
};

export const changePassword = async (params: ChangePasswordParams) => {
  try {
    const response = await api.post(API_URLS.changePassword, params);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to change password";
    throw new Error(errorMessage);
  }
};

export const deleteAccount = async (userId: string) => {
  try {
    const response = await api.delete(API_URLS.deleteAccount(userId));
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to delete account";
    throw new Error(errorMessage);
  }
};

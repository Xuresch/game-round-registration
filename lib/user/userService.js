// userService.js

import apiService from "@/lib/shared/apiService";

export const getUser = async (userId) => {
  return await apiService.getResource(`/users/${userId}`);
};

export const updateUser = async (userId, data) => {
  return await apiService.updateResource(`/users/${userId}`, data);
};

export const deleteUser = async (userId) => {
  return await apiService.deleteResource(`/users/${userId}`);
};


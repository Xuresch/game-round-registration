// userService.js

import apiService from "@/lib/shared/apiService";

export const getUser = async (userId) => {
  return await apiService.getResource(`/users/${userId}`);
};

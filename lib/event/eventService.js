// EventService.js

import apiService from "@/lib/shared/apiService";

export const getEvent = async (eventId) => {
  return await apiService.getResource(`/events/${eventId}`);
};

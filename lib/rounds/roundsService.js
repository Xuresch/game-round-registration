// roundsService.js

import apiService from "@/lib/shared/apiService";

export const deleteGameRound = async (roundId) => {
  return await apiService.deleteResource(`/gameRounds/${roundId}`);
};

export const getGameRound = async (roundId) => {
  return await apiService.getResource(`/gameRounds/${roundId}`);
};

export const getAllGameRounds = async () => {
  return await apiService.getResource(`/gameRounds`);
};

export const getEventGameRounds = async (eventId) => {
  return await apiService.getResource(`/gameRounds?eventId=${eventId}`);
};

export const updateGameRound = async (roundId, data) => {
  return await apiService.updateResource(`/gameRounds/${roundId}`, data);
};

export const createGameRound = async (data) => {
  return await apiService.createResource(`/gameRounds`, data);
};

// roundsService.js

import apiService from "@/lib/shared/apiService";

export const deleteGameRound = async (roundId) => {
  return await apiService.deleteResource(`/gameRounds/${roundId}`);
};

export const getGameRound = async (roundId) => {
  return await apiService.getResource(`/gameRounds/${roundId}`);
};

export const updateGameRound = async (roundId, data) => {
  return await apiService.updateResource(`/gameRounds/${roundId}`, data);
};

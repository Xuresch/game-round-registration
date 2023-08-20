// roundsService.js

import apiService from "@/lib/shared/apiService";

export const deleteGameRound = async (roundId) => {
  return await apiService.deleteResource(`/gameRounds/${roundId}`);
};

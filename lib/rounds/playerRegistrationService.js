// playerService.js

import apiService from "@/lib/shared/apiService";

export const deletePlayerRegistration = async (playerRegistrationId) => {
  return await apiService.deleteResource(
    `/playerRegistrations/${playerRegistrationId}`
  );
};

export const registerPlayer = async (userId, roundId, status) => {
  return await apiService.registerPlayer(userId, roundId, status);
};

export const getPlayerRegistration = async (playerId, gameRoundId) => {
  return await apiService.fetchPlayerRegistration(playerId, gameRoundId);
};

export const promoteOldestWaitingPlayer = async (round) => {
  // Check if the current game round has the waitingList flag enabled
  if (!round?.waitingList) return;

  const waitingPlayers = await apiService.getWaitingPlayers(round.id);

  if (waitingPlayers.length > 0) {
    const oldestWaitingPlayer = waitingPlayers.sort(
      (a, b) => new Date(a.joinedAt) - new Date(b.joinedAt)
    )[0];

    await apiService.promotePlayerToRegistered(oldestWaitingPlayer.id);
  }
};

export const getWaitingPlayers = async (gameRoundId) => {
  return await apiService.getWaitingPlayers(gameRoundId);
};

export const getRegisteredPlayers = async (gameRoundId) => {
  return await apiService.getRegisteredPlayers(gameRoundId);
};

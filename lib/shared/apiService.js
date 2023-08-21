// apiService.js

import axios from "axios";
import { env } from "@/helpers/env";

const BASE_URL = env.BASE_API_URL;

const apiService = {
  // Generic delete resource
  deleteResource: async (endpoint) => {
    try {
      const response = await axios.delete(`${BASE_URL}${endpoint}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting resource:", error);
      throw error;
    }
  },

  getResource: async (endpoint) => {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`);
      return response.data;
    } catch (error) {
      console.error("Error get resource:", error);
      throw error;
    }
  },

  updateResource: async (endpoint, data) => {
    try {
      const response = await axios.put(`${BASE_URL}${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error("Error update resource:", error);
      throw error;
    }
  },

  // Register a player
  registerPlayer: async (userId, roundId, status) => {
    const data = {
      playerId: userId,
      gameRoundId: roundId,
      status: status,
      joinedAt: new Date(),
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/playerRegistrations`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error registering player:", error);
      throw error;
    }
  },

  // Get player registration
  getWaitingPlayers: async (gameRoundId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/playerRegistrations?gameRoundId=${gameRoundId}&status=waiting`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching waiting players:", error);
      throw error;
    }
  },

  // Promote player to registered
  promotePlayerToRegistered: async (playerId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/playerRegistrations/${playerId}`,
        { status: "registered", joinedAt: new Date() }
      );
      return response.data;
    } catch (error) {
      console.error("Error promoting player:", error);
      throw error;
    }
  },

  // Get player registration by playerId and gameRoundId
  fetchPlayerRegistration: async (playerId, gameRoundId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/playerRegistrations?playerId=${playerId}&gameRoundId=${gameRoundId}`
      );
      return response.data[0];
    } catch (error) {
      console.error("Error fetching player registration:", error);
      throw error;
    }
  },

  // continue to add other API operations as needed
  // ...
};

export default apiService;

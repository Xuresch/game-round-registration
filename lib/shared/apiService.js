// apiService.js

import axios from "axios";
import { env } from "@/helpers/env";

const BASE_URL = env.BASE_API_URL;

const apiInstance = axios.create({
  headers: {'Content-Type' : 'application/json'},
  baseURL: BASE_URL,
  withCredentials: true
});

const apiService = {
  // Generic delete resource
  deleteResource: async (endpoint) => {
    try {
      const response = await apiInstance.delete(`${endpoint}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting resource:", error);
      throw error;
    }
  },

  getResource: async (endpoint) => {
    try {
      const response = await apiInstance.get(`${endpoint}`);
      return response.data;
    } catch (error) {
      console.error("Error get resource:", error);
      throw error;
    }
  },

  updateResource: async (endpoint, data) => {
    try {
      const response = await apiInstance.put(`${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error("Error update resource:", error);
      throw error;
    }
  },

  createResource: async (endpoint, data) => {
    try {
      const response = await apiInstance.post(`${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error("Error create resource:", error);
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
      const response = await apiInstance.post(
        `/playerRegistrations`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error registering player:", error);
      throw error;
    }
  },

    // Get player registration with status registered
    getRegisteredPlayers: async (gameRoundId) => {
      try {
        const response = await apiInstance.get(
          `/playerRegistrations?gameRoundId=${gameRoundId}&status=registered`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching registered players:", error);
        throw error;
      }
    },

  // Get player registration with status waiting
  getWaitingPlayers: async (gameRoundId) => {
    try {
      const response = await apiInstance.get(
        `/playerRegistrations?gameRoundId=${gameRoundId}&status=waiting`
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
      const response = await apiInstance.put(
        `/playerRegistrations/${playerId}`,
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
      const response = await apiInstance.get(
        `/playerRegistrations?playerId=${playerId}&gameRoundId=${gameRoundId}`
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

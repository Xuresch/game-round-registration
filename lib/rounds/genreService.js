// genreService.js

import apiService from "@/lib/shared/apiService";

export const getGenre = async () => {
  return await apiService.getResource(`/gameRounds/genres`);
};


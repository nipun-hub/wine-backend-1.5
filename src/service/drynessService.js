import Dryness from '../model/Dryness.js';

export const drynessService = {
  getAll: async () => {
    try {
      const drynessLevels = await Dryness.find();
      return drynessLevels;
    } catch (error) {
      throw new Error(`Error fetching Dryness levels: ${error.message}`);
    }
  },

  save: async (drynessData) => {
    try {
      const count = await Dryness.countDocuments();
      if (count === 0) {
        await Dryness.insertMany(drynessData);
        return "Dryness levels seeded successfully.";
      }
      return "Dryness levels already have data. Skipping seeding.";
    } catch (error) {
      throw new Error(`Error saving Dryness levels: ${error.message}`);
    }
  },
};

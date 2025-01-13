import Vintage from '../model/Vintage.js';

export const vintageService = {
  getAll: async () => {
    try {
      const vintages = await Vintage.find();
      return vintages;
    } catch (error) {
      throw new Error(`Error fetching Vintages: ${error.message}`);
    }
  },

  save: async (vintagesData) => {
    try {
      const count = await Vintage.countDocuments();
      if (count === 0) {
        await Vintage.insertMany(vintagesData);
        return "Vintages seeded successfully.";
      }
      return "Vintages already have data. Skipping seeding.";
    } catch (error) {
      throw new Error(`Error saving Vintages: ${error.message}`);
    }
  },
};

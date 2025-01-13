import Collectable from '../model/Collectable.js';

export const collectableService = {
  getAll: async () => {
    try {
      const collectables = await Collectable.find();
      return collectables;
    } catch (error) {
      throw new Error(`Error fetching Collectables: ${error.message}`);
    }
  },

  save: async (collectablesData) => {
    try {
      const count = await Collectable.countDocuments();
      if (count === 0) {
        await Collectable.insertMany(collectablesData);
        return "Collectables seeded successfully.";
      }
      return "Collectables already have data. Skipping seeding.";
    } catch (error) {
      throw new Error(`Error saving Collectables: ${error.message}`);
    }
  },
};

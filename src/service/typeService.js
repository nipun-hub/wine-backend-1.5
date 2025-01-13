import Type from '../model/Type.js';

export const typeService = {
  getAll: async () => {
    try {
      const types = await Type.find();
      return types;
    } catch (error) {
      throw new Error(`Error fetching Types: ${error.message}`);
    }
  },

  save: async (typesData) => {
    try {
      const count = await Type.countDocuments();
      if (count === 0) {
        await Type.insertMany(typesData);
        return "Types seeded successfully.";
      }
      return "Types already have data. Skipping seeding.";
    } catch (error) {
      throw new Error(`Error saving Types: ${error.message}`);
    }
  },
};


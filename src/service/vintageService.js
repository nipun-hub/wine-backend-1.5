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
      const existingYears = await Vintage.findOne({ year: vintagesData.year })
      if (existingYears) {
        return { message: "Vintage already exists", status: "error", data: null };
      }

      const newVintage = new Vintage(vintagesData);
      await newVintage.save();
      return { message: "Vintage saved successfully", status: "success", data: newVintage };
    } catch (error) {
      throw new Error(`Error saving Vintages: ${error.message}`);
    }
  },

  update: async (id, updateData) => {
    try {
      const existingVintage = await Vintage.findOne({ _id: id });
      if (!existingVintage) return { message: "vintage is not found", status: "error", data: null };

      const existingYear = await Vintage.findOne({ year: updateData.year });
      if (existingYear) return { message: "Vintage already exists", status: "error", data: null };

      const updatedVintage = await Vintage.findByIdAndUpdate(id, updateData, { new: true });
      return { message: "Vintage updated successfully", status: "success", data: updatedVintage };
    } catch (error) {
      throw new Error(`Error updating Vintage: ${error.message}`);
    }
  }
};
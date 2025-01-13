import Size from '../model/Size.js';

export const sizeService = {
  getAll: async () => {
    try {
      const sizes = await Size.find();
      return sizes;
    } catch (error) {
      throw new Error(`Error fetching Sizes: ${error.message}`);
    }
  },

  save: async (name) => {
    try {
      // Check if the size already exists
      const existingSize = await Size.findOne({ name });
      if (existingSize) {
        return { message: "Size already exists", status: "error", data: null };
      }

      // Create and save a new size
      const newSize = new Size({ name });
      const savedSize = await newSize.save();
      return { message: "Size saved successfully", status: "success", data: savedSize };
    } catch (error) {
      throw new Error(`Error saving size: ${error.message}`);
    }
  },


  update: async (id, name) => {
    try {
      // Check if the size exists
      const existingSize = await Size.findById(id);
      if (!existingSize) {
        return { message: "Size not found", status: "error", data: null };
      }

      // Update the size
      const updatedSize = await Size.findByIdAndUpdate(id, { name }, { new: true });
      return { message: "Size updated successfully", status: "success", data: updatedSize };
    } catch (error) {
      throw new Error(`Error updating size: ${error.message}`);
    }
  },

};
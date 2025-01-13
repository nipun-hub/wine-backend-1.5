import Favorite from "../model/Favourite.js";
import Product from "../model/Product.js";
import Cart from "../model/Cart.js";

export const favoriteService = {
  // Get all favorites by user with pagination, sorting, and search
  getAllByUser: async (
    userId,
    page = 1,
    perPage = 10,
    orderBy = "addedAt",
    sort = "asc",
    search = ""
  ) => {
    const sortOrder = sort === "asc" ? 1 : -1;
    const query = { userId };

    // Add search filter to product name
    if (search) {
      query["productId.name"] = { $regex: search, $options: "i" };
    }

    // Fetch favorites with pagination, sorting, and populate product details
    const favorites = await Favorite.find(query)
      .populate({ path: "productId", model: Product }) // Populate product details
      .sort({ [orderBy]: sortOrder })
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    const total = await Favorite.countDocuments(query);
    const totalPages = Math.ceil(total / perPage);

    return {
      success: true,
      message: "Favorites fetched successfully",
      data: {
        totalPages,
        currentPage: page,
        totalItems: total,
        favorites,
      },
    };
  },

  // Add a product to favorites
  addToFavorite: async (userId, productId) => {
    // Check if the product is already in favorites
    const existingFavorite = await Favorite.findOne({ userId, productId });
    if (existingFavorite) {
      throw new Error("Product is already in favorites");
    }

    // Add product to favorites
    await Favorite.create({ userId, productId });

    return {
      success: true,
      message: "Favorite added successfully",
      data: null,
    };
  },

  // Remove a product from favorites
  removeFromFavorite: async (userId, productId) => {
    const result = await Favorite.findOneAndDelete({ userId, productId });
    if (!result) {
      throw new Error("Favorite not found");
    }
    return {
      success: true,
      message: "Favorite removed successfully",
      data: null,
    };
  },

  clearFavorite: async (userId) => {
    const result = await Favorite.deleteMany({ userId }); // Delete all items for the userId
    if (result.deletedCount === 0) {
      throw new Error('No items found in the favorite to clear');
    }
    return {
      message: 'Favorite cleared successfully',
      deletedCount: result.deletedCount,
    };
  },
};

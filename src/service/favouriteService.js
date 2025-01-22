import Favorite from "../model/Favourite.js";
import Product from "../model/Product.js";
import Country from "../model/Country.js";
import Cart from "../model/Cart.js";
import Discount from "../model/Discount.js";
import { populate } from "dotenv";

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
      .populate({
        path: "productId",
        model: "Product",
        populate: [{
          path: "country",
          model: "Country",
          select: "name _id",
        },
        {
          path: "categories",
          model: "WineCategory",
          select: "name _id",
        },
        {
          path: "regions",
          model: "WineRegion",
          select: "region _id",
        },
        {
          path: "size",
          model: "Size",
          select: "name _id",
        }
      ]
      }) // Populate product details
      .sort({ [orderBy]: sortOrder })
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    const total = await Favorite.countDocuments(query);
    const totalPages = Math.ceil(total / perPage);

    const favoritesWithDiscounts = await Promise.all(
      favorites.map(async (favorite) => {
        const product = favorite.productId;

        const discounts = [];

        // Step 1: Search for a product-specific discount
        const productDiscounts = await Discount.find({
          discountType: 'product',
          productId: product._id,
          isActive: true,
        }).sort({ unitDiscount: -1, packDiscount: -1 });

        if (productDiscounts) {
          discounts.push(...productDiscounts); // Add product discounts to the list
        }

        if (product.categories) {
          // Step 3: Search for category-specific discounts
          const categoryDiscounts = await Discount.find({
            discountType: 'category',
            categoryId: { $in: product.categories._id },
            isActive: true,
          });

          if (categoryDiscounts && categoryDiscounts.length > 0) {
            discounts.push(...categoryDiscounts); // Add all category discounts to the list
          }
        }


        // Calculate the maximum discount
        const maxDiscount = discounts.reduce((prev, current) => {
          return current.unitDiscount > prev.unitDiscount
            ? {
              unitDiscount: current.unitDiscount,
              packDiscount: current.packDiscount,
              discountName: current.discountName
            }
            : {
              unitDiscount: prev.unitDiscount,
              packDiscount: prev.packDiscount,
              discountName: prev.discountName
            };
        }, { unitDiscount: 0, packDiscount: 0, discountName: '' });


        return {
          ...favorite.toObject(),
          productId: {
            ...product.toObject(),
            ...maxDiscount,
          },
        };

      })
    );

    return {
      success: true,
      message: "Favorites fetched successfully",
      data: {
        totalPages,
        currentPage: page,
        totalItems: total,
        favorites: favoritesWithDiscounts,
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

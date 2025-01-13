import Cart from '../model/Cart.js';
import Product from '../model/Product.js';

export const cartService = {
  // Get all cart items by user with pagination
  getAllByUser: async (userId, page, perPage) => {
    const query = { userId };
    const cartItems = await Cart.find(query)
      .populate({ path: 'productId', model: Product }) // Populate product details
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    const total = await Cart.countDocuments(query);
    return {
      cartItems,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / perPage),
        currentPage: page,
        perPage: perPage,
      },
    };
  },

  // Add product to cart
  addToCart: async (userId, productId, quantity) => {
    // Check if the product is already in the cart
    const existingCartItem = await Cart.findOne({ userId, productId });
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      return existingCartItem;
    }

    // Add new product to cart
    const newCartItem = await Cart.create({ userId, productId, quantity });
    return newCartItem;
  },

  // Remove product from cart
  removeFromCart: async (userId, productId) => {
    const result = await Cart.findOneAndDelete({ userId, productId });
    if (!result) {
      throw new Error('Cart item not found');
    }
    return result;
  },

  // Remove product from cart
  updateQty: async (userId, productId, quantity) => {
    const result = await Cart.findOneAndUpdate({ productId: productId, userId: userId }, { quantity: quantity });
    if (!result) {
      throw new Error('Cart item not found');
    }
    return result;
  },

  bulkRemoveFromCart: async (userId, productIds) => {
    const result = await Cart.deleteMany({ userId, productId: { $in: productIds } });
    if (result.deletedCount === 0) {
      throw new Error('No cart items found to remove');
    }
    return result;
  },


  clearCart: async (userId) => {
    const result = await Cart.deleteMany({ userId }); // Delete all items for the userId
    if (result.deletedCount === 0) {
      throw new Error('No items found in the cart to clear');
    }
    return {
      message: 'Cart cleared successfully',
      deletedCount: result.deletedCount,
    };
  },

};

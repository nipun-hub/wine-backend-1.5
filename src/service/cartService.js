import Cart from '../model/Cart.js';
import Discount from '../model/Discount.js';
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

    const cartWithDiscounts = await Promise.all(
      cartItems.map(async (cartItem) => {
        const product = cartItem.productId;

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
          ...cartItem.toObject(),
          productId: {
            ...product.toObject(),
            ...maxDiscount,
          },
        };

      })
    );

    return {
      cartItems: cartWithDiscounts,
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

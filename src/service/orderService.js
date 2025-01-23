import Order from "../model/Order.js";
import Product from "../model/Product.js";
import User from "../model/User.js";
import UserAddress from "../model/Address.js";
import Discount from "../model/Discount.js";

export const orderService = {
    // Place an order
    createOrder: async ({
        userId,
        products,
        totalAmount,
        shippingAddress,
        mobileNumber,
        paymentMethod,
        userComments,
        deliveryType,
        deliveryDate,
        editable,
        paymentId,
    }) => {
        try {
            if (!products || !Array.isArray(products) || products.length === 0) {
                throw new Error("Products array is empty or invalid.");
            }

            const user = await User.findById(userId);
            if (!user) {
                throw new Error("User not found.");
            }

            if (!totalAmount || !shippingAddress || !mobileNumber || !paymentMethod) {
                throw new Error("Missing required fields.");
            }

            if (paymentMethod === "Card") {
                if (!paymentId) {
                    throw new Error("Payment ID is required for Card payment.");
                }
            }

            // Reduce qtyOnHand for each product
            for (let item of products) {
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { qtyOnHand: -item.quantity } },
                    { new: true }
                );
            }

            const newOrder = await Order.create({
                user: userId,
                products: products.map((p) => ({
                    product: p.product,
                    quantity: p.quantity,
                    isPack: (p.isPack) ? p.isPack : false,
                    packSize: (p.packSize) ? p.packSize : 0
                })),
                totalAmount,
                shippingAddress,
                mobileNumber,
                paymentMethod,
                userComments,
                editable,
                deliveryType,
                deliveryDate,
                paymentId,
            });

            return newOrder;
        } catch (error) {
            throw new Error(error.message || "Order creation failed.");
        }
    },

    // Get order by order ID
    getOrderById: async (orderId) => {
        try {
            const order = await Order.findById(orderId)
                .populate("user")
                .populate("products.product");
            if (!order) {
                throw new Error("Order not found.");
            }
            return order;
        } catch (error) {
            throw new Error(error.message || "Order fetch failed.");
        }
    },

    // Get all orders
    getAllOrders: async ({ page, limit, sortBy, sortOrder, filters }) => {
        try {
            const query = {};

            if (filters.status) {
                query.status = filters.status;
            }
            if (filters.userId) {
                query.user = filters.userId;
            }

            const options = {
                sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                populate: [
                    { path: "user", select: "firstName lastName email" },
                    { path: "products.product" },
                ],
            };

            const orders = await Order.paginate(query, options);

            orders.docs = await Promise.all(
                orders.docs.map(async (order) => {
                    let shippingAddress = {};

                    try {
                        if (order.shippingAddress) {
                            const userAddress = await UserAddress.findOne({
                                userId: order.user._id,
                            });

                            if (userAddress) {
                                const address = userAddress.addresses.id(order.shippingAddress);

                                if (address) {
                                    shippingAddress = address;
                                } else {
                                    shippingAddress = null;
                                }
                            }
                        }
                    } catch (error) {
                        console.error("Error fetching shipping address:", error);
                    }

                    return {
                        ...order.toObject(),
                        shippingAddress,
                    };
                })
            );

            const updatedOrder = await Promise.all(
                orders?.docs?.map(async order => {
                    const updatedProducts = await Promise.all(
                        order.products.map(async singleProduct => {
                            const product = await singleProduct.product;
                            const discounts = [];

                            // Step 1: Search for a product-specific discount
                            const productDiscounts = await Discount.find({
                                discountType: 'product',
                                productId: { $in: product?._id },
                                isActive: true,
                            }).sort({ unitDiscount: -1, packDiscount: -1 });

                            if (productDiscounts) {
                                discounts.push(...productDiscounts); // Add product discounts to the list
                            }

                            if (product?.categories) {
                                // Step 3: Search for category-specific discounts
                                const categoryDiscounts = await Discount.find({
                                    discountType: 'category',
                                    categoryId: { $in: product?.categories?._id },
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
                                ...singleProduct,
                                product: {
                                    ...product,
                                    ...maxDiscount,
                                },
                            };
                        })
                    );

                    return {
                        ...order,
                        products: updatedProducts,
                    };
                })
            );

            return {
                ...orders,
                docs: updatedOrder
            };
        } catch (error) {
            console.log(error)
            throw new Error(error.message || "Failed to fetch orders.");
        }
    },

    // Accept or reject an order
    updateOrderStatus: async (orderId, status, statusMessage) => {
        try {
            if (!["pending", "delivered", "cancelled"].includes(status)) {
                throw new Error(
                    "Invalid status. Status should be either confirmed or cancelled."
                );
            }

            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                { status, statusMessage, updatedAt: Date.now() },
                { new: true }
            );

            if (!updatedOrder) {
                throw new Error("Order not found.");
            }

            return updatedOrder;
        } catch (error) {
            throw new Error(error.message || "Failed to update order status.");
        }
    },

    // get all orders by user
    userOrderHistory: async ({ userId, page, limit }) => {
        try {
            const query = { user: userId };

            const user = await User.findById(userId);
            if (!user) {
                throw new Error("User not found.");
            }

            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                populate: [
                    // {path: 'user', select: 'firstName lastName email'},
                    { path: "products.product" },
                ],
            };
            const orders = await Order.paginate(query, options);

            if (!orders) {
                throw new Error("Order not found.");
            }

            orders.docs = await Promise.all(
                orders.docs.map(async (order) => {
                    let shippingAddress = {};

                    try {
                        if (order.shippingAddress) {
                            const userAddress = await UserAddress.findOne({
                                userId: order.user._id,
                            });

                            if (userAddress) {
                                const address = userAddress.addresses.id(order.shippingAddress);

                                if (address) {
                                    shippingAddress = address;
                                } else {
                                    shippingAddress = null;
                                }
                            }
                        }
                    } catch (error) {
                        console.error("Error fetching shipping address:", error);
                    }

                    return {
                        ...order.toObject(),
                        shippingAddress,
                    };
                })
            );

            return orders;
        } catch (error) {
            throw new Error(error.message || "Failed to fetch orders.");
        }
    },

    updateOrder: async (orderId, updates) => {
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                throw new Error("Order not found.");
            }

            if (updates.products) {
                updates.products = updates.products.map((item) => {
                    if (item.product && item.product._id) {
                        return {
                            product: item.product._id,
                            quantity: item.quantity,
                            _id: item._id,
                        };
                    } else {
                        throw new Error("Invalid product reference.");
                    }
                });
            }

            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                { $set: updates },
                { new: true }
            ).populate("products.product", "name description price");

            return updatedOrder;
        } catch (error) {
            console.error("Error updating order:", error.message);
            throw new Error(error.message || "Order update failed.");
        }
    },
};

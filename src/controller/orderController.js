import {orderService} from "../service/orderService.js";

export const orderController = {
    // Place an order
    createOrder: async (req, res) => {
        try {
            const {
                userId,
                products,
                totalAmount,
                shippingAddress,
                mobileNumber,
                paymentMethod,
                userComments,
                editable,
                deliveryType,
                deliveryDate,
                paymentId
            } = req.body;
            const newOrder = await orderService.createOrder({
                userId,
                products,
                totalAmount,
                shippingAddress,
                mobileNumber,
                paymentMethod,
                userComments,
                editable,
                deliveryType,
                deliveryDate,
                paymentId
            });

            return res.status(201).json({
                success: true, message: 'Order created successfully', order: newOrder,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({error: error.message || 'Internal Server Error'});
        }
    },

    // Get order by order id
    getOrderById: async (req, res) => {
        try {
            const orderId = req.params.id;
            const order = await orderService.getOrderById(orderId);

            return res.status(200).json({order});
        } catch (error) {
            console.error(error);
            return res.status(500).json({error: error.message || 'Internal Server Error'});
        }
    },

    // Get all orders
    getAllOrders: async (req, res) => {
        const {page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'asc', ...filters} = req.query;

        try {
            const orders = await orderService.getAllOrders({
                page, limit, sortBy, sortOrder, filters,
            });

            return res.status(200).json({
                success: true, message: 'Orders fetched successfully.', data: orders,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false, message: error.message || 'Internal Server Error',
            });
        }
    },

    // Accept or reject an order
    updateOrderStatus: async (req, res) => {
        try {
            const {id: orderId} = req.params;
            const {status, statusMessage} = req.body; // status and statusMessage from the body

            const updatedOrder = await orderService.updateOrderStatus(orderId, status, statusMessage);

            return res.status(200).json({
                success: true, message: `Order ${status} and message saved successfully.`, order: updatedOrder,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false, message: error.message || 'Internal Server Error',
            });
        }
    },

    // get user order history
    userOrderHistory: async (req, res) => {
        try {
            const {id: userId} = req.params;
            const {page, limit} = req.query;
            const orders = await orderService.userOrderHistory({userId, page, limit});
            // // console.log(response.docs);
            // const orders = response.docs.flatMap(order => order.products);
            return res.status(200).json({
                success: true, message: 'Orders fetched successfully.', data: orders,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false, message: error.message || 'Internal Server Error',
            });
        }
    },

    // Update an order
    updateOrder: async (req, res) => {
        try {
            const {orderId} = req.params;
            const updates = req.body;


            const updatedOrder = await orderService.updateOrder(orderId, updates);

            return res.status(200).json({
                success: true,
                message: 'Order updated successfully.',
                order: updatedOrder,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Internal Server Error',
            });
        }
    },
};
import orderModel from "../models/orderSchema.js";
import productModel from "../models/product.js"

export const createOrder = async (req, res) => {
    try {
        const { customerName, products, phone } = req.body;

        // Calculate the total price based on the products and quantities
        let totalPrice = 0;
        for (const product of products) {
            const { productId, quantity } = product;
            // Retrieve the price of the product from the database
            const productData = await productModel.findById(productId);
            if (!productData) {
                return res.status(404).json({ message: "Product not found" });
            }
            const productPrice = productData.price;
            totalPrice += productPrice * quantity;
        }

        // Create a new instance of the order model
        const newOrder = new orderModel({
            customerName,
            products,
            totalPrice,
            phone,
        });

        // Save the new order to the database
        const savedOrder = await newOrder.save();

        // Return the saved order in the response
        res.status(201).json(savedOrder);
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Failed to create order" });
    }
};

export const getOrdersByCustomerName = async (req, res) => {
    try {
        const { customerName } = req.params;

        const orders = await orderModel.find({ customerName });

        res.json(orders);
    } catch (error) {
        console.error("Error getting orders by customer name:", error);
        res.status(500).json({ message: "Failed to get orders by customer name" });
    }
};
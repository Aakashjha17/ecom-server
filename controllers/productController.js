import productModel from "../models/product.js"

export const createProduct = async (req, res) => {
     try {
        const { name, price } = req.body;

        const newProduct = new productModel({
            name,
            price,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    }catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Failed to create product" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error("Error getting product:", error);
        res.status(500).json({ message: "Failed to get product" });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find();
    
        res.json(products);
    } catch (error) {
        
        console.error("Error getting products:", error);
        res.status(500).json({ message: "Failed to get products" });
    }
};

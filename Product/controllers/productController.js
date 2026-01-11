const express = require('express');
const productModel = require('../models/productModel');

const app = express();

app.use(express.json());

const getProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};


const getProductById = async (req, res) => {
    try {
        const productDetails = await productModel.findById(req.params.id);
        res.json(productDetails);
    } catch (error) {
        res.status(400).json(error);
    }
};

const findProduct = async (req, res) => {
    try {
        const product = await productModel.findOne({
            $or: [{ name: req.params.idOrName }, { _id: req.params.idOrName }]
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, image } = req.body;
        if (!name || price === undefined) {
            return res.status(400).json({ message: "Name and price are required" });
        }
        const product = await productModel.create(req.body);
        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};

module.exports = {
    getProducts,
    createProduct,
    getProductById,
    findProduct
};

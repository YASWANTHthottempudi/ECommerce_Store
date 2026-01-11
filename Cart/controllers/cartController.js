const { json } = require('express');
const CartModel = require('../models/cartModel');
const ProductModel = require('../models/productModel');

const getCartProducts = async (req, res) => {
    try {
        const cartProducts = await CartModel.find({ UserId: req.user.id });
        const cartProductIds = [];
        
        cartProducts.forEach(cartProduct => {
            cartProductIds.push(cartProduct.ProductId);
        });

        if (cartProductIds.length === 0) {
            return res.status(200).json({ Products: [], total: 0 });
        }

        const Products = await ProductModel.find({ _id: { $in: cartProductIds } });
        const total = Products.reduce((sum, product) => sum + (product.price || 0), 0);
        
        res.status(200).json({ Products, total });
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart products", error: error.message });
    }
}
const addCartProduct = async (req, res) => {
    try {
        // Check if product exists
        const product = await ProductModel.findById(req.params.productid);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if product already in cart
        const existingCartItem = await CartModel.findOne({
            UserId: req.user.id,
            ProductId: req.params.productid
        });

        if (existingCartItem) {
            return res.status(400).json({ message: "Product already in cart" });
        }

        const cartProduct = await CartModel.create({
            UserId: req.user.id,
            ProductId: req.params.productid
        });
        
        res.status(201).json({ message: "Product added to cart", cartProduct });
    } catch (error) {
        res.status(500).json({ message: "Error adding product to cart", error: error.message });
    }
}

const deleteCartProduct = async (req, res) => {
    try {
        const cartProduct = await CartModel.findOneAndDelete({
            UserId: req.user.id,
            ProductId: req.params.productid
        });

        if (!cartProduct) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        res.status(200).json({ message: "Product removed from cart", cartProduct });
    } catch (error) {
        res.status(500).json({ message: "Error removing product from cart", error: error.message });
    }
}

const checkout = async (req, res) => {
    try {
        const cartProducts = await CartModel.deleteMany({ UserId: req.user.id });
        res.status(200).json({ 
            message: "Checkout successful", 
            deletedCount: cartProducts.deletedCount 
        });
    } catch (error) {
        res.status(500).json({ message: "Error during checkout", error: error.message });
    }
}

module.exports = {
    getCartProducts,
    addCartProduct,
    deleteCartProduct,
    checkout
}
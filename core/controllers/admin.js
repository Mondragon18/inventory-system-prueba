const { Product, Purchase, PurchaseDetail } = require('../models');

const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Metodo para registrar un producto
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Fields are missing when creating: ${JSON.stringify(errors)}`);
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { batchNumber, name, price, quantity, entryDate } = req.body;
    const product = await Product.create({ batchNumber, name, price, quantity, entryDate });

    logger.info(`Product registered successfully: ${product}`);
    res.status(201).json({ product });
  } catch (error) {
    logger.error(`Product not registered: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Metodo para actualizar un producto
const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Fields are missing when updating: ${JSON.stringify(errors)}`);
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { batchNumber, name, price, quantity, entryDate } = req.body;
    await Product.update({ batchNumber, name, price, quantity, entryDate }, { where: { id } });
    logger.info(`Product updated successfully: ${id}`);
    res.json({ message: 'Product updated successfully!' });
  } catch (error) {
    logger.error(`Product not updated: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      logger.warn(`Product not found: ${id}`);
      return res.status(404).json({ error: 'Product not found!' });
    }

    res.json({ product });

  } catch (error) {
    logger.error(`Product not fount: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Metodo para eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ where: { id } });
    if (!product) {
      logger.warn(`Product not found: ${id}`);
      return res.status(404).json({ error: 'Product not found!' });
    }
    
    await Product.destroy({ where: { id } });
    logger.info(`Product deleted: ${id}`);
    res.json({ message: 'Product deleted successfully!' });
  } catch (error) {
    logger.error(`Product not deleted: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Metodos para obtener listado del producto
const getProducts = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit);

    let options = {};

    if (limit) {
      options.limit = limit;
      const offset = (page - 1) * limit;
      options.offset = offset;
    }

    const products = await Product.findAndCountAll(options);

    if (!limit) {
      // Si no se especifica limit, devolver todos los productos
      res.json({ products });
    } else {
      // Si se especifica limit, devolver productos paginados
      const totalPages = Math.ceil(products.count / limit);
      res.json({ products, totalPages });
    }
  } catch (error) {
    logger.error(`Products not founds: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Metodo para obtener listado de las compras
const getPurchases = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit);

    let options = {
      distinct: true,
      include: [
        {
          model: PurchaseDetail,
          as: 'purchaseDetails',
          include: [{ model: Product, as: 'product' }]
        }
      ]
    };

    if (limit) {
      options.limit = limit;
      const offset = (page - 1) * limit;
      options.offset = offset;
    }

    const purchases = await Purchase.findAndCountAll(options);

    if (!limit) {
      // Si no se especifica limit, devolver todos los productos
      res.json({ purchases });
    } else {
      // Si se especifica limit, devolver productos paginados
      const totalPages = Math.ceil(purchases.count / limit);
      res.json({ purchases, totalPages });
    }
  } catch (error) {
    logger.error(`Purchases not founds: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createProduct, updateProduct, getProduct, deleteProduct, getProducts, getPurchases };
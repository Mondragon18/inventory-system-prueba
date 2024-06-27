const { Purchase, User, PurchaseDetail, Product } = require('../models');

const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

//Metodo para crear producto 
const purchaseProducts = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`There is no room to make purchases: ${JSON.stringify(errors)}`);
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { products } = req.body;
    const userId = req.user.id;  // Obtener el userId del token decodificado
    let totalPrice = 0;
    const purchase = await Purchase.create({ userId, totalPrice: 0, date: new Date() });
    
    for (const product of products) {
      const productRecord = await Product.findByPk(product.productId);
      if (!productRecord) {
        logger.error(`Product with id ${product.productId} not found`);
        return res.status(404).json({ error: `Product with id ${product.productId} not found` });
      }
      if (productRecord.quantity < product.quantity) {
        logger.error(`Not enough quantity for product id ${product.productId}`);
        return res.status(400).json({ error: `Not enough quantity for product id ${product.productId}` });
      }
      totalPrice += productRecord.price * product.quantity;
      await PurchaseDetail.create({ purchaseId: purchase.id, productId: product.productId, quantity: product.quantity, price: productRecord.price });
      await Product.update({ quantity: productRecord.quantity - product.quantity }, { where: { id: product.productId } });
    }

    await Purchase.update({ totalPrice }, { where: { id: purchase.id } });

    logger.info(`Purchase completed successfully: ${purchase.id}`);
    res.status(201).json({ message: 'Purchase completed successfully!' });
  } catch (error) {
    logger.error(`error when making purchases: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

//Metodo para obtener la factura 
const getInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si Purchase está definido antes de llamar a findByPk
    if (!Purchase) {
      logger.error(`Purchase not found: ${error.message}`);
      return res.status(500).json({ error: 'Purchase model is not defined' });
    }

    const purchase = await Purchase.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['username'] },
        { model: PurchaseDetail, as: 'purchaseDetails', include: [{ model: Product, as: 'product' }] }
      ]
    });

    if (!purchase) {
      logger.warn(`Purchase not found: ${error.message}`);
      return res.status(404).json({ error: 'Purchase not found' });
    }

    res.json({ purchase });
  } catch (error) {
    logger.error(`Error retrieving purchase: ${error.message}`);
    res.status(500).json({ error: 'An error occurred while retrieving the purchase' });
  }
};


//Metodo para obtener el historial de las compras realizada por el cliente
const getPurchaseHistory = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit); // Se permitirá undefined si no se especifica

    const userId = req.user.id; // Obtener userId del usuario autenticado

    // Configurar las opciones de búsqueda
    const options = {
      where: { userId },
      distinct: true,
      include: [
        {
          model: PurchaseDetail,
          as: 'purchaseDetails',
          include: [{ model: Product, as: 'product' }]
        }
      ]
    };

    // Aplicar paginación si se especifica limit
    if (limit) {
      const offset = (page - 1) * limit;
      options.offset = offset;
      options.limit = limit;
    }
    
    const purchases = await Purchase.findAndCountAll(options);
    
    // Realizar la consulta para obtener compras y contar total de registros
    if (!limit) {
      // Si no se especifica limit, devolver todos los productos
      res.json({ purchases });
    } else {
      // Si se especifica limit, devolver productos paginados
      const totalPages = Math.ceil(purchases.count / limit);
      res.json({ purchases, totalPages });
    }

  } catch (error) {
    logger.error(`Error retrieving purchase history: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
module.exports = { purchaseProducts, getInvoice, getPurchaseHistory };
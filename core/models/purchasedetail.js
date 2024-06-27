'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PurchaseDetail extends Model {
    static associate(models) {
      // Un detalle de compra pertenece a una compra
      PurchaseDetail.belongsTo(models.Purchase, {
        foreignKey: 'purchaseId',
        as: 'purchase'
      });

      // Un detalle de compra pertenece a un producto
      PurchaseDetail.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product' // Alias para la asociación con Product
      });
    }
  }

  PurchaseDetail.init({
    purchaseId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    // otros atributos...
  }, {
    sequelize,
    modelName: 'PurchaseDetail',
  });

  return PurchaseDetail;
};
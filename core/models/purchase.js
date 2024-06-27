'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    static associate(models) {
      // Una compra pertenece a un usuario
      Purchase.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      // Una compra tiene muchos detalles de compra
      Purchase.hasMany(models.PurchaseDetail, {
        foreignKey: 'purchaseId',
        as: 'purchaseDetails'
      });
    }
  }

  Purchase.init({
    userId: DataTypes.INTEGER,
    totalPrice: DataTypes.FLOAT,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Purchase',
  });

  return Purchase;
};
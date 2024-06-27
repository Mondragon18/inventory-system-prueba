const express = require('express');
const { body } = require('express-validator');

const { createProduct, updateProduct, getProduct, deleteProduct, getProducts, getPurchases } = require('../core/controllers/admin');
const authenticate = require('../core/middleware/auth');
const isAdmin = require('../core/middleware/isAdmin');

const router = express.Router();

/**
 * @api {post} /admin/products Create Product
 * @apiName CreateProduct
 * @apiGroup Admin
 *
 * @apiHeader {String} Authorization Bearer + JWT Token obtained after login.
 *
 * @apiParam {String} batchNumber Product's lot number.
 * @apiParam {String} name Product's name.
 * @apiParam {Number} price Product's price.
 * @apiParam {Number} quantity Product's available quantity.
 * @apiParam {String} entryDate Product's date of ingress (YYYY-MM-DD).
 *
 * @apiSuccess {Object} product Created product object.
 * @apiError (400) {Object[]} errors Array of validation errors.
 * @apiError (500) {String} error Internal server error message.
 */
router.post('/products',  [
    body('batchNumber').isString(),
    body('name').isString(),
    body('price').isFloat({ min: 0 }),
    body('quantity').isInt({ min: 1 }),
    body('entryDate').isISO8601(),
], authenticate, isAdmin, createProduct);

/**
 * @api {put} /admin/products/:id Update Product
 * @apiName UpdateProduct
 * @apiGroup Admin
 *
 * @apiHeader {String} Authorization Bearer + JWT Token obtained after login.
 *
 * @apiParam {String} id Product ID.
 * @apiParam {String} [batchNumber] Updated lot number.
 * @apiParam {String} [name] Updated name.
 * @apiParam {Number} [price] Updated price.
 * @apiParam {Number} [quantity] Updated available quantity.
 * @apiParam {String} [entryDate] Updated date of ingress (YYYY-MM-DD).
 *
 * @apiSuccess {String} message Success message.
 * @apiError (400) {Object[]} errors Array of validation errors.
 * @apiError (500) {String} error Internal server error message.
 */
router.put('/products/:id', [
    body('batchNumber').isString(),
    body('name').isString(),
    body('price').isFloat({ min: 0 }),
    body('quantity').isInt({ min: 1 }),
    body('entryDate').isISO8601(),
], authenticate, isAdmin, updateProduct);

/**
 * @api {get} /admin/products/:id Get Product
 * @apiName GetProduct
 * @apiGroup Admin
 *
 * @apiHeader {String} Authorization Bearer + JWT Token obtained after login.
 * 
 * @apiParam {String} id Product ID to delete.
 * @apiSuccess {String} message Success message.
 * @apiError {String} error Error message.
 */
router.get('/products/:id', authenticate, getProduct);

/**
 * @api {delete} /admin/products/:id Delete Product
 * @apiName DeleteProduct
 * @apiGroup Admin
 *
 * @apiHeader {String} Authorization Bearer + JWT Token obtained after login.
 * 
 * @apiParam {String} id Product ID to delete.
 * @apiSuccess {String} message Success message.
 * @apiError {String} error Error message.
 */
router.delete('/products/:id', authenticate, isAdmin, deleteProduct);

/**
 * @api {get} /admin/products Get Products
 * @apiName GetProducts
 * @apiGroup Admin
 *
 * @apiHeader {String} Authorization Bearer + JWT Token obtained after login.
 * 
 * @apiParam {Number} [page=1] The page number for pagination (optional).
 * @apiParam {Number} [limit] The number of products per page for pagination (optional).
 *
 * @apiSuccess {Object[]} products List of products.
 * @apiSuccess {Number} products.count Total number of products.
 * @apiSuccess {Object[]} products.rows List of product objects.
 * @apiSuccess {Number} [totalPages] Total number of pages (only if limit is specified).
 *
 * @apiSuccessExample {json} Success-Response (without pagination):
 *     HTTP/1.1 200 OK
 *     {
 *       "products": {
 *         "count": 50,
 *         "rows": [
 *           {
 *             "id": 1,
 *             "name": "Product 1",
 *             "price": 100,
 *             "lotNumber": "12345",
 *             "quantity": 10,
 *             "createdAt": "2024-06-27T00:00:00.000Z",
 *             "updatedAt": "2024-06-27T00:00:00.000Z"
 *           },
 *           {
 *             "id": 2,
 *             "name": "Product 2",
 *             "price": 150,
 *             "lotNumber": "12346",
 *             "quantity": 5,
 *             "createdAt": "2024-06-27T00:00:00.000Z",
 *             "updatedAt": "2024-06-27T00:00:00.000Z"
 *           }
 *         ]
 *       }
 *     }
 *
 * @apiSuccessExample {json} Success-Response (with pagination):
 *     HTTP/1.1 200 OK
 *     {
 *       "products": {
 *         "count": 50,
 *         "rows": [
 *           {
 *             "id": 1,
 *             "name": "Product 1",
 *             "price": 100,
 *             "lotNumber": "12345",
 *             "quantity": 10,
 *             "createdAt": "2024-06-27T00:00:00.000Z",
 *             "updatedAt": "2024-06-27T00:00:00.000Z"
 *           },
 *           {
 *             "id": 2,
 *             "name": "Product 2",
 *             "price": 150,
 *             "lotNumber": "12346",
 *             "quantity": 5,
 *             "createdAt": "2024-06-27T00:00:00.000Z",
 *             "updatedAt": "2024-06-27T00:00:00.000Z"
 *           }
 *         ]
 *       },
 *       "totalPages": 5
 *     }
 *
 * @apiError {String} error Error message.
 */
router.get('/products', authenticate, getProducts);

/**
 * @api {get} /admin/purchases Get All Purchases
 * @apiName GetPurchases
 * @apiGroup Admin
 *
 * @apiHeader {String} Authorization Bearer + JWT Token obtained after login.
 * 
 * @apiParam {Number} [page=1] The page number for pagination (optional).
 * @apiParam {Number} [limit] The number of purchases per page for pagination (optional).
 *
 * @apiSuccess {Object[]} purchases List of purchases.
 * @apiSuccess {Number} purchases.count Total number of purchases.
 * @apiSuccess {Object[]} purchases.rows List of purchase objects.
 * @apiSuccess {Number} [totalPages] Total number of pages (only if limit is specified).
 *
 * @apiSuccessExample {json} Success-Response (without pagination):
 *     HTTP/1.1 200 OK
 *     {
 *       "purchases": [
 *         {
 *           "id": 1,
 *           "date": "2024-06-27",
 *           "total": 200,
 *           "purchaseDetails": [
 *             {
 *               "product": {
 *                 "id": 1,
 *                 "name": "Product 1",
 *                 "price": 100
 *               },
 *               "quantity": 2,
 *               "subtotal": 200
 *             }
 *           ]
 *         },
 *         {
 *           "id": 2,
 *           "date": "2024-06-28",
 *           "total": 150,
 *           "purchaseDetails": [
 *             {
 *               "product": {
 *                 "id": 2,
 *                 "name": "Product 2",
 *                 "price": 150
 *               },
 *               "quantity": 1,
 *               "subtotal": 150
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *
 * @apiSuccessExample {json} Success-Response (with pagination):
 *     HTTP/1.1 200 OK
 *     {
 *       "purchases": {
 *         "count": 50,
 *         "rows": [
 *           {
 *             "id": 1,
 *             "date": "2024-06-27",
 *             "total": 200,
 *             "purchaseDetails": [
 *               {
 *                 "product": {
 *                   "id": 1,
 *                   "name": "Product 1",
 *                   "price": 100
 *                 },
 *                 "quantity": 2,
 *                 "subtotal": 200
 *               }
 *             ]
 *           },
 *           {
 *             "id": 2,
 *             "date": "2024-06-28",
 *             "total": 150,
 *             "purchaseDetails": [
 *               {
 *                 "product": {
 *                   "id": 2,
 *                   "name": "Product 2",
 *                   "price": 150
 *                 },
 *                 "quantity": 1,
 *                 "subtotal": 150
 *               }
 *             ]
 *           }
 *         ]
 *       },
 *       "totalPages": 5
 *     }
 *
 * @apiError {String} error Error message.
 */
router.get('/purchases', authenticate, isAdmin, getPurchases);

module.exports = router;

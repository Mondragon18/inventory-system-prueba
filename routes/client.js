const express = require('express');
const { body, check} = require('express-validator');

const { purchaseProducts, getInvoice, getPurchaseHistory } = require('../core/controllers/client');
const authenticate = require('../core/middleware/auth');

const router = express.Router();

/**
 * @api {post} /client/purchase Purchase products
 * @apiName PurchaseProducts
 * @apiGroup Client
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiParam {Object[]} products List of products to purchase.
 * @apiParam {Number} products.productId ID of the product.
 * @apiParam {Number} products.quantity Quantity of the product.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "products": [
 *         {
 *           "productId": 1,
 *           "quantity": 2
 *         },
 *         {
 *           "productId": 2,
 *           "quantity": 1
 *         }
 *       ]
 *     }
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "message": "Purchase completed successfully!"
 *     }
 *
 * @apiError {String} error Error message.
 *
 * @apiErrorExample {json} Validation Error:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "errors": [
 *         {
 *           "msg": "Products should be an array",
 *           "param": "products",
 *           "location": "body"
 *         },
 *         {
 *           "msg": "Product ID should be an integer",
 *           "param": "products[0].productId",
 *           "location": "body"
 *         },
 *         {
 *           "msg": "Quantity should be an integer greater than 0",
 *           "param": "products[0].quantity",
 *           "location": "body"
 *         }
 *       ]
 *     }
 *
 * @apiErrorExample {json} Product Not Found:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Product with ID 1 not found"
 *     }
 *
 * @apiErrorExample {json} Unauthorized:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Access denied, no token provided"
 *     }
 *
 * @apiErrorExample {json} Invalid Token:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Invalid token"
 *     }
 *
 * @apiErrorExample {json} Internal Server Error:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "An error occurred"
 *     }
 */
router.post('/purchase', [
    check('products').isArray().withMessage('Products should be an array'),
    check('products.*.productId').isInt().withMessage('Product ID should be an integer'),
    check('products.*.quantity').isInt({ min: 1 }).withMessage('Quantity should be an integer greater than 0')
  ],  authenticate, purchaseProducts);

/**
 * @api {get} /client/invoice/:id Get Invoice
 * @apiName GetInvoice
 * @apiGroup Client
 *
 * @apiHeader {String} Authorization Bearer + JWT Token obtained after login.
 *
 * @apiParam {String} id Invoice ID.
 *
 * @apiSuccess {Object} purchase Invoice information.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "purchase": {
 *         "id": 1,
 *         "user": {
 *           "username": "john_doe"
 *         },
 *         "purchaseDetails": [
 *           {
 *             "id": 1,
 *             "productId": 1,
 *             "quantity": 2,
 *             "product": {
 *               "id": 1,
 *               "name": "Product A",
 *               "price": 50
 *             }
 *           },
 *           {
 *             "id": 2,
 *             "productId": 2,
 *             "quantity": 1,
 *             "product": {
 *               "id": 2,
 *               "name": "Product B",
 *               "price": 75
 *             }
 *           }
 *         ]
 *       }
 *     }
 *
 * @apiError (404) {String} error Not Found - Invoice not found.
 * @apiError (500) {String} error Internal Server Error - An error occurred while retrieving the invoice.
 */
router.get('/invoice/:id', authenticate, getInvoice);

/**
 * @api {get} /client/history Get Purchase History
 * @apiName GetPurchaseHistory
 * @apiGroup Client
 *
 * @apiHeader {String} Authorization Bearer + JWT Token obtained after login.
 *
 * @apiParam {Number} [page=1] The page number for pagination (optional).
 * @apiParam {Number} [limit] The number of purchases per page for pagination (optional).
 *
 * @apiSuccess {Object[]} purchases Array of purchase history objects.
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
router.get('/history', authenticate, getPurchaseHistory);

module.exports = router;
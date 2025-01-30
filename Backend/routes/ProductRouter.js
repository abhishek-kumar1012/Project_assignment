const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { Car } = require('../db/Schema');
const authMiddleware=require('../Middleware/authMiddleware');

const CarSchemaValidation = z.object({
    title: z.string(),
    price: z.number(),
    description: z.string(),
    images: z.array(z.string()).max(10),
    tags: z.array(z.string())
});

// Swagger doc for Create Product
/**
 * @swagger
 * /api/v1/products/createProduct:
 *   post:
 *     summary: Create a product
 *     description: Endpoint to create a new product in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the product
 *                 example: "Luxury Car"
 *               price:
 *                 type: number
 *                 description: Price of the product
 *                 example: 50000
 *               description:
 *                 type: string
 *                 description: Description of the product
 *                 example: "A premium luxury car with advanced features."
 *               images:
 *                 type: array
 *                 description: Array of image URLs
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *               tags:
 *                 type: array
 *                 description: Tags related to the product
 *                 items:
 *                   type: string
 *                 example: ["luxury", "car", "automatic"]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for authentication
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product created successfully"
 *                 productId:
 *                   type: string
 *                   example: "64c7d0b3cfa8c3f7d8d3e67b"
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */

router.post('/createProduct', authMiddleware, async (req, res) => {
    const validation = CarSchemaValidation.safeParse(req.body);

    if (!validation.success) {
        console.log('validation fails');
        return res.status(400).json(validation.error.issues);
    }

    try {
        const car = await Car.create(req.body);
        console.log('Product created successfully');
        return res.status(200).json({ message: 'Product created successfully' });
    } catch (error) {
        console.log('Inside catch'+error);
        return res.status(500).json({ message: 'Internal server error: ' + error });
    }
});

// Swagger doc for List Products
/**
 * @swagger
 * /api/v1/products/listProducts:
 *   get:
 *     summary: List all products
 *     responses:
 *       200:
 *         description: A list of products
 *       500:
 *         description: Internal Server Error
 */

router.get('/listProducts', async (req, res) => {
    try {
        const Allcars = await Car.find({});
        return res.status(200).json({ Allcars });
    } catch (error) {
        return res.status(500).json({ message: 'Error while searching through Database' });
    }
});


// Swagger doc for List Product by ID
/**
 * @swagger
 * /api/v1/products/listProduct/{id}:
 *   get:
 *     summary: List a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single product
 *       400:
 *         description: Invalid ID
 *       500:
 *         description: Internal Server Error
 */
router.get('/listProduct/:id', async (req, res) => {
    const CarId = req.params.id;

    try {
        const car = await Car.findById(CarId);
        if (!car) {
            return res.status(400).json({ msg: 'No Such Car Found' });
        }
        return res.status(200).json({ car });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
});

// Swagger doc for Update Product
/**
 * @swagger
 * /api/v1/products/updateProduct/{id}:
 *   put:
 *     summary: Update a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: string
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Update successful
 *       400:
 *         description: Invalid ID
 *       500:
 *         description: Internal Server Error
 */

router.put('/updateProduct/:id', authMiddleware,async (req, res) => {
    const validation = CarSchemaValidation.safeParse(req.body);
    const CarId = req.params.id;

    if (!validation.success) {
        return res.status(400).json(validation.error.issues);
    }
    try {
        const car = await Car.findByIdAndUpdate(CarId, req.body, { new: true });
        if (!car) {
            return res.status(400).json({ msg: 'No Such Car Found' });
        }
        return res.status(200).json({ message: 'Car Edited Successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Swagger doc for Delete Product
/**
 * @swagger
 * /api/v1/products/deleteProduct/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to delete
 *         schema:
 *           type: string
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for authentication
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Invalid ID
 *       500:
 *         description: Internal Server Error
 */

router.delete('/deleteProduct/:id', authMiddleware, async (req, res) => {
    try {
        const CarId = req.params.id;
        const response = await Car.findByIdAndDelete(CarId);
        if (!response) {
            return res.status(400).json({ message: 'No Such Car Found' });
        }
        return res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error: ' + error });
    }
});

module.exports = router;

import express from 'express';
import Product from "../model/product.model.js";
import Category from '../model/category.model.js';
import { productValidator } from "../validator/homepage.validator.js"

//Create Product
const router = express.Router();
router.post('/addProduct', async (req, res) => {
    const { error }= productValidator.validate(req.body)
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    const existingProduct = await Product.findOne({ name: req.body.name });
 
    if (existingProduct) {
      return res.status(409).json({ status: 'failed', message: 'Product already exists' });
    }
 
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      category: req.body.category,
      isFeatured: req.body.isFeatured
    });
 
    await product.save();
 
    res.status(201).json({
      data: product,
      status: 'success',
      message: 'Product has been created'
    });
  });

    

//List Products
router.get('/products', async (req, res) => {
    try {
        const productList = await Product.find();


        if (!productList) {
            res.status(404).json({ message: 'No products yet' })
        }
        res.status(200).json({
            data: productList,
            status: "success"
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: "failed", message: "internal server error" })
    }
}
)

//find a product by name
router.get('/', async (req, res) => {
    try {
        const { name } = req.query;

        const product = await Product.findOne({ name });

        if (!product) { 
            res.status(404).json({ message: 'Product not available' })
        }
        res.status(200).json({
            data: product,
            status: "success"
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: "failed", message: "internal server error" })
    }
}
)

//update
router.put('/update/:name', (req, res) => {
    const { name } = req.params;

    Product.findOneAndUpdate({ name }, req.body)
    .then(product => {
        if (product) {
            return res.status(200).json({ status: 'success', message: 'product has been updated' })
        }
        return res.status(400).json({ status: 'failed', message: "product not found" })
    }).catch(err => {
        return res.status(400).json({ status: "failed", error: err })
    })
})

//delete
router.delete('/delete/:name', (req, res) => {
    const { name } = req.params;

    Product.findOneAndRemove({ name }, req.body)
    .then(product => {
        if (product) {
            return res.status(200).json({ status: 'success', message: 'product has been deleted' })
        }
        return res.status(400).json({ status: 'failed', message: "product not found" })
    }).catch(err => {
        return res.status(400).json({ status: "failed", error: err })
    })
});


export {router}
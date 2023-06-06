import express from 'express';
import Product from "../model/product.model.js";

const router = express.Router();
router.post('/add', async (req, res)=> {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description:req.body.description,
        image: req.body.image,
    })


    if (!product) {
        return res.status(404).json({ status: 'failed', message: 'product not created' })
    }
    res.status(200).json({
        status: 'success',
        message: 'Product has been created'
    })
})

//update
router.put('/update/:id', (req, res) => {
    Product.findByIdAndUpdate(req.params.id).then(product => {
        if (category) {
            return res.status(200).json({ status: 'success', message: 'product has been updated' })
        }
        return res.status(400).json({ status: 'failed', message: "product not found" })
    }).catch(err => {
        return res.status(400).json({ status: "failed", error: err })
    })
})

//delete
router.delete('/delete/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(category => {
        if (product) {
            return res.status(200).json({ status: 'success', message: 'product has been deleted' })
        }
        return res.status(400).json({ status: 'failed', message: "product not found" })
    }).catch(err => {
        return res.status(400).json({ status: "failed", error: err })
    })
});


export {router}
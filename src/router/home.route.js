import Category from '../model/category.model.js';
import Product from '../model/product.model.js';
import express from 'express';

const router = express.Router()

//Create category
router.post('/addCategory', async (req, res)=> {

    const category = new Category({
        name: req.body.name,
        image: req.body.image,
        totalPlaces: req.body.totalPlaces
    })

    const categoryExists = await Category.find({ name: req.body.name });
    if (!categoryExists){
        res.status(404).json('Category already exists')
    }

    if (!category) {
        return res.status(404).json({ status: 'failed', message: 'Category cannot be create' })
    }
    res.status(200).json({
        data: category,
        status: 'success',
        message: 'Category has been created'
    })
    await category.save()
})


router.get('/categories', async (req, res) => {
    try {
        const categoryList = await Category.find();

        if (!categoryList) {
            res.status(500).json({ message: 'No categories yet' })
        }
        res.status(200).json({
            data: categoryList,
            status: "success"
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: "failed", message: "internal server error" })
    }
}
)

//list products in a category
router.get('/categories/:categoryName/products', (req, res) => {
    const categoryName = req.params.categoryName;
  
    Product.find({ category: categoryName })
      .then((products) => {
        res.status(200).json(products);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Internal server error' });
      });
  });
  
//search

router.get('/filter', async (req, res) => {
    try {
        const { search } = req.query;
        const query = {};

        if(search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i'} },
                    { category: { $regex: search, $options: 'i'}},
                ],
                
            }
        }
        const products = await Product.find(query);

        if(!products || products.length === 0) {
            res.status(404).json('This food is unavailable')
        }
        res.status(201).json(products)
    }catch (error) {
        res.status(500).json({error: 'An error occured'})
    }

}
)

//update

router.put('/update/:name', (req, res) => {
    const { name } = req.params;

    Category.findOneAndUpdate({ name }, req.body).then(category => {
        if (category) {
            return res.status(200).json({ status: 'success', message: 'category has been updated' })
        }
        return res.status(400).json({ status: 'failed', message: "category not found" })
    }).catch(err => {
        return res.status(400).json({ status: "failed", error: err })
    })
})

//delete
router.delete('/delete/:name', (req, res) => {
    const { name } = req.params;

    Category.findOneAndRemove({ name }, req.body).then(category => {
        if (!category) {
            return res.status(400).json({ status: 'failed', message: "category not found" })
        }
        return res.status(200).json({ status: 'success', message: 'category has been deleted'
         })
    }).catch(err => {
        return res.status(400).json({ status: "failed", error: err })
    })
})

export { router }

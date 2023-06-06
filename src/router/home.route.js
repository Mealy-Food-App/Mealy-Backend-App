import Category from '../model/category.model.js'
import express from 'express';

const router = express.Router()

router.get('/category', async (req, res) => {
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
catch(err){
    console.log(err);
    res.status(500).json({status:"failed", message:"internal server error"})
}
}
)

//search
router.get('/category/:search', async (req, res) => {
    try {
        const search = req.query.search || ""
        const categoryList = await Category.find({ name: { $regex:search}});

        if (!categoryList) {
            res.status(500).json({ message: 'No categories yet' })
        }
        res.status(200).json({
            data: categoryList,
            status: "success"
        })
    }
catch(err){
    console.log(err);
    res.status(500).json({status:"failed", message:"internal server error"})
}
}
)

router.post('/addcategory', async (req, res) => {
    const category = new Category({
        name: req.body.name,
        image: req.body.image,
        totalPlaces: req.body.totalPlaces
    })
    await category.save();

    if (!category) {
        return res.status(404).json({ status: 'failed', message: 'category not created' })
    }
    res.status(200).json({
        status: 'success',
        message: 'Category has been created'
    })
})

//update
router.put('/update/:id', (req, res) => {
    Category.findByIdAndUpdate(req.params.id).then(category => {
        if (category) {
            return res.status(200).json({ status: 'success', message: 'category has been updated' })
        }
        return res.status(400).json({ status: 'failed', message: "category nort found" })
    }).catch(err => {
        return res.status(400).json({ status: "failed", error: err })
    })
})

//delete
router.delete('/deletecategory/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if (category) {
            return res.status(200).json({ status: 'success', message: 'category has been deleted' })
        }
        return res.status(400).json({ status: 'failed', message: "category nort found" })
    }).catch(err => {
        return res.status(400).json({ status: "failed", error: err })
    })
})

export { router }

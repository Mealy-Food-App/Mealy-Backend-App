import express from "express";
const userController = require('../controllers/user.auth')

const router = express.Router();
router.post('/signup', authController.signup);



module.exports = router;
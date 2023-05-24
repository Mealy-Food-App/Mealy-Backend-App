// USER AUTH
import User from "../model/user.model.js";
const catchAsync = require('../utils/catchAsync.js');

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body)

    // send new user to client
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    });
});
module.exports = User;
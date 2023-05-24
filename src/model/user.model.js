// USER MODEL

const mongoose = require('mongoose');
import validator from "validator";

// name, email, password, passwordConfirm

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please tell us your name'],
    },
    email: {
        type: String,
        require: [true, 'please tell us your name'],
        unique: true,
        lowercase: true,
        validator: [validator.isEmail, 'please provide a valid email']
    },
    phone: {
        type: String,
        required: [true, 'please provide your phone number'],
        minlength: 11
      },
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minlength: 6
    },
    passwordConfirm: {
        type: String,
        required: [true, 'please provide a password'],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'password are not the same!'
        }
    }
});

// This is a pre-middleware on save that happens betweern getting and saving the data to the database.
userSchema.pre('save', function(next) {
    if(!this.isModified('password')) return next();
})


// creating the model out of the schema
const user = mongoose.model('user', userSchema)
module.exports = user;

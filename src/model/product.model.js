import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name : {
        type: String,
        required: true,
    },
   price: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    images: [{
        type: String,
    }],
    category: {
        type: String,
        ref: 'Category',
        required: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
});
  
  export default model('Product', productSchema);
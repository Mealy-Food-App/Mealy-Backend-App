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
    image: [{
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
},
{
    timestamps: true,
  }
);
  
  export default model('Product', productSchema);
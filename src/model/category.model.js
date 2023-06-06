import { Schema, model } from "mongoose";

const categorySchema = new Schema ({
    name : {
        type: String,
        required: true
    },
    image: [{
        type: String,
    }],
    totalPlaces: {
        type: String,
        required: true
    }

})

export default model('Category', categorySchema);
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  deliveryDate: {
    type: Date,
    required: true,
  },
});

const delivery = mongoose.model('delivery', cartSchema);

export default delivery;

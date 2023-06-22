import mongoose from 'mongoose';

const orderHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  deliveryAddress: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryDate: {
    type: Date,
    ref: "delivery"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('OrderHistory', orderHistorySchema);

export default Order;

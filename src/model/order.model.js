import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
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
  cartAmount:{
    type: Number,
    required: false,
  },
  deliveryCharge: {
    type: Number,
    required: false,
  },
  discountAmount: {
    type: Number,
    required: false,
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
  orderId: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'paid', 'canceled'],
    default: 'pending',
    required: true,
  },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;

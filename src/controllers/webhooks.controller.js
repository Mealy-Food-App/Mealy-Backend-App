import Order from "../model/order.model.js";


export async function handleSuccessfulPayment(req, res) {
  try {

    if (!req.user) {
        return res.status(401).json({
          status: "failed",
          message: "Unauthorized",
        });
      }
      
    const orderId = req.body.orderId;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        status: 'failed',
        message: 'Order not found',
      });
    }

    order.orderStatus = 'paid';
    await order.save();

    res.status(200).json({
      status: 'success',
      message: 'Payment successful. Order marked as paid.',
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}



export async function handleCanceledPayment(req, res) {
  try {
    const orderId = req.body.orderId;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        status: 'failed',
        message: 'Order not found',
      });
    }
    order.orderStatus = 'canceled';
    await order.save();

    res.status(200).json({
      status: 'success',
      message: 'Payment failed. Order marked as canceled.',
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

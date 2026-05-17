const Order = require('../models/Order');

exports.addOrderItems = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ success: false, error: 'No order items' });
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();
      res.status(201).json({ success: true, data: createdOrder });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updatedOrder = await order.save();
      res.status(200).json({ success: true, data: updatedOrder });
    } else {
      res.status(404).json({ success: false, error: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = req.body.status;
      if (req.body.status === 'Delivered') {
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.status(200).json({ success: true, data: updatedOrder });
    } else {
      res.status(404).json({ success: false, error: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

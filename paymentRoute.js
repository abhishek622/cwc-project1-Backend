require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const uniquId = require('uniqid');

const router = express.Router();

router.post('/orders', async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: 500, // amount in smallest currency unit
      currency: 'INR',
      receipt: uniquId(),
    };

    await instance.orders.create(options, (err, order) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      orderId = order.id;
      res.json(order);
    });

  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/success', async (req, res) => {
  try {
   
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    const hash = crypto
      .createHmac('sha256', process.env.SECRET_KEY)
      .update(`${orderCreationId}|${razorpayPaymentId}`)
      .digest('hex');

    if (hash !== razorpaySignature)
      return res.status(400).json({ msg: 'Transaction not legit!' });

    res.json({
      msg: 'success',
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

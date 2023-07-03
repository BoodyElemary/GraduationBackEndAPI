const mongoose = require('mongoose');
const OrderModel = mongoose.model('Order');
const CustomerModel = mongoose.model('Customer');
const AdminModel = mongoose.model('Admin');
const { validationResult } = require('express-validator');
const { calculateTotalPrice } = require('../util/calculateTotalPrice');
const { checkForDuplicates } = require('../util/checkForProductsDuplication');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const endpointSecret =
//   "whsec_2908c30ff34b061a57104853f5123ad0fad4d4afe0eb15828b5dc41a26ff251c";
const { error, Console } = require('console');
const { io } = require('../socket');

// Used Variables
let currentOrder;
let currentUserId;
let currentVoucherId;

//
//
// ------------------ Controller for creating order
const createOrder = async (req, res, next) => {
  // Validating the order
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Getting User ID
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken.id;

    let admin = await AdminModel.findOne({ store: req.body.store });
    if (!admin) {
      throw new Error("This Store Admin Doesn't Exist");
    }
    const order = new OrderModel({
      customer: userId,
      pickUpTime: req.body.pickUpTime,
      arrivalTime: req.body.arrivalTime,
      status: 'pending',
      note: req.body.note,
      orderedProducts: req.body.orderedProducts,
      orderedCustomizedProducts: req.body.orderedCustomizedProducts,
      store: req.body.store,
      voucher: req.body.voucher,
    });

    // Checking for duplicated products IDs
    let isDuplicated = checkForDuplicates(
      req.body.orderedProducts,
      req.body.orderedCustomizedProducts,
    );
    if (isDuplicated) {
      throw new Error(
        'Error sending order (Duplication) ... Please report and try again later.',
      );
    }

    // Calculating Total Price
    let {
      subTotal,
      discount,
      totalPrice,
      voucherCode,
      voucherID,
      finalOrderProducts,
    } = await calculateTotalPrice(req.body);

    order.subTotal = subTotal;
    order.discount = discount;
    order.totalPrice = totalPrice;
    order.voucher = voucherID;

    //
    //
    // Connecting to payment method
    const session = await stripe.checkout.sessions.create({
      line_items: finalOrderProducts.map((product) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: [product.picture],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: product.quantity,
      })),
      mode: 'payment',
      success_url: `http://localhost:4200/app/${order._id}/success`,
      cancel_url: `http://localhost:4200/app/${order._id}/fail`,
    });
    //io.to(admin._id).emit('new-order', { message: 'A new order has been placed', data: order });

    // Setting Current Order Variables
    currentOrder = order;
    currentUserId = userId;
    currentVoucherId = voucherID;
    res.json({ session: session, message: 'Order Ready for payment' });
  } catch (error) {
    console.log(error);
    res.send(error.status);
  }
};

//
//
// ------------------ Controller for creating order
const confirmedOrder = async (req, res, next) => {
  try {
    //
    // Checking for Status
    let paymentStatus = req.body.data.object.payment_status;
    switch (paymentStatus) {
      case 'paid':
        //
        // Saving order and updating customer
        const savedOrder = await currentOrder.save();
        await CustomerModel.findByIdAndUpdate(
          currentUserId,
          {
            $push: {
              customerOrders: savedOrder,
              voucherList: currentVoucherId,
            },
          },
          { new: true },
        );

        res.json({ message: 'Order Placed Successfully' });
        break;

      default:
        res.json({ message: 'Error Processing Payment' });
        break;
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//
//
// ----------------- Get All orders with pagination
const getAllOrders = async (req, res) => {
  // For Pagination
  const page = parseInt(req.query.page) || 1; // Page number, default to 1
  const limit = parseInt(req.query.limit) || 10; // Limit of retrieved orders, default to 10
  const skip = (page - 1) * limit; // Skipped orders in a certain page

  try {
    const orders = await OrderModel.find()

      .sort({ createdAt: -1 })
      .populate('customer', { _id: 1 })
      .select('pickUpTime')
      .select('arrivalTime')
      .select('note')
      .populate('orderedProducts.product', {
        status: 0,
        category: 0,
        details: 0,
      })
      .populate('orderedProducts.quantity')
      .populate({
        path: 'orderedCustomizedProducts',
        populate: {
          path: 'base flavor toppings.topping',
        },
      })
      .populate('store')
      .select('status')
      .select('subTotal')
      .select('discount')
      .select('totalPrice')
      .select('createdAt')
      .skip(skip)
      .limit(limit); // Add skip and limit to the query

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

//
//
// ------------------------ Retrieving single order by id
const getOrderById = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id)
      .populate('customer', { _id: 1 })
      .populate('pickUpTime')
      .populate('arrivalTime')
      .populate('note')
      .populate('status')
      .populate('orderedProducts.product orderedProducts.quantity')
      .populate({
        path: 'orderedCustomizedProducts',
        populate: {
          path: 'base flavor ',
        },
      })
      .populate({
        path: 'orderedCustomizedProducts',
        populate: {
          path: 'toppings',
          populate: {
            path: 'toppingType',
            select: 'price type',
          },
        },
      })
      .populate('store')
      .select('status')
      .select('subTotal')
      .select('discount')
      .populate('totalPrice')
      .select('createdAt');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

//
//
// --------------------------- Update an Order as a customer ------------------------
const updateOrderAsCustomer = async (req, res, next) => {
  try {
    // Prevent pther values
    if (
      req.body.orderedProducts ||
      req.body.orderedCustomizedProducts ||
      req.body.store ||
      req.body.voucher ||
      req.body.customer ||
      req.body.subTotal ||
      req.body.discount ||
      req.body.totalPrice
    ) {
      throw new Error('Cannot edit this field!!!');
    }

    // Calculate the time to check the editing availability
    let oldOrder = await OrderModel.findById(req.params.id)
      .select('pickUpTime')
      .select('status');
    let oldOrderStatus = oldOrder.status;
    let OrderPickUpTime = new Date(oldOrder.pickUpTime);
    const PickUpTime = new Date(OrderPickUpTime.getTime());
    const now = new Date();
    let ONE_HOUR = 2 * 60 * 60 * 1000;
    const nowTimePlusHour = new Date(now.getTime() + ONE_HOUR);

    if (oldOrderStatus != 'pending') {
      throw new Error('Cannot edit this order due to its status');
    }

    if (nowTimePlusHour >= PickUpTime) {
      throw new Error('Cannot edit order in one hour before pickup time');
    }

    // Assign arrival time i case of pick up time editing
    if (!req.body.arrivalTime && req.body.pickUpTime) {
      req.body.arrivalTime = req.body.pickUpTime;
    }

    const order = await OrderModel.findByIdAndUpdate(
      req.params.id,
      {
        pickUpTime: req.body.pickUpTime,
        arrivalTime: req.body.arrivalTime,
        note: req.body.note,
        status: req.body.status,
      },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      message: 'Order has been Updated successfully',
      order,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

//
//
// --------------------------- Update an Order as Admin------------------------
const updateOrderAsAdmin = async (req, res, next) => {
  try {
    // Calculate the time to check the editing availability
    let oldOrder = await OrderModel.findById(req.params.id).select(
      'pickUpTime',
    );

    let OrderPickUpTime = new Date(oldOrder.pickUpTime);
    const PickUpTime = new Date(OrderPickUpTime.getTime());
    const now = new Date();
    const nowTime = new Date(now.getTime());
    if (nowTime >= PickUpTime) {
      throw new Error('Cannot edit order after pickup time');
    }

    const order = await OrderModel.findByIdAndUpdate(
      req.params.id,
      {
        pickUpTime: req.body.pickUpTime,
        arrivalTime: req.body.arrivalTime,
        status: req.body.status,
        note: req.body.note,
        orderedProducts: req.body.orderedProducts,
        orderedCustomizedProducts: req.body.orderedCustomizedProducts,
        store: req.body.store,
        voucher: req.body.voucher,
      },
      { new: true },
    )
      .populate('orderedProducts.product')
      .populate({
        path: 'orderedCustomizedProducts',
        populate: {
          path: 'base flavor toppings.topping',
        },
      })
      .populate('store')
      .populate('voucher');

    if (req.body.orderedProducts || req.body.orderedCustomizedProducts) {
      let { subTotal, discount, totalPrice } = await calculateTotalPrice(order);
      order.subTotal = subTotal;
      order.discount = discount;
      order.totalPrice = totalPrice;
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      message: 'Order has been Updated successfully',
      order,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

//
//
// ---------------------------- Deleting an order
const deleteOrderByAdmin = async (req, res, next) => {
  try {
    const order = await OrderModel.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    } else {
      res.status(200).json({
        success: true,
        message: 'Order has been deleted successfully',
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

//
//
// ------------------------ Retrieving customer orders
const getCustomerOrders = async (req, res) => {
  try {
    // For Pagination
    const page = parseInt(req.query.page) || 1; // Page number, default to 1
    const limit = parseInt(req.query.limit) || 10; // Limit of retrieved orders, default to 10
    const skip = (page - 1) * limit; // Skipped orders in a certain page
    // Assuming you have a token in the request headers
    const token = req.headers.authorization;
    // Verify the token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken.id;
    console.log('userId :', userId);
    let id = req.body.id;

    const orders = await OrderModel.find({ customer: userId })
      .sort({ createdAt: -1 })
      .select('pickUpTime')
      .select('arrivalTime')
      .select('note')
      .populate('orderedProducts.product', {
        status: 0,
        category: 0,
        details: 0,
      })
      .populate('orderedProducts.quantity')

      .populate({
        path: 'orderedCustomizedProducts',
        populate: {
          path: 'base flavor toppings.topping',
        },
      })
      .populate('store')
      .select('status')
      .select('subTotal')
      .select('discount')
      .select('totalPrice')
      .select('createdAt')
      .skip(skip)
      .limit(limit); // Add skip and limit to the query

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
const getStoreOrdersById = async (req, res) => {
  // For Pagination
  const page = parseInt(req.query.page) || 1; // Page number, default to 1
  const limit = parseInt(req.query.limit) || 10; // Limit of retrieved orders, default to 10
  const skip = (page - 1) * limit; // Skipped orders in a certain page

  const storeId = req.params.id; // Extract the store ID from req.params

  try {
    const orders = await OrderModel.find({ store: storeId })
      .sort({ createdAt: -1 }) // Add the store filter
      .populate('customer', { _id: 1, firstName: 1, lastName: 1 })
      .select('pickUpTime')
      .select('arrivalTime')
      .select('note')
      .populate('orderedProducts.product', {
        status: 0,
        category: 0,
        details: 0,
      })
      .populate('orderedProducts.quantity')
      .populate({
        path: 'orderedCustomizedProducts',
        populate: {
          path: 'base flavor toppings.topping',
        },
      })
      .populate('store')
      .select('status')
      .select('subTotal')
      .select('discount')
      .select('totalPrice')
      .select('createdAt')
      .skip(skip)
      .limit(limit); // Add skip and limit to the query

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getStoreOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;
    const token = req.headers.authorization;
    console.log(token);
    const decodedToken = jwt.verify(
      token.replace('Bearer ', ''),
      process.env.SECRET_KEY
    );
    const storeId = decodedToken.storeId;
    console.log('storeId:', storeId);

    const count = await OrderModel.countDocuments({ store: storeId });

    const orders = await OrderModel.find({ store: storeId })
      .sort({ createdAt: -1 })
      .populate("customer", { _id: 1, firstName: 1, lastName: 1 })
      .select("pickUpTime arrivalTime note")
      .populate("orderedProducts.product", {
        status: 0,
        category: 0,
        details: 0,
      })
      .populate('orderedProducts.quantity')
      .populate({
        path: 'orderedCustomizedProducts',
        populate: [
          { path: 'base' },
          { path: 'flavor' },
          {
            path: 'toppings',
            populate: {
              path: 'toppingType',
              select: 'price type',
            },
          },
        ],
      })
      .populate('store')
      .select('status subTotal discount totalPrice createdAt')
      .skip(skip)
      .limit(limit);

    res.json({ orders, total: count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};


const searchStoreOrders = async (req, res, next) => {
  try {
    const { firstName, lastName } = req.query;
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(
      token.replace('Bearer ', ''),
      process.env.SECRET_KEY,
    );
    const storeId = decodedToken.storeId;

    const searchCriteria = { store: storeId };

    if (firstName) {
      searchCriteria['customer.firstName'] = {
        $regex: firstName,
        $options: 'i',
      };
    }

    if (lastName) {
      searchCriteria['customer.lastName'] = {
        $regex: lastName,
        $options: 'i',
      };
    }

    const orders = await OrderModel.find(searchCriteria).populate('customer');
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const token = req.headers.authorization;
    // Verify the token and extract the role
    const decodedToken = jwt.verify(
      token.replace('Bearer ', ''),
      process.env.SECRET_KEY,
    );
    console.log(decodedToken.role);
    const role = decodedToken.role;

    // Check if the role is admin
    if (role !== 'admin' && role !== 'super') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderAsCustomer,
  updateOrderAsAdmin,
  deleteOrderByAdmin,
  getAllOrders,
  getCustomerOrders,
  confirmedOrder,
  getStoreOrders,
  getStoreOrdersById,
  updateOrderStatus,
  searchStoreOrders,
};

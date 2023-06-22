const mongoose = require("mongoose");
const path = require("path");
const OrderModel = mongoose.model("Order");
const ProductModel = mongoose.model("Product");
const BaseModel = mongoose.model("Base");
const FlavorModel = mongoose.model("Flavor");
const ToppingModel = mongoose.model("Topping");
const VoucherModel = mongoose.model("Voucher");
const { validationResult } = require("express-validator");
const { calculateTotalPrice } = require("../util/calculateTotalPrice");
const { checkForDuplicates } = require("../util/checkForProductsDuplication");

// ------------------ Controller for creating order
const createOrder = async (req, res, next) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const order = new OrderModel({
      customer: req.body.customer,
      pickUpTime: req.body.pickUpTime,
      arrivalTime: req.body.arrivalTime,
      status: "pending",
      note: req.body.note,
      orderedProducts: req.body.orderedProducts,
      orderedCustomizedProducts: req.body.orderedCustomizedProducts,
      store: req.body.store,
      voucher: req.body.voucher,
    });

    // Check for duplication
    let isDuplicated = checkForDuplicates(
      req.body.orderedProducts,
      req.body.orderedCustomizedProducts
    );
    if (isDuplicated) {
      throw new Error(
        "Error sending order (Duplication) ... Please report and try again later."
      );
    }

    // Calculate price
    let { subTotal, discount, totalPrice } = await calculateTotalPrice(req);
    // console.log(subTotal);
    // console.log(discount);
    // console.log(totalPrice);
    order.subTotal = subTotal;
    order.discount = discount;
    order.totalPrice = totalPrice;
    // console.log(order);
    const savedOrder = await order.save();

    res
      .status(201)
      .json({ success: true, message: "Order has been created successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// ----------------- Get All orders with pagination
const getAllOrders = async (req, res) => {
  // For Pagination
  const page = parseInt(req.query.page) || 1; // Page number, default to 1
  const limit = parseInt(req.query.limit) || 10; // Limit of retrieved orders, default to 10
  const skip = (page - 1) * limit; // Skipped orders in a certain page

  try {
    const orders = await OrderModel.find()
      .populate("customer", { _id: 1 })
      .select("pickUpTime")
      .select("arrivalTime")
      .select("note")
      .populate("orderedProducts.product", {
        status: 0,
        category: 0,
        details: 0,
      })
      .populate("orderedProducts.quantity")
      .populate({
        path: "orderedCustomizedProducts",
        populate: {
          path: "base flavor toppings.topping",
        },
      })
      .populate("store", { name: 1, location: 1 })
      // .populate("voucher", { percentage: 1, code: 1 })
      .select("status")
      .select("subTotal")
      .select("discount")
      .select("totalPrice")
      .select("createdAt")
      // .select("updatedAt")
      .skip(skip)
      .limit(limit); // Add skip and limit to the query

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------------ Retrieving single order by id
const getOrderById = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id)
      .populate("customer", { _id: 1 })
      .populate("pickUpTime")
      .populate("arrivalTime")
      .populate("note")
      .populate("status")
      .populate("orderedProducts.product")
      .populate({
        path: "orderedCustomizedProducts",
        populate: {
          path: "base flavor toppings.topping",
        },
      })
      .populate("store", { name: 1, location: 1 })
      .select("status")
      .select("subTotal")
      .select("discount")
      .populate("totalPrice")
      .select("createdAt");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

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
      req.body.status ||
      req.body.subTotal ||
      req.body.discount ||
      req.body.totalPrice
    ) {
      throw new Error("Cannot edit this field!!!");
    }

    // Calculate the time to check the editing availability 
    let oldOrder = await OrderModel.findById(req.params.id).select(
      "pickUpTime -_id"
    );

    let OrderPickUpTime = new Date(oldOrder.pickUpTime);
    const PickUpTime = new Date(OrderPickUpTime.getTime());
    const now = new Date();
    let ONE_HOUR = 2*60 * 60 * 1000;
    const nowTimePlusHour = new Date(now.getTime() + ONE_HOUR);

    if (nowTimePlusHour >= PickUpTime) {
      throw new Error("Cannot edit order in one hour before pickup time");
    }

    // Assign arrival time i case of pick up time editing
    if(!req.body.arrivalTime && req.body.pickUpTime){
      req.body.arrivalTime = req.body.pickUpTime
    }

    const order = await OrderModel.findByIdAndUpdate(
      req.params.id,
      {
        pickUpTime: req.body.pickUpTime,
        arrivalTime: req.body.arrivalTime,
        note: req.body.note,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order has been Updated successfully",
      order,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// --------------------------- Update an Order as Admin------------------------
const updateOrderAsAdmin = async (req, res) => {
  try {
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
        totalPrice: req.body.totalPrice,
      },
      { new: true }
    )
      .populate("orderedProducts.product")
      .populate({
        path: "orderedCustomizedProducts",
        populate: {
          path: "base flavor toppings.topping",
        },
      })
      .populate("store")
      .populate("voucher");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------------------- Deleting an order
const deleteOrder = async (req, res) => {
  try {
    const order = await OrderModel.findByIdAndDelete(req.params.id);
    console.log(order);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    } else {
      res.status(200).json({
        success: true,
        message: "Order has been deleted successfully",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderAsCustomer,
  updateOrderAsAdmin,
  deleteOrder,
  getAllOrders,
};

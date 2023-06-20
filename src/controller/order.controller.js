const mongoose = require("mongoose");
const path = require("path");
const OrderModel = mongoose.model("Order");
const ProductModel = mongoose.model("Product");
const BaseModel = mongoose.model("Base");
const FlavorModel = mongoose.model("Flavor");
const ToppingModel = mongoose.model("Topping");
const VoucherModel = mongoose.model("Voucher");

// ------------------ Controller for creating order
const createOrder = async (req, res) => {
  try {
    const order = new OrderModel({
      pickUpTime: req.body.pickUpTime,
      arrivalTime: req.body.arrivalTime,
      status: "pending",
      note: req.body.note,
      orderedProducts: req.body.orderedProducts,
      orderedCustomizedProducts: req.body.orderedCustomizedProducts,
      store: req.body.store,
      //   voucher: req.body.voucher.trim(),
      totalPrice: req.body.totalPrice,
    });

    let totalPrice = 0;

    // Price of OrderedProducts && Total
    if (req.body.orderedProducts || req.body.orderedCustomizedProducts) {
      req.body.orderedProducts.forEach(async (product) => {
        productPrice =
          (await ProductModel.findById(product.product).price) *
          product.quantity; // price for each quantity of single product
        totalPrice += productPrice;
      });

      // Price of Customizables && Total
      req.body.orderedCustomizedProducts.forEach(async (drink) => {
        basePrice = await BaseModel.findById(drink.base).price;
        flavorPrice = await FlavorModel.findById(drink.flavor).price;
        toppingsPrice = drink.toppings.reduce(
          async (prev, curr) =>
            prev +
            (await ToppingModel.findById(curr.topping).price) * curr.quantity,
          0
        );
        totalPrice += basePrice + flavorPrice + toppingsPrice;
      });
    } else {
      res.json("Order is empty");
    }

    let discountPercentage = 0;
    const getDiscount = async (discount) => {
      if (req.body.voucher) {
        let voucher = await VoucherModel.findById(req.body.voucher);
        if (!voucher) {
          return;
        } else if (voucher.expireDate > Date.now()) {
          return;
        } else {
          discountPercentage = voucher.percentage;
        }
      }
    };
    let discount = discountPercentage * totalPrice;
    totalPrice = totalPrice - discount;

    const savedOrder = await order.save();

    res
      .status(201)
      .json({ success: true, message: "Order has been created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
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
      .populate("pickUpTime")
      .populate("status")
      .populate("note")
      .populate("orderedProducts.product", { status: 0 })
      .populate({
        path: "orderedCustomizedProducts",
        populate: {
          path: "base flavor toppings.topping",
        },
      })
      .populate("store", { name: 1, location: 1 })
      .populate("voucher", { percentage: 1 })
      .populate("totalPrice")
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
      .populate("pickUpTime")
      .populate("status")
      .populate("note")
      .populate("orderedProducts.product")
      .populate({
        path: "orderedCustomizedProducts",
        populate: {
          path: "base flavor toppings.topping",
        },
      })
      .populate("store")
      .populate("voucher")
      .populate("totalPrice");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// --------------------------- Update an Order
const updateOrder = async (req, res) => {
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

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res
      .status(204)
      .json({ success: true, message: "Order has been deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  getAllOrders,
};

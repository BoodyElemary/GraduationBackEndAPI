const { log } = require("console");
const mongoose = require("mongoose");
const ProductModel = mongoose.model("Product");
const BaseModel = mongoose.model("Base");
const FlavorModel = mongoose.model("Flavor");
const ToppingModel = mongoose.model("Topping");
const VoucherModel = mongoose.model("Voucher");

exports.calculateTotalPrice = async (req) => {
  let subTotal = 0;
  let totalPrice = 0;
  let totalCustomizablesPrice = 0;
  let discount = 0;
  let discountPercentage = 0;
  // check if the order has any products
  if (req.body.orderedProducts || req.body.orderedCustomizedProducts) {
    //
    // Price of OrderedProducts && Total
    if (req.body.orderedProducts) {
      for (let product of req.body.orderedProducts) {
        let productPriceObject = await ProductModel.findById(product.product, {
          price: 1,
          _id: 0,
        });
        let productPrice = productPriceObject.price * product.quantity;
        subTotal += productPrice;
      }
    }
    // console.log("Total of ordered: " + subTotal);

    //
    // Price of Customizables && Total
    if (req.body.orderedCustomizedProducts) {
      for (let drink of req.body.orderedCustomizedProducts) {
        let basePriceData = await BaseModel.findById(drink.base, {
          price: 1,
          _id: 0,
        });
        let flavorPriceDate = await FlavorModel.findById(drink.flavor, {
          price: 1,
          _id: 0,
        });
        let basePrice = basePriceData.price;
        let flavorPrice = flavorPriceDate.price;
        let toppingsPrice = 0;
        for (let topping of drink.toppings) {
          let currentToppingData = await ToppingModel.findById(
            topping
          ).populate({
            path: "toppingType",
            select: "price",
          });
          if (!currentToppingData) {
            throw new Error("Topping does not exist");
          }
          toppingsPrice += currentToppingData.toppingType.price;
        }
        totalCustomizablesPrice +=
          (basePrice + flavorPrice + toppingsPrice) * drink.quantity;
      }
    }
  } else {
    throw new Error("Order is empty");
  }
  // console.log("Total of Customized: " + totalCustomizablesPrice);
  subTotal += totalCustomizablesPrice;
  // console.log("Subtotal: " + subTotal);

  //
  // Calculate the voucher discount
  if (req.body.voucher) {
    let voucher = await VoucherModel.findById(req.body.voucher, {
      percentage: 1,
      _id: 0,
    });
    voucherPercentage = voucher.percentage;
    if (!voucher) {
      return;
    } else if (voucher.expireDate > Date.now()) {
      return;
    } else {
      discountPercentage = voucher.percentage;
    }
  } else {
    discountPercentage = 0;
  }
  // console.log("voucher Percentage: " + discountPercentage);

  discount = discountPercentage * subTotal;
  totalPrice = subTotal - discount;

  const calculations = {
    subTotal: subTotal,
    discount: discount,
    totalPrice: totalPrice,
  };
  return calculations;
};

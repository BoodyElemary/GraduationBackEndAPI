const { log } = require("console");
const mongoose = require("mongoose");
const ProductModel = mongoose.model("Product");
const BaseModel = mongoose.model("Base");
const FlavorModel = mongoose.model("Flavor");
const ToppingModel = mongoose.model("Topping");
const VoucherModel = mongoose.model("Voucher");

exports.calculateTotalPrice = async (arr) => {
  let subTotal = 0;
  let totalPrice = 0;
  let totalCustomizablesPrice = 0;
  let discount = 0;
  let discountPercentage = 0;
  // check if the order has any products

  if (arr.orderedProducts || arr.orderedCustomizedProducts) {
    //
    // Price of OrderedProducts && Total
    try {
      if (arr.orderedProducts) {
        for (let product of arr.orderedProducts) {
          let productPriceObject = await ProductModel.findById(
            product.product,
            {
              price: 1,
              _id: 0,
            }
          );
          let productPrice = productPriceObject.price * product.quantity;
          subTotal += productPrice;
        }
      }
    } catch (error) {
      throw new Error("Product Doesn't Exist");
    }

    // console.log("Total of ordered: " + subTotal);

    //
    // Price of Customizables && Total
    if (arr.orderedCustomizedProducts) {
      try {
        for (let drink of arr.orderedCustomizedProducts) {
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
      } catch (error) {
        throw new Error("Customized product Doesn't Exist");
      }
    }

    // console.log("Total of Customized: " + totalCustomizablesPrice);
    subTotal += totalCustomizablesPrice;
    // console.log("Subtotal: " + subTotal);

    //
    // Calculate the voucher discount
    let voucherCode = "";
    let voucherID = "";
    if (arr.voucher) {
      let voucher = await VoucherModel.findOne({ code: arr.voucher });
      voucherID = voucher._id
      voucherPercentage = voucher.percentage;

      voucherCode = voucher.code;
      if (!voucher) {
        return;
      } else if (voucher.expireDate > Date.now()) {
        throw new Error("Customized product Doesn't Exist");
      } else {
        discountPercentage = voucher.percentage;
      }
    } else {
      discountPercentage = 0;
    }


    discount = discountPercentage * subTotal;
    totalPrice = subTotal - discount;

    const calculations = {
      subTotal: subTotal,
      discount: discount,
      totalPrice: totalPrice,
      voucherCode: voucherCode,
      voucherID: voucherID,
    };


    return calculations;
  } else {
    throw new Error("Order is empty");
  }
};

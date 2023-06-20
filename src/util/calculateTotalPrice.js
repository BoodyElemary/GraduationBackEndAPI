
const mongoose = require("mongoose");
const ProductModel = mongoose.model("Product");
const BaseModel = mongoose.model("Base");
const FlavorModel = mongoose.model("Flavor");
const ToppingModel = mongoose.model("Topping");
const VoucherModel = mongoose.model("Voucher");


exports.calculateTotalPrice = async(req)=>{
    let totalPrice = 0;
    // check if the order has any products
    if (req.body.orderedProducts || req.body.orderedCustomizedProducts) {
      // Price of OrderedProducts && Total
      if (req.body.orderedProducts) {
        req.body.orderedProducts.forEach(async (product) => {
          let productPriceObject = await ProductModel.findById(
            product.product,
            {
              price: 1,
              _id: 0,
            }
          );
          let productPrice = productPriceObject.price * product.quantity;
          totalPrice += productPrice;
        });
      }

      // Price of Customizables && Total
      if (req.body.orderedCustomizedProducts) {
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
      }
    } else {
      throw new Error("Order is empty");
    }

    let voucherPercentage = 0;
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
    }
    
    let discount = discountPercentage * totalPrice;
    totalPrice = totalPrice - discount;
    
    return totalPrice
}
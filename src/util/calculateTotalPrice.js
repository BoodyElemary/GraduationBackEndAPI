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
  let productsArr = [];
  let customProductsArr = [];

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
              name: 1,
              picture: 1,
              _id: 0,
            }
          );

          if (product.size === "M") {
            productPriceObject.price = productPriceObject.price * 1.2;
          } else if (product.size === "L") {
            productPriceObject.price = productPriceObject.price * 1.4;
          }

          productsArr.push({
            name: productPriceObject.name,
            price: productPriceObject.price,
            picture: productPriceObject.picture,
            quantity: product.quantity,
          });
          let productPrice = productPriceObject.price * product.quantity;
          subTotal += productPrice;
        }
      }
    } catch (error) {
      throw new Error("Product Doesn't Exist" + error);
    }

    // console.log(productsArr);

    //
    // Price of Customizables && Total
    if (arr.orderedCustomizedProducts) {
      try {
        for (let drink of arr.orderedCustomizedProducts) {
          let singleTopping = [];
          let toppingName = " | Toppings: ";
          let currentProductName = "";
          let currentProductPrice = 0;
          let customDrink = {};

          let basePriceData = await BaseModel.findById(drink.base, {
            price: 1,
            name: 1,
            picture: 1,
            _id: 0,
          });
          customDrink.base = basePriceData;

          let flavorPriceDate = await FlavorModel.findById(drink.flavor, {
            price: 1,
            name: 1,
            _id: 0,
          });
          customDrink.flavor = flavorPriceDate;

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

            singleTopping.push({
              name: currentToppingData.item,
              price: currentToppingData.toppingType.price,
            });

            toppingName += currentToppingData.item + "|";
            customDrink.topping = { ...singleTopping, ...singleTopping };
            toppingsPrice += currentToppingData.toppingType.price;
          }

          currentProductName =
            customDrink.base.name +
            " with " +
            customDrink.flavor.name +
            " flavor" +
            toppingName;

          currentProductPrice = basePrice + flavorPrice + toppingsPrice;

          customProductsArr.push({
            name: currentProductName,
            price: currentProductPrice,
            picture: customDrink.base.picture,
            quantity: drink.quantity,
          });

          totalCustomizablesPrice +=
            (basePrice + flavorPrice + toppingsPrice) * drink.quantity;
        }
      } catch (error) {
        throw new Error("Customized product Doesn't Exist" + error.message);
      }
    }

    // console.log(customProductsArr[0].topping);
    // console.log(customProductsArr[1].topping);

    subTotal += totalCustomizablesPrice;

    //
    // Calculate the voucher discount
    let voucherCode ;
    let voucherID;
    if (arr.voucher) {
      let voucher = await VoucherModel.findOne({ code: arr.voucher });
      voucherID = voucher._id;
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

    let finalOrderProducts = [...productsArr, ...customProductsArr];
    const Calculations_And_Products = {
      subTotal: subTotal,
      discount: discount,
      totalPrice: totalPrice,
      voucherCode: voucherCode,
      voucherID: voucherID,
      finalOrderProducts,
    };

    return Calculations_And_Products;
  } else {
    throw new Error("Order is empty");
  }
};

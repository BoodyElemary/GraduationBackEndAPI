//
// Check for duplicated products
exports.checkForDuplicates = (orderedProducts, orderedCustomizedProducts) => {
  const productIds = new Set();
  const customizedProductIds = new Set();
  let hasDuplicates = false;

  if (orderedProducts) {
    for (let product of orderedProducts) {
      if (productIds.has(product.product)) {
        hasDuplicates = true;
        break;
      } else {
        productIds.add(product.product);
      }
    }
  }

  if (orderedCustomizedProducts) {
    for (let drink of orderedCustomizedProducts) {
      if (customizedProductIds.has(drink.base)) {
        hasDuplicates = true;
        break;
      } else {
        customizedProductIds.add(drink.base);
      }

      const toppingIds = new Set();
      for (let topping of drink.toppings) {
        if (toppingIds.has(topping)) {
          hasDuplicates = true;
          break;
        } else {
          toppingIds.add(topping);
        }
      }
    }
  }
  return hasDuplicates;
};

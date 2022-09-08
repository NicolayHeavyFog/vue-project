import validateProduct from '@/helpers/validatorProduct';

export default function validateProducts(valueArray) {
  let result = true;
  if (!valueArray) return false;
  Object.values(valueArray).forEach((currentProduct) => {
    if (!validateProduct(currentProduct)) result = false;
  });
  return result;
}

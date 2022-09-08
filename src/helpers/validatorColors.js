import validateObj from '@/helpers/validateObj';

export default function validateColors(valueArray) {
  let result = true;
  if (!valueArray) return false;
  const props = ['id', 'color'];
  Object.values(valueArray).forEach((currentColor) => {
    if (!validateObj(currentColor, props)) result = false;
  });
  return result;
}

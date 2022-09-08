import validateObj from '@/helpers/validateObj';

export default function validateProduct(value) {
  if (!value) return false;
  const props = ['colors', 'id', 'image', 'mainProp', 'offers', 'preview', 'price', 'slug', 'title'];
  return validateObj(value, props);
  // value.forEach((currentElement) => {
  //   const propsObj = Object.getOwnPropertyNames(currentElement);
  //   if (props.length !== propsObj.length) result = false;
  //   // eslint-disable-next-line no-plusplus
  //   for (let i = 0; i < props.length; i++) {
  //     if (typeof value[props[i]] === 'undefined') result = false;
  //   }
  //   console.log(currentElement);
  // });
  // const propsObj = Object.getOwnPropertyNames(value);
  // // console.log(propsObj);
  // if (props.length !== propsObj.length) return false;
  // // eslint-disable-next-line no-plusplus
  // for (let i = 0; i < props.length; i++) {
  //   if (typeof value[props[i]] === 'undefined') return false;
  // }
  // return true;
}

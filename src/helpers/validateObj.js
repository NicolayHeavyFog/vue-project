export default function validateObj(value, props) {
  if (!value) return false;
  const propsObj = Object.getOwnPropertyNames(value);
  if (props.length !== propsObj.length) return false;
  for (let i = 0; i < props.length; i++) {
    if (typeof value[props[i]] === 'undefined') return false;
  }
  return true;
}

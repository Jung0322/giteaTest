/* eslint-disable */
/**
 * Created by jiachenpan on 17/3/8.
 */
export default function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt(secureRandom()) + ''
  return (+(randomNum + timestamp)).toString(32)
}

const secureRandom = () => {
  const typedArray = new Int32Array(1);
  if ( window.crypto && window.crypto.getRandomValues){
    return Math.abs(window.crypto.getRandomValues(typedArray).toString().substr(0,5))
  } else if (window.msCrypto && window.msCrypto.getRandomValues) {
    return Math.abs(window.msCrypto.getRandomValues(typedArray).toString().substr(0,5))
  } else {
    return (1 + Math.random()) * 65536
  }
}
 
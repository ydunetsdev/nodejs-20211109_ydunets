function sum(a, b) {
  /* ваш код */
  if(typeof a === 'number' && typeof b === 'number'){
    return a + b
  }
  throw new TypeError()
}
console.log(sum(1.21, -0.12));

module.exports = sum;

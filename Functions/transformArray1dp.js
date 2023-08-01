export default function transformArray1dp(arr) {
  return arr.map((num) => {
    return { value: parseFloat(num.toFixed(1)) };
  });
}

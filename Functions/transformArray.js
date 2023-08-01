export default function transformArray(arr) {
  return arr.map((num) => {
    return { value: Math.round(num) };
  });
}

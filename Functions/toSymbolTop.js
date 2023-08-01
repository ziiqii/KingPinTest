/*
Takes in a score array.
- Replaces the 2nd roll of a spare frame with "/"
- Replaces any "10" with a "X"
- Replaces any "0" with a "-"
*/

// only takes in frames 1-6, which have 12 rolls
export default function toSymbolTop(arr) {
  const copy = [...arr]; // make deep copy to avoid changing original score permanently
  for (let i = 0; i < 12; i++) {
    if (arr[i] === 0) {
      copy[i] = "-";
    }
    if (arr[i] === 10) {
      copy[i] = "X";
    }
    if (i % 2 === 1 && arr[i] + arr[i - 1] === 10 && arr[i - 1] !== 10) {
      copy[i] = "/";
    }
  }
  return copy;
}

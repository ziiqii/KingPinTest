/*
Takes in a score array.
- Replaces the 2nd roll of a spare frame with "/"
    - Extra logic for frame 10
- Replaces any "10" with a "X"
- Replaces any "0" with a "-"
*/

// only takes in frames 7 - 10, which have 8 or 9 rolls.
// the 10th frame is arr[6 to 8].
export default function toSymbolBot(arr) {
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

  // 10th frame logic
  if (arr[6] === 10) {
    // first strike in 10th frame
    if (arr[7] === 10) {
      // second strike
      copy[6] = "X";
      copy[7] = "X";
      if (arr[8] === 10) {
        // third strike
        copy[8] = "X";
      } else if (arr[8] === 0) {
        // third roll is 0
        copy[8] = "-";
      }
    } else if (arr[7] + arr[8] === 10) {
      // spare
      copy[8] = "/";
      if (arr[8] === 0) {
        // third roll is 0
        copy[8] = "-";
      }
    }
  } else if (arr[6] + arr[7] === 10) {
    // spare in 10th frame
    copy[7] = "/";
    if (arr[8] === 10) {
      // bonus roll is a strike
      copy[8] = "X";
    } else if (arr[8] === 0) {
      // bonus roll is 0
      copy[8] = "-";
    }
  }

  return copy;
}

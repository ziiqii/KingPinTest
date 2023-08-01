import toSymbolBot from "./toSymbolBot";

export default function testFunctions() {
  console.log("=====toSymbolBot test start=====");
  const inputs = [
    [10, 10, 10],
    [10, 10, 9],
    [10, 10, 0],
    [10, 9, 1],
    [10, 1, 1],
    [10, 1, 0],
    [10, 0, 0],
    [9, 1, 10],
    [9, 1, 1],
    [9, 1, 0],
    [0, 10, 10],
    [0, 10, 9],
    [0, 10, 0],
    [9, 1],
    [9, 0],
    [0, 9],
    [0, 0],
  ].map((x) => [0, 0, 0, 0, 0, 0].concat(x));

  const expectedOutputs = [
    ["X", "X", "X"],
    ["X", "X", 9],
    ["X", "X", "-"],
    ["X", 9, "/"],
    ["X", 1, 1],
    ["X", 1, "-"],
    ["X", "-", "-"],
    [9, "/", "X"],
    [9, "/", 1],
    [9, "/", "-"],
    ["-", "/", "X"],
    ["-", "/", 9],
    ["-", "/", "-"],
    [9, "/"],
    [9, "-"],
    ["-", 9],
    ["-", "-"],
  ].map((x) => ["-", "-", "-", "-", "-", "-"].concat(x));

  let passed = true;

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const expected = expectedOutputs[i];
    const output = toSymbolBot(input);

    if (!arraysEqual(output, expected)) {
      console.log(
        `Test failed for input ${input}. Expected: ${expected}, but got: ${output}`
      );
      passed = false;
    }
  }

  if (passed) {
    console.log("All tests passed successfully!");
  }

  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  console.log("=====toSymbolBot test stop======");
}

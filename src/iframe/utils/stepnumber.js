const missingNumbers = (steps, l = true) => {
  let a = [];
  if (steps.length > 0) {
    steps.map((step) => {
      a.push(step.number);
    });
    let b = Array.from(Array(Math.max(...a)).keys())
      .map((n, i) =>
        a.indexOf(i) < 0 && (!l || i > Math.min(...a)) ? i : null
      )
      .filter((f) => f);
    if (b.length > 0) return b[0];
    else {
      a.sort(function (a, b) {
        return a - b;
      });
      return a[a.length - 1] + 1;
    }
  } else {
    return 1;
  }
};

export default missingNumbers;

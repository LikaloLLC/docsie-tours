const missingNumbers = (a, l = true) => {
  return Array.isArray(a)
    ? Array.from(Array(Math.max(...a)).keys())
        .map((n, i) =>
          a.indexOf(i) < 0 && (!l || i > Math.min(...a)) ? i : null
        )
        .filter((f) => f)
    : null;
};

export default missingNumbers;

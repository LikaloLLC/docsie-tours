const listener = (e) => {
  console.log(e.target);
};
document.querySelectorAll("button, form, input, a, img").forEach((element) => {
  element.removeEventListener("mousedown", listener);
  console.log(element.parentElement.style);
  element.parentElement.style.border === "5px solid rgba(255, 102, 102, 0.8)"
    ? (element.style.border = "5px solid rgba(128, 0, 0, 0.8)")
    : (element.style.border = "5px solid rgba(255, 102, 102, 0.8)");
  element.addEventListener("mousedown", listener);
});

const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes && !mutation.attributeName
      ? mutation.addedNodes[0]
          .querySelectorAll("button, form, input, a, img")
          .forEach((element) => {
            console.log(element.parentElement.style);
            element.parentElement.style.border ===
            "5px solid rgba(255, 102, 102, 0.8)"
              ? (element.style.border = "5px solid rgba(128, 0, 0, 0.8)")
              : (element.style.border = "5px solid rgba(255, 102, 102, 0.8)");
            element.addEventListener("mousedown", listener);
          })
      : null;
    console.log(mutation);
  });
});

mutationObserver.observe(document.documentElement, {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true,
});

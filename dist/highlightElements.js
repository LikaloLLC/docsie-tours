var listener = (e) => {
  if (e.target.tagName === "svg") {
    e.target.parentElement.dispatchEvent(new Event('mousedown'));
    console.log(e.target.parentElement);
  } else if ( e.target.tagName === "use"){
    e.target.parentElement.parentElement.dispatchEvent(new Event('mousedown'));
  } 
  else {
    console.log(e.target.className, e.target.id, e.target.tagName);
    var element = {
      className: e.target.className,
      id: e.target.id,
      tag: e.target.tagName,
    };
    console.log(element)
    chrome.runtime.sendMessage({message: element})
  }
};
document.querySelectorAll("button, form, input, a").forEach((element) => {
  element.removeEventListener("mousedown", listener);
  element.parentElement.style.border === "2px solid rgba(55, 76, 250 , 0.8)"
    ? (element.style.border = "2px solid rgba(128, 0, 0, 0.8)")
    : (element.style.border = "2px solid rgba(55, 76, 250 , 0.8)");
  element.addEventListener("mousedown", listener);
});

var mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.length > 0
      ? mutation.addedNodes && !mutation.attributeName
        ? mutation.addedNodes[0]
            .querySelectorAll("button, form, input, a")
            .forEach((element) => {
              element.removeEventListener("mousedown", listener);
              element.parentElement.style.border ===
              "2px solid rgba(55, 76, 250 , 0.8)"
                ? (element.style.border = "2px solid rgba(128, 0, 0, 0.8)")
                : (element.style.border = "2px solid rgba(55, 76, 250 , 0.8)");
              element.addEventListener("mousedown", listener);
            })
        : null
      : null;
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

chrome.runtime.onMessage.addListener((msg) => {
  console.log(msg)
  if (msg.message==="cancel"){
    document.querySelectorAll("button, form, input, a").forEach((element) => {
      element.removeEventListener("mousedown", listener);
      element.style.border = "";
    });
  }
});
var listener = (e) => {
  if (e.target.tagName === "svg") {
    e.target.parentElement.dispatchEvent(new Event("mousedown"));
    console.log(e.target.parentElement);
  } else if (e.target.tagName === "use") {
    e.target.parentElement.parentElement.dispatchEvent(new Event("mousedown"));
  } else {
    console.log(e.target.className, e.target.id, e.target.tagName);
    var element = {
      className: e.target.className,
      id: e.target.id,
      tag: e.target.tagName,
    };
    console.log(element);
    chrome.runtime.sendMessage({ message: element });
  }
};
document.querySelectorAll("button, form, input, a").forEach((element) => {
  element.removeEventListener("mousedown", listener);
  element.style.border = "";
});

(function () {
  var _path;
  var elements = document.querySelectorAll("*");

  function getPseudo(sibIndex, sibLength) {
    if (sibLength < 2) return "";
    switch (true) {
      case sibIndex === 0:
        return ":first-of-type";
      case sibIndex === sibLength - 1:
        return ":last-of-type";
      default:
        return ":nth-of-type(" + (sibIndex + 1) + ")";
    }
  }

  function getDomPath(el) {
    var loop = true;
    var stack = [];
    while (loop) {
      var sibCount = 0;
      var sibIndex = 0;
      if (!el.parentNode) break;
      var childNodes = el.parentNode.childNodes.length;
      for (var i = 0; i < childNodes; i++) {
        var sib = el.parentNode.childNodes[i];
        if (sib.nodeName == el.nodeName) {
          if (sib === el) {
            sibIndex = sibCount;
          }
          sibCount++;
        }
      }
      if (el.hasAttribute("id") && el.id != "") {
        stack.unshift(el.nodeName.toLowerCase() + "#" + el.id);
        stack.unshift("");
        loop = false;
      } else if (sibCount > 1) {
        stack.unshift(
          el.nodeName.toLowerCase() +
            getPseudo(sibIndex, el.parentNode.childNodes.length)
        );
      } else {
        stack.unshift(el.nodeName.toLowerCase());
      }
      el = el.parentNode;
    }

    return stack.slice(1); // removes the html element
  }

  function getElementFullPath(el) {
    switch (true) {
      case Boolean(el.id):
        return "#" + el.id;
      default:
        return getDomPath(el).join(">");
    }
  }

  function highlightElements() {
    let $overlay;
    let highlightedElements = document.body.querySelectorAll(
      ".HighlitedElement-docsie"
    );
    highlightedElements.forEach((el) => {
      el.remove();
    });
    elements.forEach((element) => {
      let rect = element.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        $overlay = document.createElement("div");
        $overlay.className = "HighlitedElement-docsie";
        $overlay.style.pointerEvents = "none";
        $overlay.style.border = "2px solid blue";
        $overlay.style.position = "fixed";
        $overlay.style.zIndex = "9999";
        let rect = element.getBoundingClientRect();
        $overlay.style.top = rect.top + "px";
        $overlay.style.left = rect.left + "px";
        $overlay.style.width = rect.width + "px";
        $overlay.style.height = rect.height + "px";
        document.body.appendChild($overlay);
        element.addEventListener("click", getElementPath);
      }
    });
  }

  function getElementPath(e) {
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
    _path = getElementFullPath(e.target);
    chrome.runtime.sendMessage({ message: _path });
  }

  function onElementClick(e) {
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
    var target = e.target;
    var path = getElementFullPath(target);
    updatePanel(path);
    console.warn(getElementFullPath(target));
  }

  function showOverlay() {
    document.addEventListener("click", onElementClick);
  }

  function hideOverlay() {
    let highlightedElements = document.body.querySelectorAll(
      ".HighlitedElement-docsie"
    );
    highlightedElements.forEach((el) => {
      el.remove();
    });
    document.removeEventListener("click", onElementClick);
    elements.forEach((element) => {
      element.removeEventListener("click", getElementPath);
    });
    document.removeEventListener("scroll", highlightElements);
  }

  function init() {
    console.log("Content JS loaded");
    document.addEventListener("scroll", highlightElements);
    showOverlay();
    highlightElements();
    xOffset = window.pageXOffset;
    yOffset = window.pageYOffset;
  }
  chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
      if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);

        // ----------------------------------------------------------
        // This part of the script triggers when page is done loading
        console.log("Hello. This message was sent from scripts/inject.js");
        // ----------------------------------------------------------
      }
    }, 10);
  });
  init();
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.message) {
      case "cancel":
        console.log("message.message", message.message);
        hideOverlay();
    }
    sendResponse();
  });
})();

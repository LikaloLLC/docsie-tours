var extensionOrigin = "chrome-extension://" + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
  var iframe = document.createElement("iframe");

  iframe.style.cssText =
    "position:fixed;bottom:0;left:0;display:block;" +
    "width:100%;height:32%;border-top:1px solid;z-index:10000;overflow-y:hidden;";
  document.body.appendChild(iframe);

  iframe.src = `${chrome.runtime.getURL("/index.html")}`;
}

chrome.runtime.onMessage.addListener((msg) => {
  switch (msg.message) {
    case "Minimize":
      iframe.style.height = "5%";
      break;
    case "Maximize":
    case "show_iframe":
      iframe.style.height = "32%";
      break;
    case "cancel":
      iframe.remove();
  }
});

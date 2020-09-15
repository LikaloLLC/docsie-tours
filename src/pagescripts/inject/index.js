/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
const extensionOrigin = "chrome-extension://" + chrome.runtime.id;
const panelFullHeight = "270px";
const panelMinHeight = "50px";
let iframe;

if (!location.ancestorOrigins.contains(extensionOrigin)) {
  iframe = document.createElement("iframe");
  iframe.style.cssText = `position:fixed;bottom:0;left:0;display:block;width:100%;height:${panelFullHeight};border-top:1px solid;z-index:10000;overflow-y:hidden;`;
  document.body.style.paddingBottom = panelFullHeight;
  document.body.appendChild(iframe);
  iframe.src = `${chrome.runtime.getURL("/index.html")}`;
}

chrome.runtime.onMessage.addListener((msg) => {
  switch (msg.message) {
    case "Minimize":
      iframe.style.height = document.body.style.paddingBottom = panelMinHeight;
      break;
    case "Maximize":
    case "show_iframe":
      iframe.style.height = document.body.style.paddingBottom = panelFullHeight;
      break;
    case "cancel":
      iframe.remove();
  }
});

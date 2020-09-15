import Config from "../../config.json";
const domain = Config.urls.base;
const csrfcookie = "csrftoken";
function getCookies(domain, name, callback) {
  chrome.cookies.get({ url: domain, name }, function (cookie) {
    if (callback) {
      callback(cookie.value);
    }
  });
}
function getCSRFCookie(then) {
  getCookies(
    domain,
    csrfcookie,
    then
  );
}
let bookId, shelfId, tourOriginUrl;
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "iframe") {
    getCSRFCookie(
      (id) => {
        port.postMessage({ token: id, shelfId, url: tourOriginUrl });
      }
    );
    port.postMessage({ bookId });

    port.onMessage.addListener((data) => {
      if (data.message === "Minimize" || data.message === "Maximize")
        port.postMessage({ message: data.message });
      if (data.message === "cancel") {
        chrome.tabs.sendMessage(data.tabId, { message: data.message });
      }
    });
  }
  if (port.name === "highlight") {
    window.highlight = port.name;
    port.onMessage.addListener((data) => {
      console.log(data);
    });
  }
  if (port.name === "popup") {
    getCSRFCookie(
      (id) => {
        port.postMessage({ token: id });
      }
    );
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      tourOriginUrl = tabs[0].url;
    });
    port.onMessage.addListener((data) => {
      shelfId = data.message;
      chrome.tabs.executeScript({
        file: "/highlight.js",
      });
      chrome.tabs.executeScript({
        file: "/inject.js",
      });
    });
  }
});
chrome.runtime.onMessageExternal.addListener((data) => {
  if (data.url) {
    bookId = data.message;
    chrome.tabs.create(
      {
        url: data.url,
      },
      (tab) => {
        setTimeout(() => {
          chrome.tabs.executeScript({ file: "/highlight.js" });
          chrome.tabs.executeScript({ file: "/inject.js" }, (a) => {
            chrome.tabs.sendMessage(tab.id, { message: "show_iframe" });
          });
        }, 2500);
      }
    );
  }
});

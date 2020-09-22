/* eslint-disable no-undef */
import Config from "../../config.json";
import { getUser, getShelfs, saveTour } from "./requests";

const domain = Config.urls.base;
const csrfcookie = "csrftoken";
let bookId, tourOriginUrl, cookie, user, shelfs;

function getCookies(domain, name, callback) {
  chrome.cookies.get({ url: domain, name }, function (cookie) {
    if (callback) {
      callback(cookie.value);
    }
  });
}
function getCSRFCookie(then) {
  getCookies(domain, csrfcookie, then);
}
getCSRFCookie((id) => {
  cookie = id;
});

chrome.runtime.onConnect.addListener(async function (port) {
  if (port.name === "iframe") {
    user = await getUser(cookie);
    shelfs = await getShelfs(user, cookie);
    port.postMessage({ shelfs });

    port.onMessage.addListener((data) => {
      if (data.message === "Minimize" || data.message === "Maximize")
        port.postMessage({ message: data.message });
      if (data.message === "cancel") {
        chrome.tabs.sendMessage(data.tabId, { message: data.message });
      }
      if (data.message === "save tour") {
        saveTour(cookie, tourOriginUrl, data.title, data.tour, data.shelf);
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
    if (cookie) {
      console.log("cookie", cookie);
      port.postMessage({ status: "logged in" });
    } else {
      port.postMessage({ status: "not logged in" });
    }

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      tourOriginUrl = tabs[0].url;
    });
    port.onMessage.addListener((data) => {
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
    //bookId = data.message;
    chrome.tabs.create(
      {
        url: data.url,
      },
      () => {
        chrome.tabs.executeScript({ file: "/highlight.js" });
        chrome.tabs.executeScript({ file: "/inject.js" });
      }
    );
  }
});

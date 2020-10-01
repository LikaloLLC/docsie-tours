/* eslint-disable no-undef */
import Config from "../../config.json";
import {
  getUser,
  getShelfs,
  getBooks,
  getFlows,
  getFlow,
  newFlow,
  saveFlow,
} from "./requests";

const domain = Config.urls.base;
const csrfcookie = "csrftoken";
let tourOriginUrl, cookie, user, shelfs, books, flows, flow, flowId;

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
  if (port.name === "ManagerPanel") {
    port.onMessage.addListener((data) => {
      if (data.message === "Minimize" || data.message === "Maximize")
        port.postMessage({ message: data.message });
      if (data.message === "cancel") {
        chrome.tabs.sendMessage(data.tabId, { message: data.message });
      }
      if (data.message === "save tour") {
        saveFlow(cookie, tourOriginUrl, data.title, data.tour, flowId);
      }
    });
  }

  if (port.name === "SetupWizard") {
    port.onMessage.addListener(async (data) => {
      if (data.message === "shelf request") {
        user = await getUser(cookie);
        shelfs = await getShelfs(user, cookie);
        port.postMessage({ shelfs });
      }
      if (data.message === "create new flow") {
        flow = await newFlow(data.title, data.languageId, tourOriginUrl, cookie);
        flowId = flow.data.id;
        port.postMessage({ flow });
      }
      if (data.message === "cancel") {
        chrome.tabs.sendMessage(data.tabId, { message: data.message });
      }
      if (data.shelfId) {
        books = await getBooks(data.shelfId, cookie);
        port.postMessage({ books });
      }
      if (data.languageId) {
        flows = await getFlows(data.languageId, cookie);
        port.postMessage({ flows });
      }
      if (data.flowId) {
        flowId = data.flowId;
        flow = await getFlow(data.flowId, cookie);
        port.postMessage({ flow });
      }
    });
  }

  if (port.name === "popup") {
    if (cookie) {
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

chrome.runtime.onMessageExternal.addListener(async (data) => {
  if (data.url) {
    flowId = data.flowId;
    flow = await getFlow(data.flowId, cookie);
    chrome.tabs.create(
      {
        url: data.url,
      },
      (tab) => {
        chrome.tabs.executeScript({ file: "/highlight.js" });
        chrome.tabs.executeScript({ file: "/inject.js" });
        chrome.tabs.onUpdated.addListener((tabId, info) => {
          if (info.status === "complete"&& tabId===tab.id) {
            chrome.tabs.sendMessage(tabId, { flow });
          }
        });
      }
    );
  }
});

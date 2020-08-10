/* chrome.tabs.onCreated.addListener(() => { 
  try {
    chrome.tabs.query(
      {
        active: true,
      },
      (tabs) => {
        chrome.debugger.attach({ tabId: tabs[0].id }, "1.0");
        chrome.debugger.sendCommand({ tabId: tabs[0].id }, "DOM.enable");
        chrome.debugger.sendCommand({ tabId: tabs[0].id }, "CSS.enable");
        chrome.debugger.sendCommand(
          { tabId: tabs[0].id },
          "DOM.getDocument",
          (data) => {
            console.log(data);
            if (!data.root) {
              throw new Error("Document root not available.");
            }
            nodeId = data.root.nodeId;
            console.log(data.root.nodeId);
          }
        );
        chrome.debugger.sendCommand(
          { tabId: tabs[0].id },
          "DOM.highlightNode",
          {
            highlightConfig: {
              contentColor: HIGHLIGHT_COLOR,
              showInfo: true,
            },
            nodeId,
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
  }
});
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.debugger.attach({ tabId: activeInfo.tabId }, "1.0");
  chrome.debugger.sendCommand({ tabId: activeInfo.tabId }, "DOM.enable");
  chrome.debugger.sendCommand({ tabId: activeInfo.tabId }, "CSS.enable");
  chrome.debugger.sendCommand(
    { tabId: activeInfo.tabId },
    "DOM.getDocument",
    (data) => {
      console.log(data);
      if (!data.root) {
        throw new Error("Document root not available.");
      }
      chrome.debugger.sendCommand(
        { tabId: activeInfo.tabId },
        "Overlay.highlightNode",//Overlay.setInspectMode
        {
          mode:"searchForNode",
          highlightConfig: {
            contentColor: HIGHLIGHT_COLOR,
            showInfo: true,
          },
          backendNodeId: data.root.children[1].children[1].backendNodeId,//data.root.children[0].children[0].children[1].backendNodeId
          selector:"<button>",
        }
      );
    }
  );
}); */

/* chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.storage.sync.get("state", function (data) {
    if (data.state === "on") {
      //chrome.windows.remove(chrome.storage.local.get("windowId"))
      chrome.storage.local.set({ state: "off" });
        chrome.tabs.executeScript({
          code: `
          document.querySelectorAll("button, form, input, a, img").forEach((element) => {
            element.style.border = " "
          })`,
        });
    } else {
      chrome.storage.local.set({ state: "on" });
      chrome.tabs.onActivated.addListener((activeInfo) => {
        chrome.tabs.executeScript({
          file: "/highlightElements.js",
        });
      });
      chrome.tabs.onUpdated.addListener(() => {
        chrome.tabs.executeScript({
          file: "/highlightElements.js",
        });
      });
    }
  });
}); */

/* chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.executeScript({
    file: "/highlightElements.js",
  });
}); */

/* 
chrome.tabs.onUpdated.addListener((activeInfo) => {
  console.log('asd')
  chrome.tabs.executeScript({
    file: "/insertScript.js",
  }, ()=>{
    let e = chrome.runtime.lastError;
    if(e !== undefined){
      console.log("asdsadasd", e);
    }
  });
}); */

function getCookies(domain, name, callback) {
  chrome.cookies.get({ url: domain, name }, function (cookie) {
    if (callback) {
      callback(cookie.value);
    }
  });
}
let tabId, bookId;
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "iframe") {
    getCookies(
      "http://ec2-54-224-135-131.compute-1.amazonaws.com:8003/",
      "csrftoken",
      (id) => {
        console.log("test123id");
        port.postMessage({ token: id, bookId });
      }
    );
    console.log('back', bookId)
    port.postMessage({ bookId}) 

    port.onMessage.addListener((data) => {
      if (data.message === "minimize" || data.message === "maximize")
        port.postMessage({ message: data.message });
      if (data.message === "cancel") {
        chrome.tabs.sendMessage(tabId, { message: data.message });
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
    getCookies(
      "http://ec2-54-224-135-131.compute-1.amazonaws.com:8003/",
      "csrftoken",
      (id) => {
        port.postMessage({ token: id });
      }
    );
    port.onMessage.addListener((data) => {
      bookId = data.message
      chrome.tabs.create(
        {
          url: data.message,
        },
        (tab) => {
          tabId = tab.id;
          chrome.tabs.executeScript(tab.id, { file: "/highlightElements.js" });
          chrome.tabs.executeScript(tab.id, { file: "/insertScript.js" });
        }
      );
    });
  }
});
chrome.runtime.onMessageExternal.addListener((data, sender, sendResponse) => {
  bookId = data.message;
  chrome.tabs.create(
    {
      url: data.message,
    },
    (tab) => {
      tabId = tab.id;
      chrome.tabs.executeScript(tab.id, { file: "/highlightElements.js" });
      chrome.tabs.executeScript(tab.id, { file: "/insertScript.js" });
    }
  );
});

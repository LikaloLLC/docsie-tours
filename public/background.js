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

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.storage.sync.get("state", function (data) {
    if (data.state === "on") {
      /* chrome.windows.remove(chrome.storage.local.get("windowId")) */
      chrome.storage.local.set({ state: "off" });
      chrome.runtime.onSuspend.addListener(() => {
        chrome.tabs.executeScript({
          code: `
          console.log("dsadsa")
          document.querySelectorAll("button, form, input, a, img").forEach((element) => {
            element.style.border = " "
          })`,
        });
      });
    } else {
      chrome.storage.local.set({ state: "on" });

      chrome.windows.create({
        url: chrome.runtime.getURL("index.html"),
        width: 1920,
        height: 400,
        top: 680,
        type: "popup",
      });
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
});

/* chrome.storage.local.get('state', function(data) {
  if (data.state === 'on') {
    
    //do something, removing the script or whatever
  } else {
    chrome.storage.sync.set({state: 'on'});
    //inject your script
  }
});
 */

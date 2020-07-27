const port = chrome.runtime.connect("eokbffjgonmiogfjodfdbanbceahgogk", {
  name: "insertScript",
});


var extensionOrigin = "chrome-extension://" + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
  var iframe = document.createElement("iframe");   

  iframe.style.cssText =
    "position:fixed;bottom:0;left:0;display:block;" +
    "width:100%;height:32%;border-top:1px solid;z-index:10000;overflow-y:hidden";
  document.body.appendChild(iframe);

  iframe.src = `${chrome.runtime.getURL("/index.html")}`;
}

chrome.runtime.onMessage.addListener((msg) => {
  if(msg.message==="minimize") iframe.style.height="5%"
  if(msg.message==="maximize") iframe.style.height="32%"
  if (msg.message==="cancel") iframe.style.height="0%"
});


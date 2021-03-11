/* eslint-disable no-undef */
const PanelStyle =
  '<style>#__managerExtentionPanel{position:fixed;z-index:10000;bottom:50px;left:0;width:100%}#__managerExtentionPanel__body{padding:15px}#__managerExtentionPanel__body *{margin:0;padding:0;box-sizing:border-box}#__managerExtentionPanel__body .__managerExtentionPanel__path{display:-webkit-box;display:flex;border-radius:6px;overflow:hidden;margin:auto;text-align:center;width:100%;height:36px;box-shadow:0 1px 1px rgba(0,0,0,.2),0 4px 14px rgba(0,0,0,.7);z-index:1;background-color:#ddd;font-size:14px}#__managerExtentionPanel__body .__managerExtentionPanel__path a.__managerExtentionPanel__path_item{position:relative;display:-webkit-box;display:flex;-webkit-box-flex:1;flex-grow:1;text-decoration:none;margin:auto;height:100%;padding-left:24px;padding-right:0;color:#666}#__managerExtentionPanel__body .__managerExtentionPanel__path a.__managerExtentionPanel__path_item:first-child{padding-left:9.6px}#__managerExtentionPanel__body .__managerExtentionPanel__path a.__managerExtentionPanel__path_item:last-child{padding-right:9.6px}#__managerExtentionPanel__body .__managerExtentionPanel__path a.__managerExtentionPanel__path_item:after{content:"";position:absolute;display:inline-block;width:36px;height:36px;top:0;right:-17.7777777778px;background-color:#ddd;border-top-right-radius:5px;-webkit-transform:scale(.707) rotate(45deg);transform:scale(.707) rotate(45deg);box-shadow:1px -1px rgba(0,0,0,.25);z-index:1}#__managerExtentionPanel__body .__managerExtentionPanel__path a.__managerExtentionPanel__path_item:last-child:after{content:none}#__managerExtentionPanel__body .__managerExtentionPanel__path a.__managerExtentionPanel__path_item.active,#__managerExtentionPanel__body .__managerExtentionPanel__path a.__managerExtentionPanel__path_item:hover{background:#0064bd;color:#fff}#__managerExtentionPanel__body .__managerExtentionPanel__path a.__managerExtentionPanel__path_item.active:after,#__managerExtentionPanel__body .__managerExtentionPanel__path a.__managerExtentionPanel__path_item:hover:after{background:#0064bd;color:#fff}#__managerExtentionPanel__body .__managerExtentionPanel__path a.__managerExtentionPanel__path_item .breadcrumb__inner{pointer-events:none;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;margin:auto;z-index:2}#__managerExtentionPanel__body .__managerExtentionPanel__path a.__managerExtentionPanel__path_item .breadcrumb__title{font-weight:700}@media all and (max-width:1000px){#__managerExtentionPanel__body .__managerExtentionPanel__path{font-size:12px}}@media all and (max-width:710px){#__managerExtentionPanel__body .__managerExtentionPanel__path{height:24px}#__managerExtentionPanel__body .__managerExtentionPanel__path .breadcrumb__desc{display:none}#__managerExtentionPanel__body .__managerExtentionPanel__path a{padding-left:16px}#__managerExtentionPanel__body .__managerExtentionPanel__path a:after{content:"";width:24px;height:24px;right:-12px;-webkit-transform:scale(.707) rotate(45deg);transform:scale(.707) rotate(45deg)}}</style>';
let _overlay;
let _panel;
let _enabled = false;
let _path = [];

function onPanelHover(e) {
  const target = e.target;
  if (target.dataset.index === undefined) return false;
  const index = parseInt(target.dataset.index);
  if (isNaN(index)) return;
  const path = _path.slice(0, index + 1).join('>');
  if (!path) return;
  const frag = document.querySelector(path);
  highlightTarget(frag);
}

function onPanelClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const target = e.target;
  if (target.dataset.index === undefined) return false;
  const index = parseInt(target.dataset.index);
  if (isNaN(index)) return;
  const path = _path.slice(0, index + 1).join('>');
  updatePanel(path);
}

function getPanelEl() {
  if (!_panel) {
    _panel = document.createElement('div');
    _panel.id = '__managerExtentionPanel';
    _panel.innerHTML =
      PanelStyle + "<div id='__managerExtentionPanel__body'></div>";
    _panel.addEventListener('mousemove', onPanelHover);
    _panel.addEventListener('click', onPanelClick);
  }
  return _panel.querySelector('#__managerExtentionPanel__body');
}

function updatePanel(path) {
  const panel = getPanelEl();
  const frags = path.split('>');
  if (!!path) {
    const view =
      "<div class='__managerExtentionPanel__path'>" +
      frags
        .map(function (frag, index) {
          return (
            "<a class='__managerExtentionPanel__path_item' data-index='" +
            index +
            "'><span class='breadcrumb__inner'><span class='breadcrumb__title'>" +
            frag +
            '</span></span></a>'
          );
        })
        .join('') +
      '</div>';
    panel.innerHTML = view;
  } else {
    panel.innerHTML = '';
  }
  _path = frags;
}

function getOverlayEl() {
  if (!_overlay) {
    _overlay = document.createElement('div');
    _overlay.style.pointerEvents = 'none';
    _overlay.style.position = 'fixed';
    _overlay.style.border = '2px solid blue';
    _overlay.style.boxShadow = '0 0 0 999em rgba(0,0,0,0.4)';
    _overlay.style.zIndex = '9999';
  }
  return _overlay;
}

function getPseudo(sibIndex, sibLength) {
  if (sibLength < 2) return '';
  switch (true) {
    case sibIndex === 0:
      return ':first-of-type';
    case sibIndex === sibLength - 1:
      return ':last-of-type';
    default:
      return ':nth-of-type(' + (sibIndex + 1) + ')';
  }
}

function getDomPath(el) {
  let loop = true;
  let stack = [];
  while (loop) {
    let sibCount = 0;
    let sibIndex = 0;
    if (!el.parentNode) break;
    var childNodes = el.parentNode.childNodes.length;
    for (var i = 0; i < childNodes; i++) {
      var sib = el.parentNode.childNodes[i];
      if (sib.nodeName === el.nodeName) {
        if (sib === el) {
          sibIndex = sibCount;
        }
        sibCount++;
      }
    }
    if (el.hasAttribute('id') && el.id) {
      stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
      stack.unshift('');
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
      return '#' + el.id;
    default:
      return getDomPath(el).join('>');
  }
}

function highlightTarget(target) {
  if (target) {
    const overlay = getOverlayEl();
    const rect = target.getBoundingClientRect();
    overlay.style.top = rect.top + 'px';
    overlay.style.left = rect.left + 'px';
    overlay.style.width = rect.width + 'px';
    overlay.style.height = rect.height + 'px';
  }
}

function onElementHover(e) {
  const target = e.target;
  if (_panel.contains(target)) return;
  highlightTarget(target);
}

function onElementClick(e) {
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
  const target = e.target;
  if (_panel.contains(target)) return;
  const path = getElementFullPath(target);
  updatePanel(path);
  chrome.runtime.sendMessage({ message: path });
  hideOverlay();
}

function showOverlay() {
  if (_enabled) return;

  document.addEventListener('mousemove', onElementHover);
  document.addEventListener('click', onElementClick);
  _enabled = true;
  document.body.appendChild(_overlay);
  document.body.appendChild(_panel);
}

function hideOverlay() {
  if (!_enabled) return;
  _overlay.remove();
  _panel.remove();
  highlightTarget(document.body);
  document.removeEventListener('mousemove', onElementHover);
  document.removeEventListener('click', onElementClick);
  _enabled = false;
}

function init() {
  getOverlayEl();
  getPanelEl();
  showOverlay();
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.message === 'selector request') init();
});

chrome.extension.onMessage.addListener(function (
  request,
  sender,
  sendResponse
) {
  console.log('request.message', request.message);
  switch (request.message) {
    case 'cancel':
      hideOverlay();
      break;
    default:
  }
  sendResponse();
});

chrome.extension.sendMessage({}, function (response) {
  const readyStateCheckInterval = setInterval(function () {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);
    }
  }, 10);
});

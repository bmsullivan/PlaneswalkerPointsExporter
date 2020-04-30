var hist = document.getElementById('History');

var rows = hist.getElementsByClassName('HistoryPanelRow');

var content = rows.toString();

chrome.runtime.sendMessage({content: content});
chrome.runtime.onMessage.addListener(function (message) {
    let doc = URL.createObjectURL(new Blob([message.content], {type: 'application/octet-binary'}));
    chrome.downloads.download({url: doc, filename: 'PlaneswalkerPoints.csv', conflictAction: 'overwrite', saveAs: true});
});
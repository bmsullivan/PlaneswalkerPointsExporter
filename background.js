// chrome.runtime.onInstalled.addListener(function() {
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//       chrome.declarativeContent.onPageChanged.addRules([{
//         conditions: [new chrome.declarativeContent.PageStateMatcher({
//           pageUrl: {hostEquals: 'www.wizards.com'},
//         })],
//         actions: [new chrome.declarativeContent.ShowPageAction()]
//       }]);
//     });
// });

chrome.runtime.onMessage.addListener(function (message) {
    let doc = URL.createObjectURL(new Blob([message.content], {type: 'application/octet-binary'}));
    chrome.downloads.download({url: doc, filename: 'PlaneswalkerPoints.csv', conflictAction: 'overwrite', saveAs: true});
});
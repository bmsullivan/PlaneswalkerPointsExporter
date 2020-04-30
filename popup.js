let downloadButton = document.getElementById('downloadButton');
// let link = document.getElementById('ppLink');

// link.onclick = function (element) {
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       chrome.tabs.executeScript(
//           tabs[0].id,
//           {code: 'window.location = "https://www.wizards.com/Magic/PlaneswalkerPoints/History#type=EventsOnly"'});
//     });
// };

downloadButton.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {file: 'downloadData.js'});
    });
  };
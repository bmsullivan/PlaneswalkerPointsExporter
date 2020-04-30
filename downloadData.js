(async() => {
    var hist = document.getElementById('History');

    var rows = hist.getElementsByClassName('HistoryPanelRow');

    let content = "Date,Sanctioning Number\n";
    for (let row of rows) {
        let dateElm = row.getElementsByClassName('HistoryPanelHeaderLabel Date')[0];
        content += dateElm.innerHTML + ',';
        let eventId = row.querySelector('a[data-type="Event"]').dataset.summarykey;
        let eventResp = await fetch(`https://www.wizards.com/Magic/PlaneswalkerPoints/JavaScript/GetEventSummary/${eventId}`, {method: 'POST'});
        let eventData = await eventResp.json();
        let eventDetailElm = document.createElement('div');
        eventDetailElm.innerHTML = eventData.Data.Value;
        content += eventDetailElm.getElementsByClassName('EventSanctionNumber')[0].innerText + '\n';
    }

    chrome.runtime.sendMessage({content: content});
})();
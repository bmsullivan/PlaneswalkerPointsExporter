(async() => {

    let addressRegex = /PlaneswalkerPoints\/History/;

    if (addressRegex.test(window.location.href)) {

        let modal = displayWaitingModal();

        var hist = document.getElementById('History');

        var rows = hist.getElementsByClassName('HistoryPanelRow');

        let content = "Date,Title,Location,Lifetime Points,Yearly Points,Pro Points,Event Multiplier,Players,Participation Points,Format,City,Place,Sanctioning Number,Match Number,Result,Match Points,Opponent(s)\n";
        for (let row of rows) {
            try {
                let badgeElm = row.getElementsByClassName('Badge')[0];
                // This is an achievement row, skip it
                if (badgeElm.innerHTML != '') continue;
                let date = row.getElementsByClassName('HistoryPanelHeaderLabel Date')[0].innerText;
                let title = row.getElementsByClassName('HistoryPanelHeaderLabel Description')[0].innerText.replace(/,/g, '');
                let location = row.getElementsByClassName('HistoryPanelHeaderLabel Location')[0].innerText.replace(/,/g, '');
                let lifetimePoints = row.getElementsByClassName('HistoryPanelHeaderLabel LifetimePoints')[0].innerText;
                let proPoints = row.getElementsByClassName('HistoryPanelHeaderLabel ProPoints')[0].innerText.replace('-', '');

                let eventId = row.querySelector('a[data-type="Event"]').dataset.summarykey;
                let eventResp = await fetch(`https://www.wizards.com/Magic/PlaneswalkerPoints/JavaScript/GetEventSummary/${eventId}`, {method: 'POST'});
                let eventData = await eventResp.json();
                let eventDetailElm = document.createElement('div');
                eventDetailElm.innerHTML = eventData.Data.Value;

                let eventMultiplier = eventDetailElm.getElementsByClassName('EventMultiplier')[0].childNodes[1].wholeText.trim();
                let players = eventDetailElm.getElementsByClassName('EventPlayers')[0].childNodes[1].wholeText.trim();
                let participationPoints = eventDetailElm.getElementsByClassName('EventParticipationPoints')[0].childNodes[1].wholeText.trim();
                let format = eventDetailElm.getElementsByClassName('EventFormat')[0].childNodes[1].wholeText.trim().replace(/,/g, '');
                let city = eventDetailElm.getElementsByClassName('EventLocation')[0].childNodes[1].wholeText.trim().replace(/,/g, '');
                let place = eventDetailElm.getElementsByClassName('EventPlace')[0].childNodes[1].wholeText.trim().replace(/,/g, '');
                let sactioningNumber = eventDetailElm.getElementsByClassName('EventSanctionNumber')[0].childNodes[1].wholeText.trim();
                let yearlyPoints = eventDetailElm.getElementsByClassName('MatchTotal')[0].childNodes[2].wholeText.trim();

                let matchIndex = 0;
                for (let matchRowElm of eventDetailElm.getElementsByClassName('MatchHistoryRow')) {
                    let matchNumber = matchRowElm.getElementsByClassName('MatchPlace')[0].innerText;
                    let result = matchRowElm.getElementsByClassName('MatchResult')[0].innerText;
                    let matchPoints = matchRowElm.getElementsByClassName('MatchPoints')[0].innerText.replace('(+', '').replace(')', '');
                    let opponent = Array.from(matchRowElm.getElementsByClassName('TeamOpponent')).map(e => e.innerText).join(' | ').replace(/,/g, '');
                    let rowString = `${date},${title},${location},${matchIndex === 0 ? lifetimePoints : ''},${matchIndex === 0 ? yearlyPoints : ''},${matchIndex === 0 ? proPoints : ''},${eventMultiplier},${players},${matchIndex === 0 ? participationPoints : ''},${format},${city},${place},${sactioningNumber},${matchNumber},${result},${matchPoints},${opponent}\n`;
                    content += rowString;
                    matchIndex++;
                }
            } catch(err) {
                console.log(err);
            }
        }

        modal.style.display = 'none';

        chrome.runtime.sendMessage({content: content});

        function displayWaitingModal() {
            let styles = `
            .pp-modal-background {
                position: fixed; 
                width: 100%; 
                height: 100%; 
                background-color: rgba(0,0,0,0.5); 
                left: 0; 
                top: 0;
                z-index: 1000;
            }

            .pp-modal {
                position: relative; 
                background-color: white; 
                padding: 20px; 
                width: 300px; 
                height: 200px; 
                top: calc(50vh - 100px); 
                left: calc(50vw - 150px); 
                text-align: center;
            }

            .pp-loader {
                border: 16px solid #f3f3f3; /* Light grey */
                border-top: 16px solid #3498db; /* Blue */
                border-radius: 50%;
                width: 120px;
                height: 120px;
                animation: pp-spin 2s linear infinite;
                margin: 10px 0 0 70px;
            }

            @keyframes pp-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            `;

            let styleElm = document.createElement('style');
            document.head.appendChild(styleElm);
            styleElm.type = 'text/css';
            styleElm.appendChild(document.createTextNode(styles));

            let modalBackground = document.createElement("div");
            modalBackground.setAttribute('class', 'pp-modal-background');
            document.body.append(modalBackground);
            let modal = document.createElement('div');
            modal.setAttribute('class', 'pp-modal');
            modalBackground.append(modal);
            let messageElm = document.createElement('div');
            messageElm.innerText = 'Building match history. This may take a few minutes';
            modal.append(messageElm);
            let loaderElm = document.createElement('div');
            loaderElm.setAttribute('class', 'pp-loader');
            modal.append(loaderElm);

            return modalBackground;
        }
    } else {
        alert('You must be on the "History" tab of the Planeswalker Points site.');
    }
})();
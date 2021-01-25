function main() {
    var board = document.getElementById('board');
    var winLength = 5;
    let columnMin = 0;
    let columnMax = 14;
    let rowMin = 0;
    let rowMax = 14;
    let player1Score = 0;
    let player2Score = 0;
    let activePlayer = 1;

    for(let y = rowMin; y <= rowMax; y++) {
        let tr = board.insertRow();

        for(let x = columnMin; x <= columnMax; x++) {
            initiateCell(tr, x, y, false);
        }
    }

    function initiateCell(row, xCoord, yCoord, insertBefore) {
        let td = insertBefore ? row.insertCell(0) : row.insertCell();
        td.id = xCoord + ',' + yCoord;
        
        td.addEventListener('click', function() {
            cellClick(td.id);
        }, false);
    }

    function cellClick(cellId) {
        let cell = document.getElementById(cellId);
        let cellClass = cell.getAttribute('class');

        if  (cellClass === null) {
            cell.className = activePlayer === 1 ? 'cross' : 'circle';
            expandCanvas(cellId);
            calculateWin(cellId);
            changePlayer();
        }
    }

    function expandCanvas(cellId) {
        let xCoord = parseInt(cellId.split(',')[0]);
        let yCoord = parseInt(cellId.split(',')[1]);
        
        if (yCoord === rowMax) {
            ++rowMax;
            let tr = board.insertRow();
            for(let x = columnMin; x <= columnMax; x++) {
                initiateCell(tr, x, rowMax, false);
            }
        } else if (yCoord === rowMin) {
            --rowMin;
            let tr = board.insertRow(0);
            for(let x = columnMin; x <= columnMax; x++) {
                initiateCell(tr, x, rowMin, false);
            }
        }
        
        let trs = document.querySelectorAll('tr');
        let rowCount = 1 + (rowMax - rowMin);

        if (xCoord === columnMax) {
            ++columnMax;
            for (let i = 0; i < rowCount; i++) {
                initiateCell(trs[i], columnMax, (rowMin + i), false);
            }
        } else if (xCoord === columnMin) {
            --columnMin;
            for (let i = 0; i < rowCount; i++) {
                initiateCell(trs[i], columnMin, (rowMin + i), true);
            }
        }
    }

    function calculateWin(cellId) {
        let cellClass = document.getElementById(cellId).getAttribute('class');
        let xCoord = parseInt(cellId.split(',')[0]);
        let yCoord = parseInt(cellId.split(',')[1]);
        let n = ne = e = se = s = sw = w = nw = 0;
        let nA = neA = eA = seA = sA = swA = wA = nwA = true;

        for (let i = 1; i < winLength; i++) {
            neA = neA && document.getElementById((xCoord + i) + ',' + (yCoord - i)).getAttribute('class') === cellClass;
            ne = neA ? (ne + 1) : ne;
            eA = eA && document.getElementById((xCoord + i) + ',' + (yCoord)).getAttribute('class') === cellClass;
            e = eA ? (e + 1) : e;
            seA = seA && document.getElementById((xCoord + i) + ',' + (yCoord + i)).getAttribute('class') === cellClass;
            se = seA ? (se + 1) : se;
            sA = sA && document.getElementById(xCoord + ',' + (yCoord + i)).getAttribute('class') === cellClass;
            s = sA ? (s + 1) : s;
            swA = swA && document.getElementById((xCoord - i) + ',' + (yCoord + i)).getAttribute('class') === cellClass;
            sw = swA ? (sw + 1) : sw;
            wA = wA && document.getElementById((xCoord - i) + ',' + (yCoord)).getAttribute('class') === cellClass;
            w = wA ? (w + 1) : w;
            nwA = nwA && document.getElementById((xCoord - i) + ',' + (yCoord - i)).getAttribute('class') === cellClass;
            nw = nwA ? (nw + 1) : nw;
            nA = nA && document.getElementById(xCoord + ',' + (yCoord - i)).getAttribute('class') === cellClass;
            n = nA ? (n + 1) : n;
        }

        if ((ne + sw) >= (winLength - 1)) {
            showWinner((xCoord - sw), (yCoord + sw), (xCoord + ne), (yCoord - ne));
        }

        if ((w + e) >= (winLength - 1)) {
            showWinner((xCoord - w), yCoord, (xCoord + e), yCoord);
        }

        if ((nw + se) >= (winLength - 1)) {
            showWinner((xCoord - nw), (yCoord - nw), (xCoord + se), (yCoord + se));
        }

        if ((n + s) >= (winLength - 1)) {
            showWinner(xCoord, (yCoord - n), xCoord, (yCoord + s));
        }
    }

    function showWinner(minX, minY, maxX, maxY) {

        document.querySelectorAll('td').forEach( td => {
            if (td.className === 'cross' || td.className === 'circle') {
                td.className += ' inactive';
            }
        });

        for (let i = 0; i < winLength; i++) {
            let coordinates = 
                maxX > minX && maxY > minY ? (minX + i) + ',' + (minY + i)
              : maxX > minX && maxY === minY ? (minX + i) + ',' + minY
              : maxX > minX && maxY < minY ? (minX + i) + ',' + (minY - i)
              : minX + ',' + (minY + i);

            document.getElementById(coordinates).className += ' emphasis';
        }

        if (activePlayer === 1) {
            ++player1Score;
            document.getElementById('player1Score').innerHTML = player1Score;
        } else {
            ++player2Score;
            document.getElementById('player2Score').innerHTML = player2Score;
        }
    }

    function changePlayer() {
        if (activePlayer === 1) {
            document.getElementById('cross').className = 'indicator cross';
            document.getElementById('circle').className += ' emphasis';
            activePlayer = 2;
        } else {
            document.getElementById('cross').className += ' emphasis';
            document.getElementById('circle').className = 'indicator circle';
            activePlayer = 1;
        }
    }
}
  
if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    main();
} else {
    document.addEventListener('DOMContentLoaded', main);
}
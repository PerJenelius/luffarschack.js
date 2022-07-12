'use strict';

const app = {
    board: document.getElementById('board'),
    winLength: 5,
    columnMin: 0,
    columnMax: 14,
    rowMin: 0,
    rowMax: 14,
    player1Score: 0,
    player2Score: 0,
    activePlayer: 1
};

const main = () => {
    for(let y = app.rowMin; y <= app.rowMax; y++) {
        let tr = app.board.insertRow();

        for(let x = app.columnMin; x <= app.columnMax; x++) {
            initiateCell(tr, x, y, false);
        }
    }
}

const initiateCell = (row, xCoord, yCoord, insertBefore) => {
    let td = insertBefore ? row.insertCell(0) : row.insertCell();
    td.id = xCoord + ',' + yCoord;
    
    td.addEventListener('click', function() {
        cellClick(td.id);
    }, false);
}

const cellClick = (cellId) => {
    let cell = document.getElementById(cellId);
    let cellClass = cell.getAttribute('class');

    if  (cellClass === null) {
        cell.className = app.activePlayer === 1 ? 'cross' : 'circle';
        expandCanvas(cellId);
        calculateWin(cellId);
        changePlayer();
    }
}

const expandCanvas = (cellId) => {
    let xCoord = parseInt(cellId.split(',')[0]);
    let yCoord = parseInt(cellId.split(',')[1]);
    
    if (yCoord === app.rowMax) {
        ++app.rowMax;
        let tr = app.board.insertRow();
        for(let x = app.columnMin; x <= app.columnMax; x++) {
            initiateCell(tr, x, app.rowMax, false);
        }
    } else if (yCoord === app.rowMin) {
        --app.rowMin;
        let tr = app.board.insertRow(0);
        for(let x = app.columnMin; x <= app.columnMax; x++) {
            initiateCell(tr, x, app.rowMin, false);
        }
    }
    
    let trs = document.querySelectorAll('tr');
    let rowCount = 1 + (app.rowMax - app.rowMin);

    if (xCoord === app.columnMax) {
        ++app.columnMax;
        for (let i = 0; i < rowCount; i++) {
            initiateCell(trs[i], app.columnMax, (app.rowMin + i), false);
        }
    } else if (xCoord === app.columnMin) {
        --app.columnMin;
        for (let i = 0; i < rowCount; i++) {
            initiateCell(trs[i], app.columnMin, (app.rowMin + i), true);
        }
    }
}

const calculateWin = (cellId) => {
    let cellClass = document.getElementById(cellId).getAttribute('class'), 
        xCoord = parseInt(cellId.split(',')[0]), 
        yCoord = parseInt(cellId.split(',')[1]);
    let n =0, ne = 0, e = 0, se = 0, s = 0, sw = 0, w = 0, nw = 0;
    let nA = true, neA = true, eA = true, seA = true, sA = true, swA = true, wA = true, nwA = true;

    for (let i = 1; i < app.winLength; i++) {
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

    if ((ne + sw) >= (app.winLength - 1)) {
        showWinner((xCoord - sw), (yCoord + sw), (xCoord + ne), (yCoord - ne));
    }

    if ((w + e) >= (app.winLength - 1)) {
        showWinner((xCoord - w), yCoord, (xCoord + e), yCoord);
    }

    if ((nw + se) >= (app.winLength - 1)) {
        showWinner((xCoord - nw), (yCoord - nw), (xCoord + se), (yCoord + se));
    }

    if ((n + s) >= (app.winLength - 1)) {
        showWinner(xCoord, (yCoord - n), xCoord, (yCoord + s));
    }
}

const showWinner = (minX, minY, maxX, maxY) => {

    document.querySelectorAll('td').forEach( td => {
        if (td.className === 'cross' || td.className === 'circle') {
            td.className += ' inactive';
        }
    });

    for (let i = 0; i < app.winLength; i++) {
        let coordinates = 
            maxX > minX && maxY > minY ? (minX + i) + ',' + (minY + i)
            : maxX > minX && maxY === minY ? (minX + i) + ',' + minY
            : maxX > minX && maxY < minY ? (minX + i) + ',' + (minY - i)
            : minX + ',' + (minY + i);

        document.getElementById(coordinates).className += ' emphasis';
    }

    if (app.activePlayer === 1) {
        ++app.player1Score;
        document.getElementById('player1Score').innerHTML = app.player1Score;
    } else {
        ++app.player2Score;
        document.getElementById('player2Score').innerHTML = app.player2Score;
    }
}

const changePlayer = () => {
    if (app.activePlayer === 1) {
        document.getElementById('cross').className = 'indicator cross';
        document.getElementById('circle').className += ' emphasis';
        app.activePlayer = 2;
    } else {
        document.getElementById('cross').className += ' emphasis';
        document.getElementById('circle').className = 'indicator circle';
        app.activePlayer = 1;
    }
}

if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    main();
} else {
    document.addEventListener('DOMContentLoaded', main);
}
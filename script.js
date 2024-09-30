function cellFactory(row, col) {

    let mark = "-";

    const getRow = () => row;
    const getCol = () => col;

    const setMark = (newMark) => {mark = newMark};
    const getMark = () => mark;

    const isMarked = () => mark !== "-";
    const clearMark = () => {mark = "-"};

    return {

        getRow,
        getCol,
        setMark,
        getMark,
        isMarked,
        clearMark

    };

};

function winningCellsFactory(cells) {

    let xWable = true;
    let oWable = true;

    let xW = false;
    let oW = false;

    const xWinnable = () => xWable;
    const oWinnable = () => oWable;

    const xWin = () => xW;
    const oWin = () => oW;

    const nEmpty = () => cells.filter((c) => !c.isMarked()).length;    
    //const isEmpty = () => nEmpty(cells) == 3

    const hasOnlyMark = (mark) => !cells.some((c) => c.isMarked() && c.getMark() !== mark);

    const winnable = (mark, rem) => hasOnlyMark(mark) && rem >= nEmpty(cells);
    const win = (mark) => hasOnlyMark(mark) && nEmpty() == 0;

    const push = (cell) => cells.push(cell);

    const update = (xRem, oRem) => {

        if(xWable)
            xWable = winnable("X", xRem);
        if(oWable)
            oWable = winnable("O", oRem);

        xW = win("X");
        oW = win("O");

    }

    const reset = () => {

        xWable = true;
        oWable = true;

        xW = false;
        oW = false;

    }

    return {

        xWinnable,
        oWinnable,
        xWin,
        oWin,
        push,
        update,
        reset

    };

};

const gameBoard = (() => {

    let dim = 3;

    let xRemaining = 5;
    let oRemaining = 4;

    const gameBoardArr = [];
    for(let i = 0; i < dim; i++) {
        gameBoardArr.push([]);
        for(let j = 0; j < dim; j++)
            gameBoardArr[i].push(cellFactory(i + 1, j + 1));
    }

    const getCell = (row, col) => gameBoardArr[row-1][col-1];

    const winCells = [];

    const buildWinCells = () => {

        winCells.length = 0;
        for(let i = 0; i < 2*(dim + 1); i++)
            winCells.push(winningCellsFactory([]));

        for(let i = 1; i <= dim; i++) {
            for(let j = 1; j <= dim; j++) {
                winCells[i-1].push(getCell(i, j));
                winCells[dim+j-1].push(getCell(i, j));
                if(i == j) winCells[2*dim].push(getCell(i, j));
                if(i == dim - j + 1) winCells[2*dim + 1].push(getCell(i, j));
            }
        }

    };

    buildWinCells();

    const nEmptyCells = () => xRemaining + oRemaining;

    const setMark = (row, col, mark) => {
        gameBoardArr[row-1][col-1].setMark(mark)
        mark === "X" ? xRemaining-- : oRemaining--;
    };

    const getMark = (row, col) => gameBoardArr[row-1][col-1].getMark();

    const reset = (xFirst) => {
        xRemaining = 4 + Number(xFirst);
        oRemaining = 4 + Number(!xFirst);
        gameBoardArr.forEach((row) => {row.forEach((cell) => {cell.clearMark();});});
        winCells.forEach((wcells) => wcells.reset());
    };

    const print = () => {

        let row1 = getMark(1, 1) + getMark(1, 2) + getMark(1, 3) + "\n";
        let row2 = getMark(2, 1) + getMark(2, 2) + getMark(2, 3) + "\n";
        let row3 = getMark(3, 1) + getMark(3, 2) + getMark(3, 3);

        console.log(row1 + row2 + row3);

    };

    const checkWin = () => winCells.some((wcells) => wcells.xWin() || wcells.oWin());
    const checkTie = () => !winCells.some((wcells) => wcells.xWinnable() || wcells.oWinnable());

    const checkResult = () => {
        winCells.forEach((wcells) => wcells.update(xRemaining, oRemaining));
        return (checkWin() && "w") || (checkTie() && "t") || "";
    };

    return {

        setMark,
        getMark,
        checkResult,
        reset,
        print

    };

})();

const game = (() => {

    let player1 = { name: "Joe", mark: "X", score: 0};
    let player2 = { name: "Jack", mark: "O", score: 0};

    const setPlayer1Name = (name) => {player1.name = name;};
    const getPlayer1Name = () => player1.name;

    const setPlayer2Name = (name) => {player2.name = name;};
    const getPlayer2Name = () => player2.name;

    const getPlayer1Mark = () => "X";
    const getPlayer2Mark = () => "O";

    const getPlayer1Score = () => player1.score;
    const getPlayer2Score = () => player2.score;

    const incPlayer1Score = () => {player1.score++;};
    const incPlayer2Score = () => {player2.score++;};

    const resetPlayerScores = () => {player1.score = player2.score = 0;};

    const makeMove = (row, col, p1) => {
        mark = p1 ? player1.mark : player2.mark;
        gameBoard.setMark(row, col, mark);
    };

    const checkResult = () => gameBoard.checkResult();

    return {

        setPlayer1Name,
        getPlayer1Name,
        setPlayer2Name,
        getPlayer2Name,
        getPlayer1Mark,
        getPlayer2Mark,
        getPlayer1Score,
        getPlayer2Score,
        incPlayer1Score,
        incPlayer2Score,
        resetPlayerScores,
        makeMove,
        checkResult

    };

})();

const gameControl = (() => {

    let n_rounds = 0;

    let p1First = true;
    let xRound = true;

    let _started = true;
    let winner1, winner2, tie = false;
    winner1 = winner2 = false;

    let player1RemainingMoves = 5;
    let player2RemainingMoves = 4;

    const setPlayer1Name = (name) => {game.setPlayer1Name(name);};
    const getPlayer1Name = () => game.getPlayer1Name();

    const setPlayer2Name = (name) => {game.setPlayer2Name(name);};
    const getPlayer2Name = () => game.getPlayer2Name();

    const getPlayer1Score = () => game.getPlayer1Score();
    const getPlayer2Score = () => game.getPlayer2Score();

    const getCurrentPlayerName = () => xRound ? game.getPlayer1Name() : game.getPlayer2Name();
    const getCurrentPlayerMark = () => xRound ? game.getPlayer1Mark() : game.getPlayer2Mark();
    const getCurrentPlayerRemainingMoves = () => xRound ? player1RemainingMoves : player2RemainingMoves;

    const getOtherPlayerName = () => xRound ? game.getPlayer2Name() : game.getPlayer1Name();
    const getOtherPlayerMark = () => xRound ? game.getPlayer2Mark() : game.getPlayer1Mark();
    const getOtherPlayerRemainingMoves = () => xRound ? player2RemainingMoves : player1RemainingMoves;

    const started = () => _started;
    const finished = () => winner1 || winner2 || tie;

    const newMove = (row, col) => {

        game.makeMove(row, col, xRound);
        let result = game.checkResult();

        if(result === "w") {

            xRound ? winner1 = true : winner2 = true;
            _started = false;

            if(winner1)
                game.incPlayer1Score();
            else
                game.incPlayer2Score();

            return [result, getCurrentPlayerName()];
        }
        else if(result === "t") {
            tie = true;
            _started = false;
            return [result, ""];
        }

        n_rounds++;
        xRound ? player1RemainingMoves-- : player2RemainingMoves--;

        xRound = !xRound;

        return [result, ""];

    };

    const start = () => {

        p1First = true;

        n_rounds = 0;
        xRound = p1First;
        _started = true;
        winner1 = winner2 = tie = false;

        player1RemainingMoves = 4 + Number(p1First);
        player2RemainingMoves = 4 + Number(!p1First);

        game.resetPlayerScores();
        gameBoard.reset(p1First);

    };

    const startNewGame = () => {

        p1First = !p1First;

        n_rounds = 0;
        xRound = p1First;
        _started = true;
        winner1 = winner2 = tie = false;

        player1RemainingMoves = 4 + Number(p1First);
        player2RemainingMoves = 4 + Number(!p1First);

        gameBoard.reset(p1First);

    };

    return {

        setPlayer1Name,
        getPlayer1Name,
        setPlayer2Name,
        getPlayer2Name,
        getPlayer1Score,
        getPlayer2Score,
        getCurrentPlayerName,
        getCurrentPlayerMark,
        started,
        finished,
        newMove,
        start,
        startNewGame

    };

})();

const gameInterface = (() => {

    //const crossPath = "url(./images/cross.svg)";
    //const circlePath = "url(./images/circle.svg)";

    const gameBoardEl = document.querySelector(".gameboard");

    const display = document.querySelector(".display");

    const p1Container = document.getElementById("p1-container");
    const p1Name = document.getElementById("p1-name");
    const p1NameInput = document.getElementById("p1-name-input");
    const p1NameBtn = document.getElementById("p1-name-btn");
    const p1Score = document.getElementById("p1-score");

    const p2Container = document.getElementById("p2-container");
    const p2Name = document.getElementById("p2-name");
    const p2NameInput = document.getElementById("p2-name-input");
    const p2NameBtn = document.getElementById("p2-name-btn");
    const p2Score = document.getElementById("p2-score");

    const startBtn = document.querySelector(".start-btn");
    const resetBtn = document.querySelector(".reset-btn");

    const changePlayerName = (evt) => {

        target = evt.target;
        let p1 = target.id === "p1-name-btn";
        let name = p1 ? p1NameInput.value : p2NameInput.value;

        if(name) {
            if(p1) {
                gameControl.setPlayer1Name(name);
                p1Name.innerText = name;
            }
            else {
                gameControl.setPlayer2Name(name);
                p2Name.innerText = name;
            }
        }

    }

    const startNewGame = () => {
        if(!gameControl.started()) {
            document.querySelectorAll(".cell").forEach((e) => e.removeAttribute("marked"));
            gameControl.startNewGame();
            display.innerText = gameControl.getCurrentPlayerName() + "'s turn";
        }
    }

    const reset = () => {
        document.querySelectorAll(".cell").forEach((e) => e.removeAttribute("marked"));
        p1Container.replaceChildren(p1Name, p1NameInput.parentElement, p1Score);
        p2Container.replaceChildren(p2Name, p2NameInput.parentElement, p2Score);
        gameControl.start();
        display.innerText = gameControl.getCurrentPlayerName() + "'s turn";
    }

    const updateScore = () => {
        p1Score.innerText = "Score: " + gameControl.getPlayer1Score();
        p2Score.innerText = "Score: " + gameControl.getPlayer2Score();
    }

    const newMove = (evt) => {

        const cell = evt.target;
        if(!cell.hasAttribute("marked") && !gameControl.finished()) {

            if(p1NameInput.parentElement.checkVisibility()) {
                updateScore();
                p1Container.replaceChildren(p1Name, p1Score, p1NameInput.parentElement);
                p2Container.replaceChildren(p2Name, p2Score, p2NameInput.parentElement);
            }

            cell.setAttribute("marked", gameControl.getCurrentPlayerMark());

            let row = parseInt(cell.getAttribute("row"));
            let col = parseInt(cell.getAttribute("col"));

            let [result, winnerName] = gameControl.newMove(row, col);

            if(result === "w") {
                display.innerText = `${winnerName} WINS!`;
                updateScore();
            }
            else if(result === "t")
                display.innerText = "A TIE!";
            else
                display.innerText = gameControl.getCurrentPlayerName() + "'s turn";

        }   

    }

    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            const cellBtn = document.createElement("button");
            cellBtn.classList.add("cell");
            cellBtn.setAttribute("row", i+1);
            cellBtn.setAttribute("col", j+1);
            cellBtn.addEventListener("click", newMove);
            gameBoardEl.appendChild(cellBtn);
        }
    }

    p1NameBtn.addEventListener("click", changePlayerName);
    p2NameBtn.addEventListener("click", changePlayerName);

    gameControl.setPlayer1Name(p1Name.innerText);
    gameControl.setPlayer2Name(p2Name.innerText);

    display.innerText = gameControl.getCurrentPlayerName() + "'s turn";

    startBtn.addEventListener("click", startNewGame);
    resetBtn.addEventListener("click", reset);

})();

gameControl.start();
function cellFactory(row, col) {

    let mark = "-";

    const getRow = () => row;
    const getCol = () => col;

    const setMark = (newMark) => {mark = newMark};
    const getMark = () => mark;

    const isMarked = function () {return mark !== "-"};
    const clearMark = function () {mark = "-"};

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

        for(let i = 1; i <= dim; i++) {
            let row = [];
            for(let j = 1; j <= dim; j++)
                row.push(getCell(i, j));
            winCells.push(winningCellsFactory(row));
        }

        for(let j = 1; j <= dim; j++) {
            let col = [];
            for(let i = 1; i <= dim; i++)
                col.push(getCell(i, j));
            winCells.push(winningCellsFactory(col));
        }

        const mainDiag = [];
        for(let k = 1; k <= dim; k++)
            mainDiag.push(getCell(k, k));
        winCells.push(winningCellsFactory(mainDiag));

        const offDiag = [];
        for(let k = 1; k <= dim; k++)
            offDiag.push(getCell(k, dim - k + 1));
        winCells.push(winningCellsFactory(offDiag));

    };

    buildWinCells();

    const nEmptyCells = () => xRemaining + oRemaining;

    const setMark = (row, col, mark) => {
        gameBoardArr[row-1][col-1].setMark(mark)
        if(mark == "X")
            xRemaining--;
        else
            oRemaining--;
    };

    const getMark = (row, col) => gameBoardArr[row-1][col-1].getMark();

    const reset = (xFirst) => {
        xRemaining = 4 + (xFirst ? 1 : 0);
        oRemaining = 4 + (xFirst ? 0 : 1);
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
        if(checkWin())
            return "w";
        if(checkTie())
            return "t";

        return ""

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

    let player1 = { name: "Player 1", mark: "X"};
    let player2 = { name: "Player 2", mark: "O"};

    const setPlayer1Name = (name) => {player1.name = name;};
    const getPlayer1Name = () => player1.name;

    const setPlayer2Name = (name) => {player2.name = name;};
    const getPlayer2Name = () => player2.name;

    const getPlayer1Mark = () => "X";
    const getPlayer2Mark = () => "O";

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
        makeMove,
        checkResult

    };

})();

const gameControl = (() => {

    let n_rounds = 0;

    let player1RemainingMoves = 5;
    let player2RemainingMoves = 4;

    const getCurrentPlayerName = () => n_rounds%2 ? game.getPlayer2Name() : game.getPlayer1Name();
    const getCurrentPlayerMark = () => n_rounds%2 ? game.getPlayer2Mark() : game.getPlayer1Mark();
    const getCurrentPlayerRemainingMoves = () => n_rounds%2 ? player2RemainingMoves : player1RemainingMoves;

    const getOtherPlayerName = () => n_rounds%2 ? game.getPlayer1Name() : game.getPlayer2Name();
    const getOtherPlayerMark = () => n_rounds%2 ? game.getPlayer1Mark() : game.getPlayer2Mark();
    const getOtherPlayerRemainingMoves = () => n_rounds%2 ? player1RemainingMoves : player2RemainingMoves;

    const newMove = (row, col) => {

        game.makeMove(row, col, n_rounds%2 == 0);
        let result = game.checkResult();

        if(result === "w")
            return [result, getCurrentPlayerName()];
        else if(result === "t")
            return [result, ""];

        n_rounds++;
        n_rounds%2 ? player2RemainingMoves-- : player1RemainingMoves--;

        return [result, ""];

    };

    const start = () => {

        n_rounds = 0;

        player1RemainingMoves = 5;
        player2RemainingMoves = 4;

        gameBoard.reset(true);

    };

    return {

        getCurrentPlayerName,
        getCurrentPlayerMark,
        newMove,
        start

    };

})();

const gameInterface = (() => {

    const crossPath = "url(./images/cross.svg)";
    const circlePath = "url(./images/circle.svg)";

    const newMove = (evt) => {

        const cell = evt.target;
        if(!cell.hasAttribute("marked")) {

            let row = parseInt(cell.getAttribute("row"));
            let col = parseInt(cell.getAttribute("col"));

            cell.style.backgroundImage = gameControl.getCurrentPlayerMark() === "X" ? crossPath : circlePath;
            cell.style.backgroundSize = "cover";

            cell.setAttribute("marked", "");

            let [result, winnerName] = gameControl.newMove(row, col);

            if(result === "w")
                alert(`${winnerName} WINS!`);
            else if(result === "t")
                alert("A TIE!");

        }   

    }

    const gameBoardEl = document.querySelector(".gameboard");
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

})();

gameControl.start();
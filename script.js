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

}

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

        console.log(`${xRem} ${oRem}`)

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

}

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
        else if(checkTie())
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

    let player1 = { name: "Joe", mark: "X"};
    let player2 = { name: "Jack", mark: "O"};

    const setPlayer1Name = (name) => {player1.name = name;};
    const getPlayer1Name = () => player1.name;

    const setPlayer2Name = (name) => {player2.name = name;};
    const getPlayer2Name = () => player2.name;

    const getPlayer1Mark = () => "X";
    const getPlayer2Mark = () => "O";
    
    return {

        setPlayer1Name,
        getPlayer1Name,
        setPlayer2Name,
        getPlayer2Name,
        getPlayer1Mark,
        getPlayer2Mark

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


    const playRound = () => {

        mark = getCurrentPlayerMark();

        console.log(`PLAYER ${1 + n_rounds%2}'S TURN`);
        let [row, col] = prompt("YOUR MOVE").split(" ").map((e) => parseInt(e));

        gameBoard.setMark(row, col, mark);

        if(n_rounds%2 == 0)
            player1RemainingMoves--;
        else
            player2RemainingMoves--;

    }

    const play = () => {

        n_rounds = 0;

        player1RemainingMoves = 5;
        player2RemainingMoves = 4;

        gameBoard.reset(true);

        while(n_rounds < 9) {

            gameBoard.print();
            playRound();
            
            n_rounds++;

            let result = gameBoard.checkResult();
            if(result === "w") {
                console.log(`${getOtherPlayerName()} WINS!`);
                break;
            }
            if(result === "t") {
                console.log("A TIE!");
                break;
            }

        }

        gameBoard.print();

    }

    return {

        //getCurrentPlayerName,
        //getCurrentPlayerMark,
        play

    };

})();

gameControl.play();
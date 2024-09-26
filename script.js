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

const gameBoard = (() => {

    const gameBoardArr = [];
    for(let i = 0; i < 3; i++) {
        gameBoardArr.push([]);
        for(let j = 0; j < 3; j++)
            gameBoardArr[i].push(cellFactory(i + 1, j + 1));
    }

    const getCell = (row, col) => gameBoardArr[row-1][col-1];

    const setMark = (row, col, mark) => {gameBoardArr[row-1][col-1].setMark(mark)}
    const getMark = (row, col) => gameBoardArr[row-1][col-1].getMark();

    const clear = () => {
        gameBoardArr.forEach((row) => {row.forEach((cell) => {cell.clearMark();});});
    }

    const printBoard = () => {

        let row1 = getMark(1, 1) + getMark(1, 2) + getMark(1, 3) + "\n";
        let row2 = getMark(2, 1) + getMark(2, 2) + getMark(2, 3) + "\n";
        let row3 = getMark(3, 1) + getMark(3, 2) + getMark(3, 3);

        console.log(row1 + row2 + row3);

    };

    const winCells = [
        [getCell(1, 1), getCell(1, 2), getCell(1, 3)],
        [getCell(2, 1), getCell(2, 2), getCell(2, 3)],
        [getCell(3, 1), getCell(3, 2), getCell(3, 3)],
        [getCell(1, 1), getCell(2, 1), getCell(3, 1)],
        [getCell(1, 2), getCell(2, 2), getCell(3, 2)],
        [getCell(1, 3), getCell(2, 3), getCell(3, 3)],
        [getCell(1, 1), getCell(2, 2), getCell(3, 3)],
        [getCell(3, 1), getCell(2, 2), getCell(1, 3)]
    ];

    const checkWin = () => {

        let hasAWinner = false;

        for(let i = 0; i < 8; i++) {
            let wCells = winCells[i];
            firstMark = wCells[0].getMark();
            if(wCells.every((cell) => cell.isMarked() && cell.getMark() === firstMark)) {
                hasAWinner = true;
                break;
            }         
        }

        return hasAWinner;

    };

    const checkTie = () => {

        let tie = false;

        return tie;

    };

    return {

        setMark,
        getMark,
        checkWin,
        clear,
        printBoard

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

    const getCurrentPlayerName = () => n_rounds%2 ? game.getPlayer1Name() : game.getPlayer2Name();
    const getCurrentPlayerMark = () => n_rounds%2 ? game.getPlayer1Mark() : game.getPlayer2Mark();

    const playRound = () => {

        mark = getCurrentPlayerMark();

        console.log(`PLAYER ${1 + n_rounds%2}'S TURN`);
        let [row, col] = prompt("YOUR MOVE").split(" ").map((e) => parseInt(e));

        gameBoard.setMark(row, col, mark);

        n_rounds++;
        
    }

    const play = () => {

        n_rounds = 0;

        gameBoard.clear();

        while(n_rounds < 9 && !gameBoard.checkWin()) {
            gameBoard.printBoard();
            playRound();
        }

        gameBoard.printBoard();

    }

    return {

        //getCurrentPlayerName,
        //getCurrentPlayerMark,
        play

    };

})();

gameControl.play();
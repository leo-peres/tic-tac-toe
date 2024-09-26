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

    const nEmptyCells = () => {

        let row1c = gameBoardArr[0].filter((cell) => !cell.isMarked()).length;
        let row2c = gameBoardArr[1].filter((cell) => !cell.isMarked()).length;
        let row3c = gameBoardArr[2].filter((cell) => !cell.isMarked()).length;

        return row1c + row2c + row3c;

    }

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
            let wcells = winCells[i];
            firstMark = wcells[0].getMark();
            if(wcells.every((cell) => cell.isMarked() && cell.getMark() === firstMark)) {
                hasAWinner = true;
                break;
            }         
        }

        return hasAWinner;

    };

    const checkTie = (mark, rem, omark, orem) => {

        let emptyCells = nEmptyCells();

        const nEmpty = (wcells) => {
            return wcells.filter((cell) => !cell.isMarked()).length;
        }

        const isEmpty = (wcells) => {
            return nEmpty(wcells) == 3;
        }

        const hasOnlyMark = (wcells, mark) => {

            if(!isEmpty(wcells)) {
                if(wcells.some((cell) => cell.isMarked() && cell.getMark() !== mark))
                    return false;
                else
                    return true;
            }

            return true;           

        }

        const isWinnable = (wcells, mark, rem, orem) => {
            let empty = nEmpty(wcells);
            return hasOnlyMark(wcells, mark) &&
                   empty <= rem &&
                   emptyCells - empty >= orem;
        }

        return winCells.filter((wcells) => isWinnable(wcells, mark, rem, orem)).length == 0 &&
               winCells.filter((wcells) => isWinnable(wcells, omark, orem, rem)).length == 0;

    };

    return {

        setMark,
        getMark,
        checkWin,
        checkTie,
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

        gameBoard.clear();

        while(n_rounds < 9) {

            gameBoard.printBoard();
            playRound();
            
            n_rounds++;

            if(gameBoard.checkWin()) {
                console.log(`${getOtherPlayerName()} WINS!`)
                break;
            }
            if(gameBoard.checkTie(getCurrentPlayerMark(), getCurrentPlayerRemainingMoves(), getOtherPlayerMark(), getOtherPlayerRemainingMoves())) {
                console.log("A TIE!");
                break;
            }

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
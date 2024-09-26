const cellFactory = (row, col) => {

    let mark = "-";

    const isMarked = () => mark !== "-";
    const clearMark = () => mark = "-";

    return {

        row,
        col,
        mark,
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

    const setMark = (row, col, mark) => {gameBoardArr[row-1][col-1].mark = mark}
    const getMark = (row, col) => gameBoardArr[row-1][col-1].mark;

    const clearGameBoard = () => {
        gameBoardArr.forEach((row) => {row.forEach((cell) => {cell.clearMark();});});
    }

    const printBoard = () => {

        let row1 = getMark(1, 1) + getMark(1, 2) + getMark(1, 3) + "\n";
        let row2 = getMark(2, 1) + getMark(2, 2) + getMark(2, 3) + "\n";
        let row3 = getMark(3, 1) + getMark(3, 2) + getMark(3, 3);

        console.log(row1 + row2 + row3);

    };

    return {

        setMark,
        getMark,
        clearGameBoard,
        printBoard

    };

})();

//game state:
//1. number of turns
//2. whose turn is it
//3. game board current's state (that is, some cells will be marked with X's and O's)

//game start (i.e. before 1st move): board is empty and it's player 1's turn
//after ith move: check for win condition or tie condition
//before (i+1)th move: it's player (2 - i%2)'s turn

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

        gameBoard.clearGameBoard();

        while(n_rounds < 9) {
            gameBoard.printBoard();
            playRound();
        }

    }

    return {

        //getCurrentPlayerName,
        //getCurrentPlayerMark,
        play

    };

})();

gameControl.play();
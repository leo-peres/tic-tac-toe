function cpuPlayerFactory(mark, type) {

    const otherMark = mark === "X" ? "O" : "X";

    const dim = () => gameBoard.getDimension();

    const mayWin = (s, rem) => !s.includes(otherMark) && s.split('-').length - 1 <= rem;

    const winner = (s, dim) => !s.includes(otherMark) && s.split(mark).length == dim;

    const loser = (s, dim) => !s.includes(mark) && s.split(otherMark).length  == dim;

    const investigate = (rcPair) => {

        let [row, col] = rcPair;

        const state = gameBoard.getState();

        let dim = state[0].length;
        let rem = mark === "X" ? state[dim] : state[dim+1];

        let w = false;
        let l = false;
        let count = 0;

        let s = "";
        for(let j = 0; j < dim; j++)
            s += state[row-1][j];
        if(winner(s, dim)) w = true;
        if(loser(s, dim)) l = true;
        count += Number(mayWin(s, rem));

        s = "";
        for(let i = 0; i < dim; i++)
            s += state[i][col-1];
        if(winner(s, dim)) w = true;
        if(loser(s, dim)) l = true;
        count += Number(mayWin(s, rem));

        if(row === col) {
            s = "";
            for(let k = 0; k < dim; k++)
                s += state[k][k];
            if(winner(s, dim)) w = true;
            if(loser(s, dim)) l = true;
            count += Number(mayWin(s, rem));
        }

        if(row === dim - col + 1) {
            s = "";
            for(let k = 0; k < dim; k++)
                s += state[k][dim - k - 1];
            if(winner(s, dim)) w = true;
            if(loser(s, dim)) l = true;
            count += Number(mayWin(s, rem));
        }

        return [w, l, count];

    }

    const emptyCells = () => {

        const state = gameBoard.getState();

        let dim = state[0].length;
        
        const empCells = [];
        for(let i = 0; i < dim; i++) {
            for(let j = 0; j < dim; j++) {
                if(state[i][j] === "-") {
                    empCells.push([i+1, j+1].concat(investigate([i+1, j+1])));
                }
            }
        }
        
        return empCells;

    };

    const getMark = () => mark;

    const getMove = () => {

        const empCells = emptyCells();
        let nEmpty = empCells.length;

        let row, col;
        let r = Math.random();
        if(type >= 3 && empCells.some((x) => x[2])) {
            let a = empCells.filter((x) => x[2]);
            let i = Math.floor(r*a.length);
            [row, col] = [a[i][0], a[i][1]];
        }
        else if(type >= 3 && empCells.some((x) => x[3])) {
            let a = empCells.filter((x) => x[3]);
            let i = Math.floor(r*a.length);
            [row, col] = [a[i][0], a[i][1]];
        }
        else if(type >= 4 && empCells.reduce((max, e) => e[4] > max ? e[4] : max, -1) > 0) {

            let isDiagonal = (rc) => rc[0] === rc[1] || rc[0] === dim() - rc[1] + 1;

            let max = empCells.reduce((max, x) => x[4] > max ? x[4] : max, -1);
            let a = empCells.filter((x) => x[4] == max);

            if(a.some((rc) => isDiagonal(rc)))
                a = a.filter((rc) => isDiagonal(rc));

            let i = Math.floor(r*a.length);
            [row, col] = [a[i][0], a[i][1]];

        }
        else {
            let r = Math.floor(nEmpty*Math.random());
            [row, col] = [empCells[r][0], empCells[r][1]]
        }

        return [row, col];

    }

    return {

        getMark,
        getMove

    };

}

///////////////////////////////////////////////////////////////////////////////////////

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

function winningCellsFactory(cells, code) {

    let xWable = true;
    let oWable = true;

    let xW = false;
    let oW = false;

    const getCode = () => code;

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

        getCode,
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
    const winCells = [];

    const getCell = (row, col) => gameBoardArr[row-1][col-1];

    const buildWinCells = () => {

        winCells.length = 0;
        for(let i = 0; i < 2*(dim + 1); i++) {
            let code = (i < dim && "r" + (i+1)) || (i < 2*dim && "c" + (i+1-dim)) || (i == 2*dim && "md") || "od";
            winCells.push(winningCellsFactory([], code));
        }

        for(let i = 1; i <= dim; i++) {
            for(let j = 1; j <= dim; j++) {
                winCells[i-1].push(getCell(i, j));
                winCells[dim+j-1].push(getCell(i, j));
                if(i == j) winCells[2*dim].push(getCell(i, j));
                if(i == dim - j + 1) winCells[2*dim + 1].push(getCell(i, j));
            }
        }

    };

    const buildBoard = () => {

        gameBoardArr.length = 0;
        for(let i = 0; i < dim; i++) {
            gameBoardArr.push([]);
            for(let j = 0; j < dim; j++)
                gameBoardArr[i].push(cellFactory(i + 1, j + 1));
        }

        buildWinCells();

    };

    const nEmptyCells = () => xRemaining + oRemaining;

    const setMark = (row, col, mark) => {
        gameBoardArr[row-1][col-1].setMark(mark)
        mark === "X" ? xRemaining-- : oRemaining--;
    };

    const getMark = (row, col) => gameBoardArr[row-1][col-1].getMark();

    const setDimension = (newDim) => {
        dim = newDim;
        buildBoard();
    };

    const getDimension = () => dim;

    const getState = () => {
        const state = gameBoardArr.map((row) => row.reduce((v, c) => v + c.getMark(), ""));
        state.push(xRemaining);
        state.push(oRemaining);
        return state;
    }

    const reset = (xFirst) => {
        xRemaining = Math.floor((dim*dim)/2) + Number(xFirst);
        oRemaining = Math.floor((dim*dim)/2) + Number(!xFirst);
        gameBoardArr.forEach((row) => {row.forEach((cell) => {cell.clearMark();});});
        winCells.forEach((wcells) => wcells.reset());
    };

    const checkWin = () => winCells.some((wcells) => wcells.xWin() || wcells.oWin());
    const checkTie = () => !winCells.some((wcells) => wcells.xWinnable() || wcells.oWinnable());

    const checkResult = () => {
        winCells.forEach((wcells) => wcells.update(xRemaining, oRemaining));
        return (checkWin() && "w") || (checkTie() && "t") || "";
    };

    const getWinCode = () => {
        if(checkWin())
            return winCells.find((wcells) => wcells.xWin() || wcells.oWin()).getCode();
        return "";
    };

    buildBoard();

    return {

        setMark,
        getMark,
        setDimension,
        getDimension,
        getState,
        checkResult,
        getWinCode,
        reset,
        print

    };

})();

const game = (() => {

    let dim = 3;

    const player1 = { name: "Joe", mark: "X", score: 0, cpu: null, isCPU: false};
    const player2 = { name: "Jack", mark: "O", score: 0, cpu: null, isCPU: false};

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

    const changeP1Type = (type) => {
        player1.cpu = type === 1 ? null : cpuPlayerFactory("X", type);
        player1.isCPU = !(type === 1);
    }

    const changeP2Type = (type) => {
        player2.cpu = type === 1 ? null : cpuPlayerFactory("O", type);
        player2.isCPU = !(type === 1);
    }

    const p1CPU = () => player1.isCPU;
    const p2CPU = () => player2.isCPU;

    const resetPlayerScores = () => {player1.score = player2.score = 0;};

    const setDimension = (newDim) => {
        dim = newDim;
        gameBoard.setDimension(newDim);
    }

    const getDimension = () => dim;

    const makeMove = (row, col, p1) => {
        mark = p1 ? player1.mark : player2.mark;
        gameBoard.setMark(row, col, mark);
    };

    const getCPUMove = (p1) => p1 ? player1.cpu.getMove() : player2.cpu.getMove();

    const checkResult = () => gameBoard.checkResult();

    const getWinCode = () => gameBoard.getWinCode();

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
        changeP1Type,
        changeP2Type,
        p1CPU,
        p2CPU,
        resetPlayerScores,
        setDimension,
        getDimension,
        makeMove,
        getCPUMove,
        checkResult,
        getWinCode

    };

})();

const gameControl = (() => {

    let n_moves = 0;

    let p1First = true;
    let xMove = true;

    let roundReady = true;
    let _gameStarted = false;
    let _roundStarted = false;
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

    const getCurrentPlayerName = () => xMove ? game.getPlayer1Name() : game.getPlayer2Name();
    const getCurrentPlayerMark = () => xMove ? game.getPlayer1Mark() : game.getPlayer2Mark();
    const getCurrentPlayerRemainingMoves = () => xMove ? player1RemainingMoves : player2RemainingMoves;

    const getOtherPlayerName = () => xMove ? game.getPlayer2Name() : game.getPlayer1Name();
    const getOtherPlayerMark = () => xMove ? game.getPlayer2Mark() : game.getPlayer1Mark();
    const getOtherPlayerRemainingMoves = () => xMove ? player2RemainingMoves : player1RemainingMoves;

    const cpuMove = () => xMove ? game.p1CPU() : game.p2CPU()

    const setDimension = (dim) => {
        game.setDimension(dim);
        setUpRound();
    };

    const changePlayerType = (type, p1) => {
        if(p1)
            game.changeP1Type(type);
        else
            game.changeP2Type(type);
    }

    const ready = () => roundReady;
    const gameStarted = () => _gameStarted;
    const roundStarted = () => _roundStarted;
    const finished = () => winner1 || winner2 || tie;

    const newMove = (row, col) => {

        _gameStarted = _roundStarted = true;

        game.makeMove(row, col, xMove);
        let result = game.checkResult();

        if(result === "w") {

            xMove ? winner1 = true : winner2 = true;
            roundReady = false;
            _roundStarted = false;

            if(winner1)
                game.incPlayer1Score();
            else
                game.incPlayer2Score();

            return [result, getCurrentPlayerName()];
        }
        else if(result === "t") {
            tie = true;
            roundReady = false;
            _roundStarted = false;
            return [result, ""];
        }

        n_moves++;
        xMove ? player1RemainingMoves-- : player2RemainingMoves--;

        xMove = !xMove;

        return [result, ""];

    };

    const getCPUMove = () => game.getCPUMove(xMove);

    const getWinCode = () => game.getWinCode();

    const setUpRound = () => {

        n_moves = 0;
        xMove = p1First;
        roundReady = true;
        _roundStarted = false;
        winner1 = winner2 = tie = false;

        let dim = game.getDimension();
        player1RemainingMoves = Math.floor((dim*dim)/2) + Number(p1First);
        player2RemainingMoves = Math.floor((dim*dim)/2) + Number(!p1First);

        gameBoard.reset(p1First);

    }

    const start = () => {
        p1First = true;
        _gameStarted = false;
        game.resetPlayerScores();
        setUpRound();
    };

    const startNewRound = () => {
        p1First = !p1First;
        setUpRound();
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
        getOtherPlayerName,
        getOtherPlayerMark,
        cpuMove,
        setDimension,
        changePlayerType,
        ready,
        gameStarted,
        roundStarted,
        finished,
        newMove,
        getCPUMove,
        getWinCode,
        start,
        startNewRound

    };

})();

const gameInterface = (() => {

    const body = document.querySelector("body");

    const gameBoardEl = document.querySelector(".gameboard");

    const display = document.querySelector(".display span");

    const p1Container = document.getElementById("p1-container");
    const p1Name = document.getElementById("p1-btn");
    const p1NameInput = document.getElementById("p1-name-input");
    const p1NameBtn = document.getElementById("p1-name-btn");
    const p1Score = document.getElementById("p1-score");

    const p2Container = document.getElementById("p2-container");
    const p2Name = document.getElementById("p2-btn");
    const p2NameInput = document.getElementById("p2-name-input");
    const p2NameBtn = document.getElementById("p2-name-btn");
    const p2Score = document.getElementById("p2-score");

    const startBtn = document.querySelector(".start-btn");
    const resetBtn = document.querySelector(".reset-btn");

    let dim = 3;
    let cpuTimeoutID;

    const writeToDisplay = (code, name) => {
        if(code == "w")
            display.innerText = `${name} WINS!`;
        else if(code == "t")
            display.innerText = "A TIE!";
        else
            display.innerText = name + "'" + (name.at(-1).match(/[sS]/) ? "" : "s") + " turn";
    }

    const changePlayerName = (evt) => {

        let p1 = evt.target.id === "p1-name-btn";
        let name = p1 ? p1NameInput.value : p2NameInput.value;

        if(name) {
            if(p1) {
                gameControl.setPlayer1Name(name);
                p1Name.innerText = name;
                writeToDisplay("", name);
            }
            else {
                gameControl.setPlayer2Name(name);
                p2Name.innerText = name;
            }
        }

    }

    const paintWinningCells = (code) => {
        document.querySelectorAll(`.cell[code*=${code}]`).forEach((c) => c.setAttribute("win", ""));
    }

    const showCursor = () => {
        if(gameControl.finished() || gameControl.cpuMove()) {
            hideCursor(); //hide custom cursors
            gameBoardEl.style.cursor = "auto";
        }
        else {
            document.getElementById(gameControl.getCurrentPlayerMark() + "cursor").style.display = "block";
            document.getElementById(gameControl.getOtherPlayerMark() + "cursor").style.display = "none";
            gameBoardEl.style.cursor = "none";
        }
    }

    const hideCursor = () => {document.querySelectorAll(".cursor-img").forEach((c) => {c.style.display = "none";});};

    const cpuMove = () => {
        cpuTimeoutID = setTimeout(() => {
            let [row, col] = gameControl.getCPUMove();
            newMove(row, col);
        }, 300);
    }

    const reset = () => {
        document.querySelectorAll(".cell").forEach((e) => e.removeAttribute("marked"));
        document.querySelectorAll(".cell").forEach((e) => e.removeAttribute("win"));
        p1Container.replaceChildren(p1Name, p1NameInput.parentElement, p1Score);
        p2Container.replaceChildren(p2Name, p2NameInput.parentElement, p2Score);
        clearTimeout(cpuTimeoutID);
        gameControl.start();
        writeToDisplay("", gameControl.getCurrentPlayerName());
    }

    const updateScore = () => {
        p1Score.innerText = "Score: " + gameControl.getPlayer1Score();
        p2Score.innerText = "Score: " + gameControl.getPlayer2Score();
    }

    const markCell = (row, col, mark) => {
        const cell = document.querySelector(`.cell[row="${row}"][col="${col}"]`);
        cell.setAttribute("marked", mark);
    }

    const newMove = (row, col) => {

        if(!gameControl.gameStarted()) {
            updateScore();
            p1Container.replaceChildren(p1Name, p1Score, p1NameInput.parentElement);
            p2Container.replaceChildren(p2Name, p2Score, p2NameInput.parentElement);
        }

        markCell(row, col, gameControl.getCurrentPlayerMark());

        let [result, winnerName] = gameControl.newMove(row, col);

        if(result === "w") {
            writeToDisplay("w", winnerName);
            paintWinningCells(gameControl.getWinCode());
        }
        else
            writeToDisplay(result, gameControl.getCurrentPlayerName());

        showCursor();

        if(gameControl.cpuMove() && !gameControl.finished())
            cpuMove();

    }

    const buildBoard = () => {

        gameBoardEl.innerText = "";
        gameBoardEl.style.setProperty("--dim", dim);
        for(let i = 0; i < dim; i++) {
            for(let j = 0; j < dim; j++) {

                const cellBtn = document.createElement("button");
                cellBtn.classList.add("cell");

                cellBtn.setAttribute("row", i+1);
                cellBtn.setAttribute("col", j+1);
                cellBtn.setAttribute("code", "r" + (i+1));
                cellBtn.setAttribute("code", (cellBtn.getAttribute("code") || "") + " c" + (j+1));
                if(i == j) cellBtn.setAttribute("code", (cellBtn.getAttribute("code") || "") + " md");
                if(i == dim - j - 1) cellBtn.setAttribute("code", (cellBtn.getAttribute("code") || "") + " od");

                cellBtn.addEventListener("click", (evt) => {

                    const cell = evt.target;
                    if(!cell.hasAttribute("marked") && !gameControl.finished() && !gameControl.cpuMove()) {
            
                        let row = parseInt(cell.getAttribute("row"));
                        let col = parseInt(cell.getAttribute("col"));

                        newMove(row, col)

                        }

                    });

                gameBoardEl.appendChild(cellBtn);

            }
        } 

    }

    const changeDimension = (newDim) => {

        dim = newDim;

        gameControl.setDimension(dim);
        buildBoard();

        document.querySelectorAll(".cursor-img").forEach((e) => {
            e.setAttribute("width", 315/dim);
            e.setAttribute("height", 315/dim);
        });

        if(!gameControl.ready())
            startNewRound();
        
    }

    const changePlayerType = (type, p1) => {
        type = (type === "human" && 1) ||
               (type === "cpu-easy" && 2) ||
               (type === "cpu-medium" && 3) ||
               (type === "cpu-hard" && 4);
        gameControl.changePlayerType(type, p1);
    }


    const start = () => {
        buildBoard();
        gameControl.start();
    }

    const startNewRound = () => {
        if(!gameControl.ready()) {
            document.querySelectorAll(".cell").forEach((e) => e.removeAttribute("marked"));
            document.querySelectorAll(".cell").forEach((e) => e.removeAttribute("win"));
            gameControl.startNewRound();
            updateScore();
            writeToDisplay("", gameControl.getCurrentPlayerName());
        }
        else if(!gameControl.roundStarted())
            cpuMove();
    }

    /////////////////////////^ TOTAL CODE MESS v//////////////////////////

    document.querySelectorAll(".name-input-field").forEach((e) => e.addEventListener("input", (evt) => {
        
        target = evt.target;

        if(target.value.length > 12)
            target.value = target.value.slice(0, -1);
        else if(target.value.length > 0) {
            let lastChar = target.value.at(-1);
            if(!lastChar.match(/[0-9a-z]/i))
                target.value = target.value.slice(0, -1);
        }

    }));

    p1NameBtn.addEventListener("click", changePlayerName);
    p2NameBtn.addEventListener("click", changePlayerName);

    gameControl.setPlayer1Name(p1Name.innerText);
    gameControl.setPlayer2Name(p2Name.innerText);

    writeToDisplay("", gameControl.getCurrentPlayerName());

    startBtn.addEventListener("click", startNewRound);
    resetBtn.addEventListener("click", reset);

    gameBoardEl.addEventListener("mouseenter", () => {showCursor();});
    gameBoardEl.addEventListener("mouseleave", () => {hideCursor()});
    body.addEventListener("mousemove", (evt) => {
        cursors = document.querySelectorAll(".cursor-img");
        let w = parseFloat(cursors[0].getAttribute("width"));
        cursors.forEach((c) => {c.style.left = evt.x - w/2});
        cursors.forEach((c) => {c.style.top = evt.y - w/2});
        //showCursor();
    });

    document.querySelectorAll(".dim-btn").forEach((btn) => {
        btn.addEventListener("click", (evt) => {
            if(!gameControl.roundStarted()) {
                let dim = parseInt(evt.target.getAttribute("dim"));
                changeDimension(dim);
            }
        });
    });

    document.querySelectorAll(".player-btn").forEach((e) => {
        e.addEventListener("click", (evt) => {
            if(!gameControl.gameStarted()) {
                let dialog = document.querySelector(".type-player-dialog");
                dialog.setAttribute(evt.target.id.includes("p1") ? "p1" : "p2", "");
                dialog.removeAttribute(evt.target.id.includes("p1") ? "p2" : "p1", "");
                document.querySelector(".type-player-dialog").showModal();
            }
        })
    });

    document.querySelectorAll(".type-player-opt").forEach((e) => {
        e.addEventListener("click", (evt) => {
            let ptype = evt.target.getAttribute("ptype");
            let dialog = document.querySelector(".type-player-dialog");
            changePlayerType(ptype, dialog.hasAttribute("p1"));
            dialog.close();
        })
    });

    document.querySelector(".tpd-cancel-btn").addEventListener("click", () => {
        document.querySelector(".type-player-dialog").close();
    });

    return {

        start

    }

})();

gameInterface.start();
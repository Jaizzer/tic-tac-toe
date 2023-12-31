// Hide opening section and popup lobby section when play button is pressed.
const playButton = document.querySelector("button.play");
playButton.addEventListener("click", function() {

    // Hide the opening section.
    const opening = document.querySelector(".opening");
    opening.classList.remove("visible");
    opening.classList.add("hidden");

    // Popup the lobby section.
    const lobby = document.querySelector(".lobby");
    lobby.classList.remove("hidden");
    lobby.classList.add("visible");
});

// Access the form.
const form = document.querySelector("form");
form.addEventListener('submit', function (event) {

    // Prevent form submission until user's inputs are validated.
    event.preventDefault();

    // Get player's name.
    const player1Name = form.querySelector("#player-1-name").value;
    const player2Name = form.querySelector("#player-2-name").value;
    
    // Get player's selected symbols.
    const player1Symbol = form.querySelector("#player-1-symbol").value;
    const player2Symbol = form.querySelector("#player-2-symbol").value;

    // Input validation.
    if (/^[0-9]/.test(player1Name) && /^[0-9]/.test(player2Name)) {

        // Alert if both Player 1 and Player 2 names start with a number.
        alert("Both player names cannot start with a number.");
    } 
    else if (!/^[a-zA-Z]/.test(player1Name)) {

        // Alert if Player 1 name doesn't start with a letter.
        alert("Player 1 name must start with a letter.");
    } 
    else if (!/^[a-zA-Z]/.test(player2Name)) {

        // Alert if Player 2 name doesn't start with a letter.
        alert("Player 2 name must start with a letter.");
    } 
    else if (player1Name === player2Name && player1Symbol === player2Symbol) {

        // Alert if both player names and symbols are the same.
        alert("You must use different names and symbols");
    } 
    else if (player1Symbol === player2Symbol) {

        // Alert if both player symbols are the same.
        alert("You must use different symbols");
    } 
    else if (player1Name === player2Name) {

        // Alert if both player names are the same.
        alert("You must use different names");
    }
    else {
        // Hide lobby and popup the play-area.
        document.querySelector(".lobby").className = "lobby hidden";
        document.querySelector(".play-area").className = "play-area visible";

        // Player factory function.
        function Player(playerName, playerSymbol) {
            
            // Set player's name and symbol.
            const name = playerName;
            const symbol = playerSymbol;  

            // Return player's name.
            const getName = () => name;
            
            // Rerturn player's symbol.
            const getSymbol = () => symbol;

            // Return player object.
            return { getName, getSymbol }
        }

        // Create player 1 and player 2 object.
        const player1 = Player(player1Name, player1Symbol);
        const player2 = Player(player2Name, player2Symbol);

        // Start game. 
        startGame(player1, player2);
    }
});

// Start game.
function startGame(player1, player2) {

    // Create game board object.
    const gameBoard = (()=> {

        // Board array.
        let board = [['', '', ''],
                     ['', '', ''],
                     ['', '', '']];

        // Index of recently modified cell.
        let recentlyModifiedCellIndex = {row: "", column: ""};
                
        // Update board method.
        const update = ([row, column], symbol) => {
            board[row][column] = symbol;
            recentlyModifiedCellIndex.row = row;
            recentlyModifiedCellIndex.column = column
        };

         // Reset board method.
         const reset = () => {
            board = [['', '', ''],
                     ['', '', ''],
                     ['', '', '']];
        };

        // Check game status, wheter game is ongoing, or game is over: tie or win.
        const getGameStatus = () => {

            let col = recentlyModifiedCellIndex.column;
            let row = recentlyModifiedCellIndex.row;

            // Traverse horizontally
            if (board[row][col] === board[row][0] && board[row][col] === board[row][1] && board[row][col] === board[row][2]) {
                return "win";
            }
            
            // Traverse vertically
            if (board[row][col] === board[0][col] && board[row][col] === board[1][col] && board[row][col] === board[2][col]) {
                return "win";
            }

            // Traverse diagonally (Upper left to Bottom Right)
            if (row === col) {
                if (board[row][col] === board[0][0] && board[row][col] === board[1][1] && board[row][col] === board[2][2]) {
                    return "win";
                }
            }

            // Traverse diagonally (Lower Left to Upper Right)
            if ((row === '1' && col === '1') || (row === '0' && col === '2') || (row === '2' && col === '0')) {
                if (board[row][col] === board[0][2] && board[row][col] === board[1][1] && board[row][col] === board[2][0]) {
                    return "win";
                }
            }

            // Return 'tie' if there is no empty cell but no consecutive symbol found.
            if (!board.some(boardRow => boardRow.includes(''))) {
                return "Tie";
            }

            // If there are still empty cell and no consecutive cell found, then game is not yet over.
            return "Ongoing";
        
        };

        return { update, reset, getGameStatus };

    })();


    // Create flow control object to control turns between players.
    const flowControl = (() => { 

        // Initialize Player variables.
        let currentTurnPlayer;
        let nextTurnPlayer;
        
        // Set the players, first paremeter would be the first input would be the first turn holder.
        const setPlayers = (player1, player2) => {
            currentTurnPlayer = player1;
            nextTurnPlayer = player2;
        };

        // Switch the turns between the players.
        const switchTurn = () => {
            let temp = currentTurnPlayer;
            currentTurnPlayer = nextTurnPlayer;
            nextTurnPlayer = temp;
        };

        // Return the current turn player.
        const getCurrentTurnPlayer = () => {
            return currentTurnPlayer;
        }

        // Return the next turn player.
        const getNextTurnPlayer = () => {
            return nextTurnPlayer;
        };

        // Return flow control object.
        return { setPlayers, switchTurn, getCurrentTurnPlayer, getNextTurnPlayer };
        
    })();

    // Set the players.
    flowControl.setPlayers(player1, player2);

    // Create the gameboard UI.
    const renderBoard = ( () => {
        // Temporary variable for created grid cell.
        let cell;

        // Create 3x3 'clickable' grid cells for the gameboard.
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {

                // Create the cell
                cell = document.createElement(`div`);
                cell.classList.add('cell');
                cell.id = `${i}-${j}`;
                cell.addEventListener("click", executeMove)
                
                // Append the cell to the board.
                document.querySelector('.board').appendChild(cell);
            }
        }

        // Execute move function definition.
        function executeMove() {

            // Check if current cell is empty before making move.
            if (this.textContent === "") {
                // Update game board at current cell location and current player's symbol.
                gameBoard.update(this.id.split('-'), flowControl.getCurrentTurnPlayer().getSymbol());

                // Update cell in DOM.
                this.textContent = flowControl.getCurrentTurnPlayer().getSymbol();

                // Check if the game is over.
                if (gameBoard.getGameStatus() !== "Ongoing") {

                    // Display the winner if someone won.
                    if (gameBoard.getGameStatus() === "win") {
                        // Add 1 second delay before displaying result.
                        setTimeout( function () {
                            alert(`${flowControl.getCurrentTurnPlayer().getName()} Won!`)
                        }, 100);

                        // Restart game briefly after displaying the result.
                        setTimeout(restart, 120)
                    }
                    // If no one won, display "Tie".
                    else {
                        // Add 1 second delay before displaying result.
                        setTimeout( function () {
                            alert(`Tie`)
                        }, 100);

                        // Restart game briefly after displaying the result.
                        setTimeout(restart, 120)
                    }
                }
                // If the game is not over  yet, switch the player's turns.
                else {
                    flowControl.switchTurn();

                    // Set current turn player to 'active' state in player-list section in DOM.
                    document.querySelector(`#${flowControl.getCurrentTurnPlayer().getName()}`).className = "player-status active"

                    // Set next turn player to 'idle' state in player-list section in DOM.
                    document.querySelector(`#${flowControl.getNextTurnPlayer().getName()}`).className = "player-status idle"
                }
            }
            // If cell is empty prevent player from making his/her move there.
            else {
                alert("Cell is already taken. Choose an empty one.")
            }
        };
    })();

    // Restart function.
    const restart = () => {
        // Clear gameboard.
        gameBoard.reset();

        // Reset player's initial turns
        flowControl.setPlayers(player1, player2);

        // Set current turn player to 'active' state in player-list section in DOM.
        document.querySelector(`#${flowControl.getCurrentTurnPlayer().getName()}`).className = "player-status active"

        // Set next turn player to 'idle' state in player-list section in DOM.
        document.querySelector(`#${flowControl.getNextTurnPlayer().getName()}`).className = "player-status idle"

        // Empty all cells in DOM.
        let cells = document.querySelectorAll(".cell");
        cells.forEach(cell => cell.textContent = "");
    }

    // Create restart button.
    const restartButton = document.createElement("button");
    restartButton.id = "restart"
    restartButton.textContent = "Restart";

    // Add restart feature to restart button.
    restartButton.addEventListener("click", restart);

    // Append restart button to the DOM.
    document.querySelector(".actions").appendChild(restartButton);


    // Create 'New Game' button.
    const newGameButton = document.createElement("button");
    newGameButton.id = "new-game";
    newGameButton.textContent = "New Game";

    // Add feature to new-game button.
    newGameButton.addEventListener("click", function() {

        // Hide the play-area section.
        document.querySelector(".play-area").className = "play-area hidden";
        
        // Popup the lobby back.
        document.querySelector(".lobby").className = "lobby visible";


        // Cleanup previous play area for next game.

        // Delete previous board.
        const board = document.querySelector(".board");
        while (board.firstChild) {
            board.removeChild(board.firstChild);
        }

        // Delete all action buttons.
        const actions = document.querySelector(".actions");
        while (actions.firstChild) {
            actions.removeChild(actions.firstChild);
        }
    })

    // Append "New Game" button to the actions section in DOM.
    document.querySelector(".actions").appendChild(newGameButton);


    // Create contents of player list.
    document.querySelector(".player-list").innerHTML = `<div class="player-status active" id="${player1.getName()}">
                                                            <div class="player-symbol">${player1.getSymbol()}</div>
                                                            <div class="player-name">${player1.getName()}</div>
                                                        </div>
                                                        <div class="player-status idle" id="${player2.getName()}">
                                                            <div class="player-symbol">${player2.getSymbol()}</div>
                                                            <div class="player-name">${player2.getName()}</div>
                                                        </div`;
}
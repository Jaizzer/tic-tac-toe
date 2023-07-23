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

    // Alert if player symbol are the same.
    if (player1Name === player2Name && player1Symbol === player2Symbol) {
        alert("You must use different names and symbols");
    }
    else if (player1Symbol === player2Symbol) {
        alert("You must use different symbols");
    }
    else if (player1Name === player2Name) {
        alert("You must use different names");
    }
    else {
        // Hide lobby and popup the play-area.
        document.querySelector(".lobby").className = "lobby hidden";
        document.querySelector(".play-area").className = "play-area visible";

        // Start game. 
        startGame();
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
            if ((row === 1 && col === 1) || (row === 0 && col === 2) || (row === 2 && col === 0)) {
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
}
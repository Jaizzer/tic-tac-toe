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
function startGame() {

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

        return { update, reset };

    })();
}
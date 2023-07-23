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
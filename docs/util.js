// firebase cannot detect changes that occur when updating the parent node so i have to do this
let manualUpdate = () => {
    if (gameState.users && gameState.users.team1) {
        document.getElementById("users1") = Object.values(gameState.users.team1).map((user) => {`<li>${user.username}</li>`});
    }
    if (gameState.words && gameState.words.words1) {
        document.getElementById("words1") = Object.values(gameState.words.team1).map((word) => {`<li>${word}</li>`});
    }
    if (gameState.users && gameState.users.team2) {
        document.getElementById("users2") = Object.values(gameState.users.team2).map((user) => {`<li>${user.username}</li>`});
    }
    if (gameState.words && gameState.words.team2) {
        document.getElementById("words2") = Object.values(gameState.words.team2).map((word) => {`<li>${word}</li>`});
    }
}
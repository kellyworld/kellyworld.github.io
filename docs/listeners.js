firebase.database().ref('/games/current_game/users/team1').on("child_added", (snapshot) => {
    let data = snapshot.val();
    let $newItem = document.createElement("li");
    $newItem.innerText = `${data.username}`;
    $newItem.classList.add("user");
    $newItem.id = data.id;
    document.getElementById("users1").appendChild($newItem);
});

firebase.database().ref('/games/current_game/users/team2').on("child_added", (snapshot) => {
    let data = snapshot.val();
    let $newItem = document.createElement("li");
    $newItem.innerText = `${data.username}`;
    $newItem.classList.add("user");
    $newItem.id = data.id;
    document.getElementById("users2").appendChild($newItem);
});

firebase.database().ref('/games/current_game/users/team2').on("child_removed", (snapshot) => {
    let data = snapshot.val();
    let $newItem = document.getElementById(data.id);
    $newItem.parentNode.removeChild($newItem);
});

firebase.database().ref('/games/current_game/users/team1').on("child_removed", (snapshot) => {
    let data = snapshot.val();
    let $newItem = document.getElementById(data.id);
    $newItem.parentNode.removeChild($newItem);
});

firebase.database().ref('/games/current_game/words/team1').on("child_added", (snapshot) => {
    let data = snapshot.val();
    let $newItem = document.createElement("li");
    $newItem.innerText = data;
    $newItem.classList.add("word");
    document.getElementById("words1").appendChild($newItem);
});

firebase.database().ref('/games/current_game/words/team2').on("child_added", (snapshot) => {
    let data = snapshot.val();
    let $newItem = document.createElement("li");
    $newItem.innerText = data;
    $newItem.classList.add("word");
    document.getElementById("words2").appendChild($newItem);
});


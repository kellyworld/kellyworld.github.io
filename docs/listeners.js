

firebase.database().ref('current_game/users/team2').on("child_added", (snapshot) => {
    let data = snapshot.val();
    let $newItem = document.createElement("div");
    $newItem.innerText = `${data.username}`;
    $newItem.classList.add("user");
    document.getElementById("users2").appendChild($newItem);
});

firebase.database().ref('current_game/users/team1').on("child_added", (snapshot) => {
    let data = snapshot.val();
    let $newItem = document.createElement("div");
    $newItem.innerText = `${data.username}`;
    $newItem.classList.add("user");
    document.getElementById("users1").appendChild($newItem);
});


// sample api request
// document.getElementById("getJoke").addEventListener('click', function(){
//     fetch("https://api.nasa.gov/insight_weather/?api_key=073ZmaEnXW2sXjxLxvovaM5WarZuSQ5iz9mhgAgO&feedtype=json&ver=1.0",
//           {method: "GET"})
//          .then(response => response.json())
//          .then(data => showWeather(data)); 
//    });

// use this if you need to delete stuff 
// firebase.database().ref('users/1602389425974/id').remove(); 

// how to write to specific children of a node without overwriting other child nodes
// function writeNewPost(uid, username, picture, title, body) {
//     // A post entry.
//     var postData = {
//       author: username,
//       uid: uid,
//       body: body,
//       title: title,
//       starCount: 0,
//       authorPic: picture
//     };
  
//     // Get a key for a new Post.
//     var newPostKey = firebase.database().ref().child('posts').push().key;
  
//     // Write the new post's data simultaneously in the posts list and the user's post list.
//     var updates = {};
//     updates['/posts/' + newPostKey] = postData;
//     updates['/user-posts/' + uid + '/' + newPostKey] = postData;
  
//     return firebase.database().ref().update(updates);
//   }
  

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCcespW_NRWe42xNVIz_g8Y0Bs682pbNVY",
    authDomain: "spellinghive-9b3c7.firebaseapp.com",
    databaseURL: "https://spellinghive-9b3c7.firebaseio.com",
    projectId: "spellinghive-9b3c7",
    storageBucket: "spellinghive-9b3c7.appspot.com",
    messagingSenderId: "887217083121",
    appId: "1:887217083121:web:81e0a8f2096c593d594f50"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// change this later to update live
let gameState = {};
firebase.database().ref('games/current_game').once('value').then((snapshot) => gameState = snapshot.val());
firebase.database().ref('games').on("child_changed", (snapshot) => {
    gameState = snapshot.val();
    console.log(gameState);
    initializeLetters(gameState.centerLetter, gameState.pangram);
});
let user = {};
let team = 0;
let letters = "";
// lookup/init user
let userid = localStorage.getItem("spellinghive_id");

// set user id in local storage if not found
if (!userid){
    let a = new Date();
    userid = a.getTime();
    localStorage.setItem("spellinghive_id", userid);
}

let login = () => {
    document.getElementById("loading").style.display = "none";
    document.getElementById("login").style.display = "block";
    if (user.username) { // pre existing user
        document.getElementById("olduser").style.display = "block";
        document.getElementById("olduser").innerHTML = `Welcome ${user.username}!`;
    } else {
        document.getElementById("newuser").style.display = "inline-block";
    }
}

let initializeUser = (userid) => {
    user.id = userid;
    return firebase.database().ref('/users/' + userid).once('value').then((snapshot) => {
        user.username = snapshot.val().username;
        user.highscore = snapshot.val().highscore;
        login();
    });
}

let addUser = (name, id) => {
    console.log(id);
    firebase.database().ref('users/' + id).set({
        username: name,
        id: id,
        highscore: 0
      })
      .then(initializeUser(userid));
}

//idk maybe do this later
let loadPreview = async () => {}

let joinGame = (user) => {
    var updates = {};
    updates[`/users/team${team}/${user.id}`] = user;
    console.log("whwejtsdfgsdg");
    firebase.database().ref('games/current_game').update(updates);
}

let enterGame = () => {
    // if user does not already exist add to database
    if (!user.username){
        let username = document.getElementById("username").value;
        addUser(username, userid);
    }

    document.getElementById("you").style.display = "block";

    // check if game in session
    if (!gameState) {
        //start a game
        console.log("no game");
        startGame();
    }
    team = document.querySelector('input[name="team"]:checked').value;
    joinGame(user, team);
    document.getElementById("login").style.display = "none";
}

// update game state on change
firebase.database().ref('games').on('child_changed', () => {
    // update game state
});

// returns point value of word submission
let submitWord = (word) => {
    // check valid (> 3 letters, < 15)
    if (word.length < 4) {
        return displayWordError("Word too short");
    } else if (word.length > 14) {
        return displayWordError("Word too long");
    }
    checkAnagram(word);
    // check if already submitted

    // push to database if valid
}

let displayWordError = (error) => {
    // temporarily shows error if word is invalid
    alert(error); //do something less shitty later
}

// HELPER function to check if a word is an anagram of the pangram
let checkAnagram = (word) => {
    isAnagram
    // for (word of hivewords){
    //     let isAnagram = true;
    //     for (letter of word){
    //         if (!letters.includes(letter)){
    //             isAnagram = false;
    //         }
    //     }
    //     if (isAnagram) {
    //         anagrams.push(word);
    //     }
    // }
}

/* return score for a word
* Each four-letter word found is worth one point. 
* Longer words are scored according to their length, 
* with five-letter words worth five points, six-letters words worth six points, and so on.
* If a word is a pangram, it's worth its length plus a bonus of seven points. 
* For instance, the pangram "whippoorwill" is twelve letters in length, which makes it worth 19 points.
*/
let getPoints = (word) => {

    if (word.length == 4) {
        return 1;
    } else {

    }
}

// function should set the current game in the database
let startGame = () => {
    let t = new Date();
    let game = {
            time: t.getTime(), 
        };
    let pangramNum = Math.floor(Math.random() * 37753);
    firebase.database().ref('pangrams/pangram_list/' + pangramNum).once('value')
        .then((snapshot) => {game.pangram = snapshot.val();
            game.centerLetter = game.pangram[Math.floor(Math.random() * game.pangram.length)];
            firebase.database().ref('games/current_game').update(game);
        });
}


let getUniqueLetters = (word) => {
    let letterSet = new Set();
    for (var i = 0; i < word.length; i++){
        letterSet.add(word[i]);
    }
    return [...letterSet];
}

let initializeLetters = (centerLetter, pangram) => {
    let panLetters = getUniqueLetters(pangram);
    let tempLetters = [];
    for(var i = 0; i < panLetters.length; i++) {
        if (panLetters[i] == centerLetter){
            // pass
        } else {
            tempLetters.push(panLetters[i]);
        }
    }
    tempLetters.push(centerLetter);
    letters = tempLetters;
    shuffleLetters();
}

let shuffleLetters = () => {
    shuffle(letters);
    const letterSlots = document.getElementById("letters").children;
    for (var i = 0; i < 7; i++){
        letterSlots[i].innerHTML = letters[i];
    }
}


//shuffles all EXCEPT LAST LETTER IN ARRAY (center letter)
let shuffle = (letters) => {
    let counter = letters.length - 1;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = letters[counter];
        letters[counter] = letters[index];
        letters[index] = temp;
    }

    return letters;
}

window.onload = () => {
    
    firebase.database().ref('hivewords').once('value').then((snapshot) => {hivewords = snapshot.val()});
    
    // it tries to look up and initialize the user upon load based on id. 
    // if it can't the user object will be empty except id
    initializeUser(userid);
    shuffleLetters();

    document.getElementById("buzzin").addEventListener("click", () => {
        enterGame(); 
    });

    document.getElementById("howto-toggle").addEventListener("click", () => {
        if (document.getElementById("howto").style.display === "block"){
            document.getElementById("howto").style.display = "none";
        } else {
            document.getElementById("howto").style.display = "block";
        }
    });

    document.getElementById("shuffle").addEventListener("click", shuffleLetters);

    document.addEventListener('keyup', event => {
        if (event.code === 'Space') {
          shuffleLetters();
        }
      });

    document.addEventListener('keyup', event => {
    if (event.code === 'Enter') {
        submitWord();
    }
    })
          
};
window.addEventListener('beforeunload', (e) => {
    firebase.database().ref(`/games/current_game/users/team${team}/${userid}`).remove();
});

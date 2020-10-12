
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

let gameState = {};
firebase.database().ref('games/current_game').once('value').then((snapshot) => {
    gameState = snapshot.val();
    updateScore();
});

// update game state
firebase.database().ref('games').on("child_changed", (snapshot) => {
    gameState = snapshot.val();
    initializeLetters(gameState.centerLetter, gameState.pangram);
    updateScore();
});

let user = {};
let team = 0;
let letters = "";

// lookup user

let userid = localStorage.getItem("spellinghive_id");

// set user id in local storage if not found
if (!userid){
    let a = new Date();
    userid = a.getTime();
    localStorage.setItem("spellinghive_id", userid);
}

let updateScore = () => {
    let team1Score = 0;
    let team2Score = 0;
    if (gameState.words && gameState.words.team1) {
        const words = Object.values(gameState.words.team1);
        team1Score = words.reduce((acc, curr) => {
            return acc + getPoints(curr);
        }, getPoints(words[0]));
    } 
    if (gameState.words && gameState.words.team2) {
        const words = Object.values(gameState.words.team2);
        team2Score = words.reduce((acc, curr) => {
            return acc + getPoints(curr);
        }, getPoints(words[0]));
    }
    document.getElementById("team1_score").innerHTML = "Score: " + team1Score;
    document.getElementById("team2_score").innerHTML = "Score: " + team2Score;
}

// removes relevant elements. misleading name
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

let resetTeams = () => {
    document.getElementById("users1").innerHTML = "";
    document.getElementById("users2").innerHTML = "";
    document.getElementById("words1").innerHTML = "";
    document.getElementById("words2").innerHTML = "";
}

let updateTime = () => {
    var date = new Date(); 
    
    var timeDiff = date.getTime() - gameState.time;

    var min = Math.floor(timeDiff/120000); 
    timeDiff -= min*120000;
    
    var sec = Math.floor(timeDiff/2000);
    if (sec < 10) {
        sec = "0" + sec;
    }
    document.getElementById("timer").innerHTML = `Time elapsed: ${min}:${sec}`;

    if (min >= 2) {
        gameEnd();
    }

    var t = setTimeout(function(){ updateTime() }, 1000); // update every second
}

let gameEnd = () => {
    let winner = (document.getElementById("team1_score").innerText > document.getElementById("team2_score").innerText) ? "Team 1" : "Team 2"
    alert(`Round over. The winner is ${winner}`);
    // only update game if you are the oldest user playing lol
    let oldest = true;
    let userlist = [];
    if (gameState.users && gameState.users.team1) {
        userlist += gameState.users.team1;
    }
    if (gameState.users && gameState.users.team2) {
        userlist += gameState.users.team2;
    }
    for (u of userlist) {
        if (u.id > user.id) {
            oldest = false;
        }
    }

    // i have to reset the word and user lists here bc child_removed is not working for when you update the entire parent node
    resetTeams();

    if (oldest) {
        startGame();
        joinGame(user);
    }
}

let initializeUser = (userid) => {
    user.id = userid;
    return firebase.database().ref('/users/' + userid).once('value').then((snapshot) => {
        if (snapshot.val()) {
            user.username = snapshot.val().username;
            user.highscore = snapshot.val().highscore;
        }
        login();
    });
}

let addUser = (name, id) => {
    firebase.database().ref('users/' + id).set({
        username: name,
        id: id,
        highscore: 0
      })
      .then(initializeUser(userid));
}

//TODO: currently before joining a game a bunch of stuff is undefined and it's generally just fugly
let loadPreview = async () => {}

let joinGame = (user) => {
    var updates = {};
    updates[`/users/team${team}/${user.id}`] = user;
    firebase.database().ref('games/current_game').update(updates);
}

let enterGame = () => {
    try {
        team = document.querySelector('input[name="team"]:checked').value;
    } catch (e) {
        alert("please select a team");
        return;
    }
    // if user does not already exist add to database
    if (!user.username){
        let username = document.getElementById("username").value;
        addUser(username, userid);
    }

    document.getElementById("you").style.display = "block";

    // check if game in session
    if (!gameState) {
        //start a game
        startGame();
    }
    joinGame(user, team);
    document.getElementById("login").style.display = "none";
    
}

// returns point value of word submission
let submitWord = (word) => {
    // check valid (> 3 letters, < 15)
    if (word.length < 4) {
        displayWordError("Word too short");
    } else if (word.length > 14) {
        displayWordError("Word too long");
    } else if (!word.includes(gameState.centerLetter)) {
        displayWordError("Word does not contain center letter");
    } else if (!isAnagram(word, gameState.pangram)){
        displayWordError("Letters not in pangram");
    } else if (gameState.words && gameState.words.team1 && Object.values(gameState.words.team1).includes(word)) {
        displayWordError("Team 1 already has this word!");
    } else if (gameState.words && gameState.words.team2 && Object.values(gameState.words.team2).includes(word)) {
        displayWordError("Team 2 already has this word!");
    } else {
        firebase.database().ref('hivedictionary/' + word).once('value').then((snapshot) => {
            if (snapshot.val()) {
                let newWordKey = firebase.database().ref(`games/current_game/words/team${team}`).push().key;
                let update = {};
                update[`games/current_game/words/team${team}/${newWordKey}`] = word;
                firebase.database().ref().update(update);
                return getPoints(word);
            } else {
                displayWordError("Not a valid dictionary word!");
            }
        });
    }
    
    // clear input
    document.getElementById("tryword").value = "";
    return 0;
}

let displayWordError = (error) => {
    // temporarily shows error if word is invalid
    alert(error); //TODO: do something less ugly here
}

// HELPER function to check if a word can be made from the pangram
// i know this isnt literally what an anagram is but idfl changing it
let isAnagram = (word, pangram) => {
    for (letter of word) {
        if (!pangram.includes(letter)) {
            return false;
        }
    }
    return true;
}

// checks if word is a true anagram of pangram
let isTrueAnagram = (word, pangram) => {
    for (letter of pangram) {
        if (!word.includes(letter)) {
            return false;
        }
    }
    return isAnagram(word, pangram);
}

/* return score for a word
* Each four-letter word found is worth one point. 
* Longer words are scored according to their length, 
* with five-letter words worth five points, six-letters words worth six points, and so on.
* If a word is a pangram, it's worth its length plus a bonus of seven points. 
* For instance, the pangram "whippoorwill" is twelve letters in length, which makes it worth 19 points.
* Pretty sure this is broken somehow but whatever
*/
let getPoints = (word) => {
    if (word.length == 4) {
        return 1;
    } else {
        if (isTrueAnagram(word, gameState.pangram)) {
            return word.length + 7;
        } else {
            return word.length;
        }
    }
}

// function should set the current game in the database
let startGame = () => {
    let t = new Date();
    let game = {
            time: t.getTime(), 
            words: null
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
    // TODO: for some reason it shuffles every time you enter a word 
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
    
    // firebase.database().ref('hivewords').once('value').then((snapshot) => {hivewords = snapshot.val()});
    
    // it tries to look up and initialize the user upon load based on id. 
    // if it can't the user object will be empty except id
    initializeUser(userid);
    shuffleLetters();

    document.getElementById("buzzin").addEventListener("click", () => {
        enterGame(); 
    });

    document.getElementById("try").addEventListener("click", () => {
        const word = document.getElementById("tryword").value;
        submitWord(word); 
    });

    document.getElementById("howto-toggle").addEventListener("click", () => {
        if (document.getElementById("howto").style.display === "block"){
            document.getElementById("howto").style.display = "none";
        } else {
            document.getElementById("howto").style.display = "block";
        }
    });

    document.getElementById("shuffle").addEventListener("click", shuffleLetters);

    document.addEventListener('keyup', (event) => {
        if (event.code === 'Space') {
          shuffleLetters();
        }
      });

    document.getElementById("tryword").addEventListener('keyup', (event) => {
        if (event.code === 'Enter') {
            const word = document.getElementById("tryword").value;
            submitWord(word); 
        }
    });

    updateTime();
          
};
window.addEventListener('beforeunload', (e) => {
    firebase.database().ref(`/games/current_game/users/team${team}/${userid}`).remove();
});

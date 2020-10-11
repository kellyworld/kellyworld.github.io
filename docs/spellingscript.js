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
let user = {
    id: localStorage.getItem("spellinghive_id"),
    username: ""
};

let gameState = firebase.database().ref('current_game').once('value').then((snapshot) => snapshot.val());
let pangram = (gameState.id == undefined) ? "default" : gameState.pangram;
let anagrams = (gameState.id == undefined) ? {team1: [], team2: []} : gameState.words;
let centerLetter = (gameState.id == undefined) ? "" : gameState.center_letter;
let letters = (gameState.id == undefined) ? ["d", "e", "f", "a", "u", "l", "t"] : initializeLetters(centerLetter, gameState.pangram); // the center letter will always be the 7th slot 

let enterGame = () => {
    // check if user is existing
    // else add user to database

    // check if game in session
    // if yes join selected team

    // else start a game
}

// set user id in local storage
if (!user){
    let a = new Date();
    let userid = a.getTime();
    localStorage.setItem("spellinghive_id", userid);
}

// use this if you need to delete stuff 
// firebase.database().ref('/words').remove(); 

// this doesnt fucking work yet 
let addUser = () => {
    return firebase.database().ref('spelling').once('value').then(function(snapshot) {
        console.log(snapshot.val().users);
      });
}

// update game state on change
firebase.database().ref('current_game').on('child_changed', () => {
    // update game state
});

// returns point value of word submission
let submitWord = (word) => {
    // check valid (> 3 letters, < 15)
    checkAnagram(word);
    // check if already submitted

}

// HELPER function to check if a word is an anagram of the pangram
let checkAnagram = (word) => {
    // REDO THIS SO IT USES AN API ENDPOINT
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

// calculate number of points for a word
/* Each four-letter word found is worth one point. 
* Longer words are scored according to their length, 
* with five-letter words worth five points, six-letters words worth six points, and so on.
* If a word is a pangram, it's worth its length plus a bonus of seven points. 
* For instance, the pangram "whippoorwill" is twelve letters in length, which makes it worth 19 points.
*/

let getPoints = () => {
    return 0;
}

// function should set the current game in the database
let startGame = () => {
    let time = new Date();
    let game = {
        id: time.getTime(), 
        users: {
            team1: [],
            team2: []
        },
        pangram: "",
        words: {
            team1: [],
            team2: []
        }
    }
}

let getUniqueLetters = (word) => {
    let letterSet = new Set();
    for (var i = 0; i < word.length; i++){
        letterSet.add(word[i]);
    }
    return [...letterSet];
}

// these should be obsolete later... 
let initializeGame = (team) => {
    let pangramNum = 0;
    firebase.database().ref('pangrams/number_of_pangrams').once('value')
        .then((snapshot) => { 
            pangramNum = Math.floor(Math.random() * snapshot.val()); // pick a random pangram
        })
        .then(() => {
            firebase.database().ref('pangrams/pangram_list/' + pangramNum).once('value') //retrieve pangram
            .then((snapshot) => { pangram = snapshot.val(); console.log(snapshot.val())}) 
            .then( () => { initializeLetters(pangram) })});
    return pangram;
}

let initializeLetters = (centerLetter, pangram) => {
    let panLetters = getUniqueLetters(pangram);
    let tempLetters = [];
    for(var i = 0; i < panLetters.length; i++) {
        if (let == centerLetter){
            // pass
        } else {
            tempLetters.push(panLetters[i]);
        }
    }
    tempLetters.push(centerLetter);
    return tempLetters;
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
    
    shuffleLetters();

    document.getElementById("buzzin").addEventListener("click", () => {
        const name = document.getElementById("username").value;
        addUser();
        console.log(initializeGame(1));
        console.log(name);
    });

    document.getElementById("howto-toggle").addEventListener("click", () => {
        if (document.getElementById("howto").style.display === "block"){
            document.getElementById("howto").style.display = "none";
        } else {
            document.getElementById("howto").style.display = "block";
        }
    });

    document.getElementById("shuffle").addEventListener("click", shuffleLetters);
};
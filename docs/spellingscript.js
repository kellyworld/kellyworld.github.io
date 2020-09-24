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
let uuid = localStorage.getItem("spellinghive_id");

if (!uuid){
  uuid = `spellinghive_id-${Math.floor(1000000000*Math.random())}`;
  localStorage.setItem("uuid", uuid);
}

// idfk how to do anything with the database bc it wont let me fking look at it

let addUser = () => {
    return firebase.database().ref('spelling').once('value').then(function(snapshot) {
        console.log(snapshot.val().users);
      });
}


let scrabblewords = []; // all scrabble words
let hivewords = []; // all words valid for spelling hive
let hivedictionary = {} // all words valid for spelling hive, word: letters
let pangrams = [] // all pangrams 

let success = (data) => {
    scrabblewords = data.split(/\r?\n|\r/); // regex splits data into rows
    hivewords = scrabblewords.filter((word) => {
        let letters = Set();
        for (letter of word) {
            letters.add(letter);
        }
        if (letters.size <= 7 && word.length > 3 && word.length < 15) {
            return 1;
        } else {
            return 0;
        }
    });
    hivedictionary = Object.fromEntries(hivewords.map((word) => {
        let letters = Set();
        for (letter of word) {
            letters.add(letter);
        }
        return [word, [...letters]];
    }));
    pangrams = scrabblewords.filter((word) => {
        return hivedictionary[word].length == 7;
    })
}

let getAnagrams = (pangram) => {
    let anagrams = [];
    const pangramLetters = hivedictionary[pangram];
    for (word of hivewords){
        let isAnagram = true;
        for (letter of word){
            if (!pangramLetters.includes(letter)){
                isAnagram = false;
            }
        }
        if (isAnagram) {
            anagrams.push(word);
        }
    }
    return anagrams;
}

let initializeGame = (team) => {
    const pangram = pangrams[(Math.floor(Math.random()*pangrams.length))];
    let letters = document.getElementById("letters").children;
    for (var i = 0; i < 7; i++){
        //letters[i].innerHTML = hivedictionary[pangram][i];
    }
    return pangram;
}

window.onload = () => {

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
};
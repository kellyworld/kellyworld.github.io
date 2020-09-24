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
firebase.database().ref('/words').remove();
let addUser = () => {
    return firebase.database().ref('spelling').once('value').then(function(snapshot) {
        console.log(snapshot.val().users);
      });
}

let hivewords = [];
let pangram = "";
let anagrams = []
let letters = []; // the center letter will always be the 7th slot 
let userTeam = 0;
let centerLetter = "";

let findAnagrams = () => {
    for (word of hivewords){
        let isAnagram = true;
        for (letter of word){
            if (!letters.includes(letter)){
                isAnagram = false;
            }
        }
        if (isAnagram) {
            anagrams.push(word);
        }
    }
}

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
     // sorry for creating this disgusting promise chain
    return pangram;
}

let initializeLetters = (pangram) => {
    letterSet = new Set();
    for (var i = 0; i < pangram.length; i++){
        letterSet.add(pangram[i]);
    }
    letters = [...letterSet];
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

    document.getElementById("shuffle").addEventListener("click", () => {
        shuffleLetters();
    })
};
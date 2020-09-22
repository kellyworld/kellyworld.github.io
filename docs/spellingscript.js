
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
//   uuid = `spellinghive_id-${Math.floor(1000000000*Math.random())}`;
//   localStorage.setItem("uuid", uuid);
}

// firebase.database().ref("spellinghive").child("users")++;


window.onload = () => {
    document.getElementById("howto-toggle").addEventListener("click", () => {
        console.log(document.getElementById("howto").style.display);
        if (document.getElementById("howto").style.display === "block"){
            document.getElementById("howto").style.display = "none";
        } else {
            document.getElementById("howto").style.display = "block";
        }
    })
};
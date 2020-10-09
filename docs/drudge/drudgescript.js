// Initialize Firebase our database, you don't have to touch this part
var firebaseConfig = {
    apiKey: "AIzaSyBHcN0HVMwxxW-xBkXHYAm2X-kGWjxPzNk",
    authDomain: "basiccrud-ffe19.firebaseapp.com",
    databaseURL: "https://basiccrud-ffe19.firebaseio.com",
    projectId: "basiccrud-ffe19",
    storageBucket: "basiccrud-ffe19.appspot.com",
    messagingSenderId: "47974982638",
    appId: "1:47974982638:web:9a034202ca787ee47764ff"
};
firebase.initializeApp(firebaseConfig);
function getUniqueId() { //a silly function just to let you fork this codepen and have your own "database"
  return "bGpvPmL";
  var CODEPEN_ID = /[codepen|cdpn]\.io\/[^/]+\/(?:pen|debug|fullpage|fullembedgrid)\/([^?#]+)/;
  var id;
  if(CODEPEN_ID.test(window.location.href)) {
    id = CODEPEN_ID.exec(window.location.href)[1];
  } else if (CODEPEN_ID.test(document.location.href)){
    id = CODEPEN_ID.exec(window.location.href)[1];
  } else {
    var metas = document.getElementsByTagName('link');    
    for(i=0;i<metas.length;i++) {
      if(metas[i].getAttribute('rel') == 'canonical') {
        if(CODEPEN_ID.test(metas[i].getAttribute('href')))
        id = CODEPEN_ID.exec(metas[i].getAttribute('href'))[1];  
      }
    }
  }
  return id || `randoDB${Math.floor(Math.random()*10000000)}`;
}

//this is the "handler" for YOUR database where we can store and read values from anyone at your site!
let yourDatabase = firebase.database().ref("websec").child(getUniqueId());

yourDatabase.child("myarray").on("child_added", function(dataSnapShotHandler){
  let theData = dataSnapShotHandler.val();
  console.log(theData);
  let $newItem = document.createElement("div");
  $newItem.innerText = `${theData.title}`;
  $newItem.classList.add("newsitem");
  if(theData.important) {
    $newItem.classList.add("importantnews");
  }
  document.getElementById("newsfeed").appendChild($newItem);
});

document.getElementById("thebutton").addEventListener("click", function(){
  let articleTitle = document.getElementById("articletitle").value; //making a string of the input text
  let isImportant = document.getElementById("important").checked;
  let newClick = yourDatabase.child("myarray").push();
  console.log(articleTitle);
  newClick.set({title: articleTitle, important: isImportant});
});
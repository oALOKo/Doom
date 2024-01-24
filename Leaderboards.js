import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
import {
    getFirestore,
    collection,
    getDocs,
    serverTimestamp,
    addDoc,
    onSnapshot //addition of realtime listener
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

const firebaseConfig = {
  apiKey: "AIzaSyBg0ICpx0AXCWErHT5qHSrnFHfFRCvRUSM",
  authDomain: "retro-doom-4dc71.firebaseapp.com",
  projectId: "retro-doom-4dc71",
  storageBucket: "retro-doom-4dc71.appspot.com",
  messagingSenderId: "395511210552",
  appId: "1:395511210552:web:4366215ff4f72abf537ccd",
  measurementId: "G-PGBQZSL31E"
};

initializeApp(firebaseConfig);

//init services
const db = getFirestore(); //our database is stored here 

//specific collection reference
const colRef = collection(db,'Score');
let leaderboardData = [];

    // making leaderboard
    function Leaderboard() {
      const leaderboardBody = document.getElementById("leaderboardBody");

      // Clear existing rows
      leaderboardBody.innerHTML = "";

      for (let i = 0; i < leaderboardData.length; i++) {
        let row = leaderboardBody.insertRow(i);
        let rankCell = row.insertCell(0);
        let playerNameCell = row.insertCell(1);
        let scoreCell = row.insertCell(2);

        rankCell.textContent = leaderboardData[i].rank;
        playerNameCell.textContent = leaderboardData[i].name;
        scoreCell.textContent = leaderboardData[i].score;
      }
    }

    // let q = query(colRef,where("author","==","vin")); //so we are saving the scores in this 'q' variable
    //onSnapshot takes collection reference and a callback function which will activate everytime there is a change in the collection 'colRef'
    onSnapshot(colRef,(snapshot)=>{
        let scores = [];
        console.log(snapshot.docs)
        //we push the colledction data into out array everytime there is a change in a collection
        snapshot.docs.forEach((doc)=>{
            //we are basically pushing data in the form of object that consists the returned data and an extra id variable 
            scores.push({...doc.data()}) //.data() method returns the data in object form
        
          })

        //console.log("This is collection log : ",scores);
        scores.sort((a, b) => b.score - a.score);
        let i = 1;
        leaderboardData = []
        scores.forEach((obj)=>{
            leaderboardData.push({...obj,rank: i}) 
            i++;
        })
        console.log(leaderboardData);
        Leaderboard();
    })

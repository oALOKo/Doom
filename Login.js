import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'

import {
    getAuth,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,  
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'


import {
    collection,
    getFirestore,
    addDoc, 
    serverTimestamp ,
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
const auth = getAuth();
const db = getFirestore();
const colUsers= collection(db,'Users');
document.addEventListener("DOMContentLoaded", function () {
   
    document.getElementById("loginButton").addEventListener("click", login);
    document.getElementById("signupButton").addEventListener("click", signup);
  
});
  
    document.getElementById("signupLink").addEventListener("click", function () {
      toggleForm();
    });
    document.getElementById("loginLink").addEventListener("click", function () {
      toggleForm();
    });

  
  function login() {
    let loginEmail = document.getElementById("loginEmail").value;
    let loginPassword = document.getElementById("loginPassword").value;

    signInWithEmailAndPassword(auth,loginEmail,loginPassword)
    .then((cred)=>{
        console.log("User Logged In")
        const username = cred.user.displayName;
        const redirectTo = 'doom.html?username=' + encodeURIComponent(username);
        console.log(username)
        setTimeout(() => {
          window.location.replace(redirectTo); 
      },500);                 
    })   
    .catch((err)=>{
        console.log(err);
    })
  }
  
  function signup() {
    let signupUsername = document.getElementById("signupUsername").value;
    let signupEmail = document.getElementById("signupEmail").value;
    let signupPassword = document.getElementById("signupPassword").value;

    createUserWithEmailAndPassword(auth,signupEmail,signupPassword)
      .then((cred)=>{
          return updateProfile(cred.user, { displayName: signupUsername })
              .then(() => {
                  console.log('Username saved:', signupUsername);
                  alert("UserName Created.Go back to Login Page.");    
              })
              .catch((error) => {
                  console.error('Display name update error:', error.message);
              });
      })
      .then(() => {
          addDoc( colUsers,{
              Username:signupUsername,
              createdAt: serverTimestamp()
          })
          .catch((err)=>{
              console.log("Error : ",err);
          })
      })
      .catch((err)=>{
          console.log(err)
      })
  
  
  }

  function toggleForm() {
    document.getElementById("loginContainer").classList.toggle("hidden");
    document.getElementById("signupContainer").classList.toggle("hidden");
  }
  
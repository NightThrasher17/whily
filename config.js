import firebase from 'firebase' 
require('@firebase/firestore')  
// Your web app's Firebase configuration
  var firebaseConfig = {
   databaseURL:"https://willy-cc7e7.firebaseio.com",
    apiKey: "AIzaSyBe7h-hJbtGYhDdjOdw04O91QKsG3UnJfE",
    authDomain: "willy-cc7e7.firebaseapp.com",
    projectId: "willy-cc7e7",
    storageBucket: "willy-cc7e7.appspot.com",
    messagingSenderId: "997039419626",
    appId: "1:997039419626:web:ef060303d8205cd3832793"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()
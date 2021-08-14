import firebase from 'firebase';
require('@firebase/firestore');

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDf4S92OPzfzvQCUewu8G_Nt0bPRFovFao",
    authDomain: "willy-app-d0efe.firebaseapp.com",
    projectId: "willy-app-d0efe",
    storageBucket: "willy-app-d0efe.appspot.com",
    messagingSenderId: "373471931137",
    appId: "1:373471931137:web:26eb627cf22ec0f92b4900"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();
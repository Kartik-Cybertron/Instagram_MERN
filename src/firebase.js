// For Firebase JS SDK v7.20.0 and later, measurementId is optional
  import firebase from "firebase";
  
  // we also have to install firebase tools to improve productivity

  // init of firebase
  const firebaseapp =  firebase.initializeApp({
    apiKey: "AIzaSyCFLwchLYhbQhxKcWlLZozNXqu42ti80JU",
    authDomain: "instagram-clone-react-358.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-358.firebaseio.com",
    projectId: "instagram-clone-react-358",
    storageBucket: "instagram-clone-react-358.appspot.com",
    messagingSenderId: "33427066837",
    appId: "1:33427066837:web:a6b5e0e7b23745840a775c",
    measurementId: "G-PS7KX9V89N"
  });

  // const variables which will be linked to other files
  const db =  firebaseapp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

export { db, auth, storage };
import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDCH7Vc0Gd0gxYhmCrC-GklJGpt630Zkts",
    authDomain: "instagram-clone-b869c.firebaseapp.com",
    databaseURL: "https://instagram-clone-b869c.firebaseio.com",
    projectId: "instagram-clone-b869c",
    storageBucket: "instagram-clone-b869c.appspot.com",
    messagingSenderId: "1063259999473",
    appId: "1:1063259999473:web:89a597e1c94e496605ed50",
    measurementId: "G-27T0QXBZQ6"
})

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()


export { db, auth, storage }
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, onValue, set, get, remove } from 'firebase/database'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyATzOccNKD_YyFBWon3eFvttTBt43ou4j8",
    authDomain: "axolotl-marathon.firebaseapp.com",
    databaseURL: "https://axolotl-marathon-default-rtdb.firebaseio.com",
    projectId: "axolotl-marathon",
    storageBucket: "axolotl-marathon.appspot.com",
    messagingSenderId: "209634047948",
    appId: "1:209634047948:web:89d4bfc60ccfd2ff3fcf69"
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)
const auth = getAuth(app)

onAuthStateChanged(auth, (user) => {
if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log(uid)
    // ...
} else {
    // User is signed out
    // ...
    console.log("you are not logged in")
}
});

signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
    console.log(user)
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage)
  });


// new structure, this might be db, "user/uid/laps"
// const reference = ref(db, "laps")
// const totalRef = ref(db, "total")

const dateEl = document.getElementById("date-el")
const poolNameEl = document.getElementById("pool-name")
const lapEl = document.getElementById("lap-num")
const formEl = document.getElementById("form-el")
const totalEl = document.getElementById("total-el")

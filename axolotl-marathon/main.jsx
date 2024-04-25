import { initializeApp } from 'firebase/app'
import { getDatabase
    // , ref, push, onValue, set, get, remove 
} from 'firebase/database'
import { getAuth, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup } from "firebase/auth"

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
const provider = new GoogleAuthProvider

// const loginEl = document.getElementById("login-el")
const email = document.getElementById("email")
const password = document.getElementById("password")

const signInWithGoogleBtn = document.getElementById("sign-in-with-google-btn")
const signInBtn = document.getElementById("sign-in-btn")
const createAccountBtn = document.getElementById("create-account-btn")

signInBtn.addEventListener("click", () => {
    // e.preventDefault()
    // console.log(email.value, password.value)
    signInWithEmailAndPassword(auth, email.value, password.value)
})

signInWithGoogleBtn.addEventListener("click", authSignInWithGoogle)

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


function authSignInWithGoogle() {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
            console.log(user)
            console.log("Signed in with Google")
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            console.error(errorCode, errorMessage)
        });
    }
// new structure, this might be db, "user/uid/laps"
// const reference = ref(db, "laps")
// const totalRef = ref(db, "total")

// const dateEl = document.getElementById("date-el")
// const poolNameEl = document.getElementById("pool-name")
// const lapEl = document.getElementById("lap-num")
// const formEl = document.getElementById("form-el")
// const totalEl = document.getElementById("total-el")

import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, onValue, set, child
    // , ref, push, onValue, set, get, remove 
} from 'firebase/database'

import { 
    getAuth,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "firebase/auth"

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
// const user = auth.currentUser
const provider = new GoogleAuthProvider

const users = ref(db, "users")
// const lapsRef = ref(db, "users/userData/laps")
// console.log(users)

// const loginEl = document.getElementById("login-el")
const emailEl = document.getElementById("email")
const passwordEl = document.getElementById("password")
const nameEl = document.getElementById("name")

const signInWithGoogleBtn = document.getElementById("sign-in-with-google-btn")
const signInBtn = document.getElementById("sign-in-btn")
const createAccountBtn = document.getElementById("create-account-btn")

signInWithGoogleBtn.addEventListener("click", authSignInWithGoogle)

signInBtn.addEventListener("click", authSignInWithEmail)

createAccountBtn.addEventListener("click", authCreateAccountWithEmail)


const statsEl = document.getElementById("stats-el")


onAuthStateChanged(auth, (user) => {
if (user) {
    const uid = user.uid;
    getSnapshot(uid)
    // console.log(uid)
    // return uid
    // ...
} else {
    // User is signed out
    // ...
    console.log("you are not logged in")
}
});

// console.log(uid)

function authCreateAccountWithEmail() {
    const email = emailEl.value
    const password = passwordEl.value
    const name = nameEl.value

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            const user = auth.currentUser

            const userData = {
                name: name,
                uid: user.uid,
                lapsObject: {
                    date: null,
                    pool: null,
                    laps: null,
                    miles: null
                },
                total: 0
            }

            push(users, userData)

            clearAuthFields()
        })

        .catch((error) => {
            console.error(error.message) 
        })
}

function authSignInWithEmail() {
    const email = emailEl.value
    const password = passwordEl.value

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
        console.log(user.uid)
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
    });
}


function authSignInWithGoogle() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log(user.uid)
            console.log("Signed in with Google")
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage)
        });
    }

function clearInputField(field) {
    field.value = ""
}

function clearAuthFields() {
    clearInputField(emailEl)
    clearInputField(passwordEl)
}
// new structure, this might be db, "user/uid/laps"
// const reference = ref(db, "laps")
// const totalRef = ref(db, "total")


const dateEl = document.getElementById("date-el")
const poolNameEl = document.getElementById("pool-name")
const lapEl = document.getElementById("lap-num")
const formEl = document.getElementById("form-el")
const totalEl = document.getElementById("total-el")

formEl.addEventListener("submit", calculateDailyMiles)

let dateVal
let lapsVal
let yards
const yardsPerMile = 1760

function getTotalYards(pool) {
    switch (pool) {
        case "stacy":
            yards = 66
            break
        case "eddy":
            yards = 66
            break
        case "bart":
            yards = 50
            break
        default:
            yards = 50
    }
}


// let lapsRef

// reading

function getSnapshot(uid) {
    onValue(users, function(snapshot) {
        let totalMiles = 0
        // key is the number, value is the object
        const entries = Object.entries(snapshot.val())
        console.log(entries)
        for (let entry of entries) {
            if (entry[1].uid === uid) {
                console.log(entry[1])
                // lapsRef = entry[1].laps
                // console.log(entry[1].lapsObject)
                const date = entry[1].lapsObject.date.split('').slice(5).join('')
                const laps = Number(entry[1].lapsObject.laps).toFixed(1)
                const miles = Number(entry[1].lapsObject.miles).toFixed(1) 
                // totalMiles += Number(miles)
                statsEl.innerHTML += `
                <tr class="daily-stat" id="${entry[0]}">
                    <td>${date}</td>
                    <td>${laps}</td>
                    <td>${miles}</td>
                </tr>`
            }
            // set(entry[1].total, totalMiles)
            // .then(() => totalEl.textContent = totalMiles.toFixed(1))
        } 
        
    })
    
}

// let thisEntry

// writing

function calculateDailyMiles(e) {
    e.preventDefault()
    onValue(users, function(snapshot) {
        const entries = Object.entries(snapshot.val())
        for (let entry of entries) {
            if (entry[1].uid === uid) {
    // let entryKey = db.ref().child('users').push().key;
    // console.log(entryKey)
    // const reference = users/child
    // console.log(reference)
    dateVal = dateEl.value
    lapsVal = Number(lapEl.value)
    getTotalYards(poolNameEl.value)
    let totalYards = lapsVal * yards
    let dailyMiles = (totalYards / yardsPerMile).toFixed(1)        
    const thisEntry = {
            date: dateVal,
            laps: lapsVal,
            miles: dailyMiles,
            pool: poolNameEl.value
        }

    entry[1].lapsObject = thisEntry
    }}
    })
    // return thisEntry
    // const reference = users/child
    // console.log(reference)
    // push(users/, lapsObject)
    // console.log(newPostKey)

    // push(users, lapsObject) 
    // where uid == user.uid
    // resetForm()
}
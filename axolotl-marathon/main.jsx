import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, onValue , set
    // , child
    // , ref, push, onValue, set, get, remove 
} from 'firebase/database'

import { 
    getAuth,
    // createUserWithEmailAndPassword, 
    // signInWithEmailAndPassword, 
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
const provider = new GoogleAuthProvider

const signInWithGoogleBtn = document.getElementById("sign-in-with-google-btn")
const signOutBtn = document.getElementById("sign-out-btn")

signInWithGoogleBtn.addEventListener("click", authSignInWithGoogle)
signOutBtn.addEventListener("click", function() {
    signOut(auth)
})

const statsEl = document.getElementById("stats-el")

onAuthStateChanged(auth, (user) => {
if (user) {
    const uid = user.uid;
    getSnapshot()
    // call calculateDailyMiles here too?
} else {
    // User is signed out
    console.log("you are not logged in")
}
});

function authSignInWithGoogle() {
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user;
        // console.log(user.uid)
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

function resetForm() {
    clearInputField(dateEl)
    clearInputField(poolNameEl)
    clearInputField(lapEl)
}


const dateEl = document.getElementById("date-el")
const poolNameEl = document.getElementById("pool-name")
const lapEl = document.getElementById("lap-num")
const formEl = document.getElementById("form-el")
const totalEl = document.getElementById("total-el")

formEl.addEventListener("submit", calculateDailyMiles)

let yards
const yardsPerMile = 1760

function getTotalYards(pool) {
    switch (pool) {
        case "stacy":
            yards = 66;
            break
            case "eddy":
            yards = 66;
            break
            case "bart":
            yards = 50;
            break
            default:
            yards = 50;
        }
    }

function calculateDailyMiles(e) {
    
    e.preventDefault();
    let totalMiles = 0
    const userLapsInDb = ref(db, `users/${auth.currentUser.uid}/lapsRef`)
    const userTotalInDb = ref(db, `users/${auth.currentUser.uid}/total`)
    const dateVal = dateEl.value;
    const lapsVal = Number(lapEl.value);
    const poolName = poolNameEl.value;
    getTotalYards(poolName);
    let totalYards = lapsVal * yards;
    const dailyMiles = Number(totalYards / yardsPerMile).toFixed(1);
    totalMiles += Number(dailyMiles)
    const thisEntry = {
        date: dateVal,
        laps: lapsVal,
        miles: dailyMiles,
        pool: poolName
    };
    push(userLapsInDb, thisEntry)
    set(userTotalInDb, totalMiles)
    resetForm()
    }
        

function getSnapshot() {
        const userLapsInDb = ref(db, `users/${auth.currentUser.uid}/lapsRef`)
        const userTotalInDb = ref(db, `users/${auth.currentUser.uid}/totalRef`)
        let totalMiles = 0
        onValue(userLapsInDb, function(snapshot) {
        if (snapshot.exists()) {
            const entries = Object.entries(snapshot.val())
            statsEl.innerHTML = ""

            for (let entry of entries) {
                    const date = entry[1].date.split('').slice(5).join('')
                    const laps = Number(entry[1].laps).toFixed(1)
                    const miles = Number(entry[1].miles).toFixed(1) 
                    totalMiles += Number(miles)
                    statsEl.innerHTML += `
                    <tr class="daily-stat" id="${entry[0]}">
                        <td>${date}</td>
                        <td>${laps}</td>
                        <td>${miles}</td>
                    </tr>`
                    }
                }
                set(userTotalInDb, totalMiles)
                .then(() => totalEl.textContent = totalMiles.toFixed(1))
            })



}

// ***** elements for logging in with an email, add later ***** //


// const loginEl = document.getElementById("login-el")
// const emailEl = document.getElementById("email")
// const passwordEl = document.getElementById("password")
// const nameEl = document.getElementById("name")

// signInBtn.addEventListener("click", authSignInWithEmail)

// createAccountBtn.addEventListener("click", authCreateAccountWithEmail)

// const signInBtn = document.getElementById("sign-in-btn")
// const createAccountBtn = document.getElementById("create-account-btn")

        // function authCreateAccountWithEmail() {
        //     const email = emailEl.value;
        //     const password = passwordEl.value
        //     const name = nameEl.value
        
        //     createUserWithEmailAndPassword(auth, email, password)
        //         .then(() => {
        //             const user = auth.currentUser
        
        //             const userData = {
        //                 name: name,
        //                 uid: user.uid,
        //                 lapsObject: {
        //                     date: null,
        //                     pool: null,
        //                     laps: null,
        //                     miles: null
        //                 },
        //                 total: 0
        //             }
        
                    // console.log(user.uid)
        
        //             push(users, userData)
        
        //             clearAuthFields()
        //         })
        
        //         .catch((error) => {
        //             console.error(error.message) 
        //         })
        // }



// function authSignInWithEmail() {
//     const email = emailEl.value
//     const password = passwordEl.value
    
//     signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//         // Signed in 
//         const user = userCredential.user;
//         // ...
//         console.log(user.uid)
//     })
//     .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         console.log(errorCode, errorMessage)
//     });
// }

  // function clearAuthFields() {
//     clearInputField(emailEl)
//     clearInputField(passwordEl)
// }
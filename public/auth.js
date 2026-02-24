// Wait for Firebase to be initialized
function waitForFirebase() {
    return new Promise((resolve) => {
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            resolve();
        } else {
            setTimeout(() => waitForFirebase().then(resolve), 100);
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await waitForFirebase();

    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const provider = new firebase.auth.GoogleAuthProvider();

/* ---------- LOGIN ---------- */
loginBtn.onclick = async () => {
    const result = await firebase.auth().signInWithPopup(provider);
    const user = result.user;

    console.log("Logged in:", user.email);

    const userRef = firebase.firestore().collection("users").doc(user.uid);
    const userSnap = await userRef.get();

    // first time user
    if (!userSnap.exists) {
        await userRef.set({
            email: user.email,
            createdAt: Date.now(),
            balance: 0
        });
    }
};

/* ---------- AUTO LOGIN (MOST IMPORTANT PART) ---------- */
firebase.auth().onAuthStateChanged(async (user) => {
    const loginBtn = document.getElementById("loginBtn");
    const userInfo = document.getElementById("user-info");
    const userEmailEl = document.getElementById("user-email");

    if (user) {
        console.log("User session restored:", user.email);

        loginBtn.classList.add("hidden");
        userInfo.classList.remove("hidden");
        userEmailEl.textContent = user.email;

        const userRef = firebase.firestore().collection("users").doc(user.uid);
        const snap = await userRef.get();

        const data = snap.data();

        console.log("Loaded data:", data);

        // load your app here
        if (typeof loadUserData === "function") {
            loadUserData(data, user.uid);
        }

    } else {
        console.log("No user logged in");
        loginBtn.classList.remove("hidden");
        userInfo.classList.add("hidden");
    }
});

/* ---------- LOGOUT ---------- */
logoutBtn.onclick = () => {
    firebase.auth().signOut();
};

});
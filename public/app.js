// Firebase config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAacZyMhmhYtZlKMl9cjgKhFkQBYExmIpM",
  authDomain: "who-pays-manager.firebaseapp.com",
  projectId: "who-pays-manager",
  storageBucket: "who-pays-manager.firebasestorage.app",
  messagingSenderId: "1085035455988",
  appId: "1:1085035455988:web:2484e56757c233813685a1",
  measurementId: "G-5YSZXQM6QF"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics(); // אם אתה רוצה אנליטיקס
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Auth
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// DOM elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("user-info");
const userEmail = document.getElementById("user-email");

// Update UI
function updateUI(user) {
  if (user) {
    loginBtn.classList.add("hidden");
    userInfo.classList.remove("hidden");
    userEmail.innerText = user.email;
  } else {
    loginBtn.classList.remove("hidden");
    userInfo.classList.add("hidden");
    userEmail.innerText = "";
  }
}

// Check auth state
auth.onAuthStateChanged(updateUI);

// Login
loginBtn.onclick = async () => {
  try {
    const result = await auth.signInWithPopup(provider);
    updateUI(result.user);
  } catch (error) {
    console.error("Login error:", error);
  }
};

// Logout
logoutBtn.onclick = async () => {
  await auth.signOut();
  updateUI(null);
};
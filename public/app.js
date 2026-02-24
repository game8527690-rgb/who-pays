// Firebase config
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
};

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
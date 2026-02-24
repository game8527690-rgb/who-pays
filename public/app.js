// ===========================
// Firebase configuration
// ===========================
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// ===========================
// Auth setup
// ===========================
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// DOM elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("user-info");
const userEmail = document.getElementById("user-email");

// Function to update UI
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

// Check auth state on page load
auth.onAuthStateChanged((user) => {
  updateUI(user);
});

// Login with Google
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
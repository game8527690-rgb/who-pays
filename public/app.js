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
firebase.analytics();

// ===========================
// Firestore setup
// ===========================
const db = firebase.firestore();

// Connect to Firestore Emulator (optional)
db.useEmulator("localhost", 8080);

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

// Show login button after Firebase loads
loginBtn.classList.remove("hidden");

// Login with Google
loginBtn.onclick = async () => {
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    // Show user info
    userEmail.innerText = user.email;
    userInfo.classList.remove("hidden");
    loginBtn.classList.add("hidden");
  } catch (error) {
    console.error("Login error:", error);
  }
};

// Logout
logoutBtn.onclick = async () => {
  await auth.signOut();
  userInfo.classList.add("hidden");
  loginBtn.classList.remove("hidden");
};

// ===========================
// LocalStorage debts
// ===========================
let debts = JSON.parse(localStorage.getItem("my_debts")) || [];
let currentType = "plus";

// Set debt type (plus/minus)
function setDebtType(type) {
  currentType = type;
  const plusBtn = document.getElementById("btn-type-plus");
  const minusBtn = document.getElementById("btn-type-minus");

  if (type === "plus") {
    plusBtn.classList.replace("border-transparent", "border-emerald-500");
    plusBtn.classList.replace("bg-slate-800", "bg-emerald-500/20");
    plusBtn.classList.replace("text-slate-400", "text-emerald-400");

    minusBtn.classList.replace("border-rose-500", "border-transparent");
    minusBtn.classList.replace("bg-rose-500/20", "bg-slate-800");
    minusBtn.classList.replace("text-rose-400", "text-slate-400");
  } else {
    minusBtn.classList.replace("border-transparent", "border-rose-500");
    minusBtn.classList.replace("bg-slate-800", "bg-rose-500/20");
    minusBtn.classList.replace("text-slate-400", "text-rose-400");

    plusBtn.classList.replace("border-emerald-500", "border-transparent");
    plusBtn.classList.replace("bg-emerald-500/20", "bg-slate-800");
    plusBtn.classList.replace("text-emerald-400", "text-slate-400");
  }
}

// Add a debt
function addDebt() {
  const name = document.getElementById("name").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const reason = document.getElementById("reason").value;

  if (!name || !amount) {
    alert("נא להזין שם וסכום");
    return;
  }

  const newDebt = {
    id: Date.now(),
    name,
    amount,
    reason,
    type: currentType,
    date: new Date().toLocaleDateString("he-IL"),
  };

  debts.unshift(newDebt);
  saveAndRender();

  // Clear inputs
  document.getElementById("name").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("reason").value = "";
}

// Delete a debt
function deleteDebt(id) {
  debts = debts.filter((d) => d.id !== id);
  saveAndRender();
}

// Save to localStorage and re-render
function saveAndRender() {
  localStorage.setItem("my_debts", JSON.stringify(debts));
  renderDebts();
}

// Render debts on the page
function renderDebts() {
  const container = document.getElementById("debt-list");
  const totalOwedToMeEl = document.getElementById("total-owed-to-me");
  const totalIOweEl = document.getElementById("total-i-owe");

  container.innerHTML = "";
  let totalOwedToMe = 0;
  let totalIOwe = 0;

  if (debts.length === 0) {
    container.innerHTML = `<div class="text-center py-10 text-slate-500 italic">אין חובות רשומים. הכל נקי!</div>`;
  }

  debts.forEach((debt) => {
    if (debt.type === "plus") totalOwedToMe += debt.amount;
    else totalIOwe += debt.amount;

    const card = document.createElement("div");
    card.className = "glass-card p-4 rounded-2xl flex justify-between items-center animate-fadeIn";
    card.innerHTML = `
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold ${
          debt.type === "plus" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
        }">
          ${debt.name.charAt(0)}
        </div>
        <div>
          <h3 class="font-semibold text-slate-100">${debt.name}</h3>
          <p class="text-xs text-slate-500">${debt.reason || "ללא תיאור"} • ${debt.date}</p>
        </div>
      </div>
      <div class="text-left flex items-center gap-4">
        <span class="font-bold text-lg ${
          debt.type === "plus" ? "text-emerald-400" : "text-rose-400"
        }">
          ${debt.type === "plus" ? "+" : "-"} ₪${debt.amount}
        </span>
        <button onclick="deleteDebt(${debt.id})" class="text-slate-600 hover:text-rose-400 p-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  totalOwedToMeEl.innerText = `₪${totalOwedToMe}`;
  totalIOweEl.innerText = `₪${totalIOwe}`;
}

// Clear all debts
function clearAll() {
  if (confirm("בטוח שרוצה למחוק את כל הנתונים?")) {
    debts = [];
    saveAndRender();
  }
}

// Render debts initially
renderDebts();
/* ========= Firebase config + init ========= */
const firebaseConfig = {
  apiKey: "AIzaSyAacZyMhmhYtZlKMl9cjgKhFkQBYExmIpM",
  authDomain: "who-pays-manager.firebaseapp.com",
  projectId: "who-pays-manager",
  storageBucket: "who-pays-manager.appspot.com",
  messagingSenderId: "1085035455988",
  appId: "1:1085035455988:web:2484e56757c233813685a1",
  measurementId: "G-5YSZXQM6QF"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

/* ========= Auth UI ========= */
const loginBtn  = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo  = document.getElementById("user-info");
const userEmail = document.getElementById("user-email");
const app       = document.getElementById("app");

/* Login */
loginBtn.onclick = async () => {
  try {
    const result = await auth.signInWithPopup(provider);
    updateUI(result.user);
  } catch (err) {
    console.error("Login error:", err);
  }
};

/* Logout */
logoutBtn.onclick = async () => {
  await auth.signOut();
  updateUI(null);
};

/* Auth listener */
auth.onAuthStateChanged(user => {
  updateUI(user);
});

/* Update UI */
function updateUI(user) {
  if (user) {
    loginBtn.classList.add("hidden");
    userInfo.classList.remove("hidden");
    if(app) app.style.display = "block";
    userEmail.textContent = user.email;
  } else {
    loginBtn.classList.remove("hidden");
    userInfo.classList.add("hidden");
    if(app) app.style.display = "none";
    userEmail.textContent = "";
  }
}

/* ========= Debts ========= */
let debts = JSON.parse(localStorage.getItem('my_debts')) || [];
let currentType = 'plus';

window.setDebtType = (type) => {
  currentType = type;
  const plusBtn = document.getElementById('btn-type-plus');
  const minusBtn = document.getElementById('btn-type-minus');
  if(type==='plus'){
    plusBtn.classList.replace('border-transparent','border-emerald-500');
    plusBtn.classList.replace('bg-slate-800','bg-emerald-500/20');
    plusBtn.classList.replace('text-slate-400','text-emerald-400');

    minusBtn.classList.replace('border-rose-500','border-transparent');
    minusBtn.classList.replace('bg-rose-500/20','bg-slate-800');
    minusBtn.classList.replace('text-rose-400','text-slate-400');
  } else {
    minusBtn.classList.replace('border-transparent','border-rose-500');
    minusBtn.classList.replace('bg-slate-800','bg-rose-500/20');
    minusBtn.classList.replace('text-slate-400','text-rose-400');

    plusBtn.classList.replace('border-emerald-500','border-transparent');
    plusBtn.classList.replace('bg-emerald-500/20','bg-slate-800');
    plusBtn.classList.replace('text-emerald-400','text-slate-400');
  }
};

window.addDebt = () => {
  const name = document.getElementById('name').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const reason = document.getElementById('reason').value;

  if(!name || !amount){ alert('נא להזין שם וסכום'); return; }

  const newDebt = { id: Date.now(), name, amount, reason, type: currentType, date: new Date().toLocaleDateString('he-IL') };
  debts.unshift(newDebt);
  saveAndRender();

  document.getElementById('name').value='';
  document.getElementById('amount').value='';
  document.getElementById('reason').value='';

  // עדכן פופאפ אם פתוח
  if(popup && !popup.closed){
    popup.postMessage({action:'loadDebts', debts: debts}, '*');
  }
};

window.deleteDebt = (id) => { debts = debts.filter(d => d.id!==id); saveAndRender(); updatePopup(); };
window.clearAll = () => { if(confirm('בטוח שרוצה למחוק את כל הנתונים?')){ debts=[]; saveAndRender(); updatePopup(); } };

function saveAndRender(){
  localStorage.setItem('my_debts', JSON.stringify(debts));
  renderDebts();
}

function renderDebts(){
  const container = document.getElementById('debt-list');
  const totalOwedToMeEl = document.getElementById('total-owed-to-me');
  const totalIOweEl = document.getElementById('total-i-owe');

  container.innerHTML='';
  let totalOwedToMe = 0;
  let totalIOwe = 0;

  if(debts.length===0){ container.innerHTML=`<div class="text-center py-10 text-slate-500 italic">אין חובות רשומים. הכל נקי!</div>`; }

  debts.forEach(debt=>{
    if(debt.type==='plus') totalOwedToMe+=debt.amount; else totalIOwe+=debt.amount;

    const card = document.createElement('div');
    card.className='glass-card p-4 rounded-2xl flex justify-between items-center animate-fadeIn';
    card.innerHTML=`
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold ${debt.type==='plus'?'bg-emerald-500/20 text-emerald-400':'bg-rose-500/20 text-rose-400'}">${debt.name.charAt(0)}</div>
        <div>
          <h3 class="font-semibold text-slate-100">${debt.name}</h3>
          <p class="text-xs text-slate-500">${debt.reason || 'ללא תיאור'} • ${debt.date}</p>
        </div>
      </div>
      <div class="text-left flex items-center gap-4">
        <span class="font-bold text-lg ${debt.type==='plus'?'text-emerald-400':'text-rose-400'}">${debt.type==='plus'?'+':'-'} ₪${debt.amount}</span>
        <button onclick="deleteDebt(${debt.id})" class="text-slate-600 hover:text-rose-400 p-1">✖</button>
      </div>`;
    container.appendChild(card);
  });

  totalOwedToMeEl.innerText=`₪${totalOwedToMe}`;
  totalIOweEl.innerText=`₪${totalIOwe}`;
}

/* ========= Popup Handling דו-כיווני ========= */
let popup = null;
const openPopupBtn = document.getElementById('openPopupBtn');

function updatePopup(){
  if(popup && !popup.closed){
    popup.postMessage({action:'loadDebts', debts: debts}, '*');
  }
}

openPopupBtn.addEventListener('click', () => {
  if(popup && !popup.closed){
    popup.focus();
    return;
  }

  popup = window.open('./popup.html','popupWindow','width=500,height=400,top=100,left=100');

  // אחרי פתיחה, שלח את החובות כל 0.5 שניות עד שהפופאפ סגור
  const sendDebtsInterval = setInterval(() => {
    if(popup && !popup.closed){
      popup.postMessage({ action: 'loadDebts', debts: debts }, '*');
    } else {
      clearInterval(sendDebtsInterval);
    }
  }, 500);
});

window.addEventListener('message', (event) => {
  const data = event.data;

  if(data.action === 'closePopup'){
    if(popup && !popup.closed){
      popup.close();
      console.log('Popup נסגר בהצלחה מהאופנר');
    }
  }

  if(data.action === 'addDebt'){
    debts.unshift(data.debt);
    saveAndRender();
    console.log('חוב נוסף מהפופאפ:', data.debt);
  }
});
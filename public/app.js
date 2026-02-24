// קונפיגורציית Firebase
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
};

// אתחול אפליקציה
firebase.initializeApp(firebaseConfig);

// התחברות ל-Firestore
const db = firebase.firestore();

// חיבור ל-Firestore Emulator
db.useEmulator("localhost", 8080);

// דוגמה להוספת מסמך
db.collection("test").add({
  name: "Test User",
  date: new Date()
})
.then(docRef => console.log("Document written with ID:", docRef.id))
.catch(error => console.error("Error adding document:", error));
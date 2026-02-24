const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false 
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
// Open the popup and keep a reference
const popup = window.open('https://your-popup-url.com', 'popupWindow', 'width=600,height=400');

// Example: close it after 5 seconds
setTimeout(() => {
  if (popup && !popup.closed) {
    popup.close(); // safe, opener can close cross-origin popup
    console.log('Popup closed by opener');
  }
}, 5000);
window.addEventListener('message', (event) => {
  // אופציונלי: לבדוק מקור לאבטחה
  // if (event.origin !== 'https://your-popup-url.com') return;

  if (event.data.action === 'closePopup') {
    if (popup && !popup.closed) {
      popup.close();
      console.log('Popup closed via message from popup');
    }
  }
});
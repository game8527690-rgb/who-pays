const closeBtn = document.getElementById('close-btn');
closeBtn?.addEventListener('click', () => {
  if (window.opener) {
    window.opener.postMessage({ action: 'closePopup' }, '*');
  }
});const popup = window.open('https://your-popup-url.com', 'popupWindow', 'width=600,height=400');
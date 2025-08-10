document.addEventListener("DOMContentLoaded", () => {
  const avatar = document.getElementById("avatar");
  const welcomeText = document.getElementById("welcome-text");
  const logo = document.getElementById("logo");
  const intro = document.getElementById("intro");

  function safeRemoveIntro(){
    if(intro){
      intro.style.transition = 'opacity 0.6s ease';
      intro.style.opacity = 0;
      setTimeout(() => { try { intro.remove(); } catch {} }, 700);
    }
    if(logo) logo.style.opacity = 1;
  }

  if(welcomeText) setTimeout(() => welcomeText.style.opacity = 1, 500);

  setTimeout(() => {
    if(avatar){
      avatar.style.position = "absolute";
      avatar.style.top = "20px";
      avatar.style.left = "20px";
      avatar.style.width = "40px";
    }
    if(welcomeText) welcomeText.style.opacity = 0;
  }, 2000);

  setTimeout(() => {
    safeRemoveIntro();
  }, 3200);

  // Фолбэк: удалить заставку через 6 секунд, даже если что-то сломалось
  setTimeout(safeRemoveIntro, 6000);
});

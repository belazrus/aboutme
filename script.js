document.addEventListener("DOMContentLoaded", () => {
  const avatar = document.getElementById("avatar");
  const welcomeText = document.getElementById("welcome-text");
  const logo = document.getElementById("logo");
  const intro = document.getElementById("intro");

  // Показать текст через 0.5 сек
  setTimeout(() => {
    welcomeText.style.opacity = 1;
  }, 500);

  // Убрать текст, переместить аватарку в угол через 2 сек
  setTimeout(() => {
    welcomeText.style.opacity = 0;
    avatar.style.position = "absolute";
    avatar.style.top = "20px";
    avatar.style.left = "20px";
    avatar.style.width = "40px";
  }, 2000);

  // Показать логотип и убрать заставку через 3 сек
  setTimeout(() => {
    logo.style.opacity = 1;
    intro.style.opacity = 0;
    setTimeout(() => intro.remove(), 1000);
  }, 3000);
});

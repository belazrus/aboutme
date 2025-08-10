document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const intro = document.getElementById("intro");
  const avatar = document.getElementById("avatar");

  // Показать текст
  setTimeout(() => body.classList.add("show-text"), 500);

  // Перемещение аватарки в угол
  setTimeout(() => {
    body.classList.remove("show-text");
    avatar.classList.add("header-avatar");
  }, 2000);

  // Показать логотип и скрыть заставку
  setTimeout(() => {
    body.classList.add("show-logo");
    intro.classList.add("fade-out");
    setTimeout(() => {
      intro.remove();
      body.classList.add("content-visible");
    }, 800);
  }, 3200);
});

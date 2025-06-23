function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.key === "z") undo();
  if (event.ctrlKey && event.key === "y") redo();
}); 
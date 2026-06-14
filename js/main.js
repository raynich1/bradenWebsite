/* main.js — shared site behaviour.
   Keep small helpers here; loaded at the bottom of every page. */

// Auto-fill the current year in the footer.
document.addEventListener("DOMContentLoaded", function () {
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

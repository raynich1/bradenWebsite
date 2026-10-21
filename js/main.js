/* main.js — shared site behavior.
   Left filesystem-style sidebar nav (built from NAV_TREE), a hamburger toggle,
   the image lightbox, and the footer year. Loaded at the bottom of every page. */

// ---- Navigation tree (folders have `children`; every node is its own page). ----
var NAV_TREE = [
  { t: "Home", file: "index.html" },
  { t: "Education", file: "education.html" },
  { t: "Masters dissertation", file: "dissertation.html", children: [
    { t: "Design and materials", file: "dissertation-design.html", children: [
      { t: "Mechanical design", file: "dissertation-mech-design.html" },
      { t: "Heating coils", file: "dissertation-heating.html" }
    ] },
    { t: "Fracture mechanics and testing methods", file: "dissertation-fracture.html" },
    { t: "Optical measurement methods", file: "dissertation-optical.html" },
    { t: "Calculations and computation", file: "dissertation-computational.html", children: [
      { t: "Electromagnetic/thermal simulations", file: "dissertation-em-sim.html" },
      { t: "Mechanical simulations", file: "dissertation-mech-sim.html" }
    ] }
  ] },
  { t: "Experience", file: "experience.html", children: [
    { t: "Laboratory engineering", file: "exp-lab.html", children: [
      { t: "Design/modification/upkeep of lab equipment", file: "exp-design.html" },
      { t: "Consulting (testing) work", file: "exp-consulting.html" },
      { t: "Teaching", file: "exp-lecturing.html" },
      { t: "Supervision of undergrads", file: "exp-supervision.html" }
    ] },
    { t: "Teaching assistant work", file: "exp-teaching.html" },
    { t: "Internship at GasCon", file: "exp-gascon.html" },
    { t: "Job shadow at Smalley Springs and Rings", file: "exp-smalley.html" },
    { t: "Lowe's", file: "exp-lowes.html" },
    { t: "The Lucky Monk", file: "exp-luckymonk.html" }
  ] },
  { t: "Undergrad work", file: "undergrad.html", children: [
    { t: "Final-year project (SAIMechE award)", file: "undergrad-fyp.html" }
  ] },
  { t: "Contact", file: "contact.html" }
];

function currentPage() {
  var p = location.pathname.split("/").pop();
  return p ? p : "index.html";
}

function buildTree(items, cur, isRoot) {
  var ul = document.createElement("ul");
  ul.className = isRoot ? "tree" : "tree__children";
  items.forEach(function (it) {
    var li = document.createElement("li");
    li.className = "tree__item";

    var row = document.createElement("div");
    row.className = "tree__row";

    var hasKids = it.children && it.children.length;
    if (hasKids) {
      li.classList.add("is-folder");
      var toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "tree__toggle";
      toggle.setAttribute("aria-label", "Expand or collapse");
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        li.classList.toggle("is-open");
      });
      row.appendChild(toggle);
    } else {
      var spacer = document.createElement("span");
      spacer.className = "tree__spacer";
      row.appendChild(spacer);
    }

    var a = document.createElement("a");
    a.className = "tree__link";
    a.href = it.file;
    a.textContent = it.t;
    a.title = it.t;
    if (it.file === cur) a.classList.add("is-active");
    row.appendChild(a);
    li.appendChild(row);

    if (hasKids) li.appendChild(buildTree(it.children, cur, false));
    ul.appendChild(li);
  });
  return ul;
}

document.addEventListener("DOMContentLoaded", function () {
  // Footer year.
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Build the sidebar tree.
  var navHost = document.getElementById("sidebarNav");
  if (navHost) {
    var cur = currentPage();
    navHost.appendChild(buildTree(NAV_TREE, cur, true));
    // Open the folders leading to the current page.
    var active = navHost.querySelector(".tree__link.is-active");
    if (active) {
      var node = active.closest(".tree__item");
      while (node) {
        node.classList.add("is-open");
        node = node.parentElement ? node.parentElement.closest(".tree__item") : null;
      }
    }
  }

  // Hamburger toggle. Sidebar shows by default on wide screens, hidden on narrow.
  var toggle = document.getElementById("navToggle");
  if (window.matchMedia && window.matchMedia("(max-width: 768px)").matches) {
    document.body.classList.add("sidebar-hidden");
  }
  function syncToggle() {
    if (toggle) toggle.setAttribute("aria-expanded", String(!document.body.classList.contains("sidebar-hidden")));
  }
  syncToggle();
  if (toggle) {
    toggle.addEventListener("click", function () {
      document.body.classList.toggle("sidebar-hidden");
      syncToggle();
    });
  }
  var scrim = document.getElementById("navScrim");
  if (scrim) scrim.addEventListener("click", function () {
    document.body.classList.add("sidebar-hidden");
    syncToggle();
  });
});

// ---- Image lightbox: click any content picture to enlarge it with its caption. ----
(function () {
  var SELECTOR = "figure img, .fig-even img, .fig-strip img, .details__row img, .gallery img, .fig-pair img";

  function captionFor(img) {
    var fig = img.closest("figure");
    if (fig) { var fc = fig.querySelector("figcaption"); if (fc) return fc.textContent.trim(); }
    var row = img.closest(".fig-even, .fig-strip, .details__row");
    if (row && row.nextElementSibling && row.nextElementSibling.classList.contains("card__meta")) {
      return row.nextElementSibling.textContent.trim();
    }
    return img.getAttribute("alt") || "";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML =
      '<button class="lightbox__close" aria-label="Close">&times;</button>' +
      '<img class="lightbox__img" alt="" />' +
      '<p class="lightbox__caption"></p>';
    document.body.appendChild(box);
    var boxImg = box.querySelector(".lightbox__img");
    var boxCap = box.querySelector(".lightbox__caption");

    function open(img) {
      boxImg.src = img.currentSrc || img.src;
      boxImg.alt = img.getAttribute("alt") || "";
      var cap = captionFor(img);
      boxCap.textContent = cap;
      boxCap.style.display = cap ? "" : "none";
      box.classList.add("is-open");
      document.body.classList.add("lightbox-open");
    }
    function close() {
      box.classList.remove("is-open");
      document.body.classList.remove("lightbox-open");
    }

    document.addEventListener("click", function (e) {
      var img = e.target.closest(SELECTOR);
      if (img) { e.preventDefault(); open(img); }
    });
    box.addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  });
})();

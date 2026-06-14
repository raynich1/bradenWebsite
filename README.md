# Braden Nicholson — Personal Website

A static, multi-page skeleton site. No build tools or frameworks — just open the
HTML files in a browser, or host the folder anywhere (GitHub Pages, Netlify, etc.).

## Structure

```
Website/
├── index.html        Home / landing page
├── about.html        Bio, education, skills
├── experience.html   Work history (timeline)
├── projects.html     Project cards
├── contact.html      Contact details (+ optional form)
├── css/style.css     All styling (theme via the :root variables at the top)
├── js/main.js        Small shared script (footer year)
├── images/           Put photos & project images here
└── README.md         This file
```

## How to view it

Double-click `index.html`, or for a local server:

```powershell
# from inside the Website folder
python -m http.server 8000
# then open http://localhost:8000
```

## How to extend it

- **Add content:** search the HTML for `TODO:` comments — each marks a spot to fill in.
- **Add a photo:** drop a file in `images/` and update the `src` in `about.html`.
- **Add a project:** copy a `<article class="card">…</article>` block in `projects.html`.
- **Re-theme:** edit the colour/font variables in `:root` at the top of `css/style.css`.
- **Add a page:** copy any existing HTML file, change the `<title>`, the content, and
  the `is-active` class in the nav. The nav is repeated in each file — update all five
  when you add a new link.
- **CV download:** copy `Resume.pdf` into this folder and point the button in
  `experience.html` at it.

## Notes

- The contact form is commented out and has no backend. To enable it, use a service
  like Formspree or your own endpoint (instructions in `contact.html`).

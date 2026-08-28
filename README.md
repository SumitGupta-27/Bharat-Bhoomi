# Bharat Bhoomi — React (Vite) version

This is your original HTML/CSS/JS homepage, converted into a React + Vite project.
The design, layout, colors, text and SVGs are unchanged — only the code structure
changed from plain HTML to React components.

## 1. Setup instructions

Run these commands in a terminal, inside the folder where you unzip this project:

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## 2. Add your images

Your original file referenced three images that weren't included in the upload,
so you'll need to copy them into `public/images/` with these exact names:

```
public/images/sampleland.jpg
public/images/Emblem_of_India_black.svg
public/images/Emblem_of_India_white.svg
```

Once they're in place, the hero background photo and the two emblem logos
(navbar + footer) will appear automatically — the code already points at
these paths.

## 3. Folder structure

```text
bharat-bhoomi/
├── public/
│   └── images/              ← put sampleland.jpg + emblem SVGs here
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── IndiaMap.jsx
│   │   ├── Statistics.jsx
│   │   ├── Features.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 4. Beginner guide — where to change things

**Website text (headings, descriptions, buttons)**
Open the relevant component in `src/components/`. For example, the hero
heading and description live in `Hero.jsx`; the footer text lives in
`Footer.jsx`.

**Navigation links**
`src/components/Navbar.jsx` — inside the `<nav className="nav-links">`
block. Each link is a plain `<a href="...">Label</a>`.

**Feature cards (add / remove / edit)**
`src/components/Features.jsx` — at the top there's a `features` array.
Each item has a `color`, `title`, `desc`, and `icon`. Add a new object to
the array to add a card, or delete one to remove a card.

**Statistics numbers**
`src/components/Statistics.jsx` — at the top there's a `stats` array with
`number` and `label` pairs. Edit the values there.

**Hero background image**
Replace `public/images/sampleland.jpg` with your own image (keep the same
filename, or update the path in the `.hero::before` rule inside
`src/App.css`).

**Colors**
`src/App.css` — at the very top, inside `:root { ... }`. These are CSS
variables (e.g. `--color-blue-600`, `--color-navy-800`) used throughout
the site, so changing one value updates it everywhere it's used.

**Mobile menu logic**
`src/components/Navbar.jsx` — uses React's `useState` (`isMenuOpen`) and a
`toggleMenu` function instead of `document.querySelector`. The open/closed
styling comes from the `.nav-links--open` CSS class in `src/App.css`.

**Adding a new homepage section**
1. Create a new file in `src/components/`, e.g. `MySection.jsx`, following
   the pattern of the existing components (a function that returns a
   `<section>`).
2. Import it in `src/App.jsx` and add `<MySection />` inside `<main>`
   wherever you want it to appear.
3. Add any new CSS classes it needs to `src/App.css`.

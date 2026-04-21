# 🏗️ Project: Frontend Landing Page Builder (Jugaad Architecture)

## Role
You are a Senior React Developer specializing in Design Systems and Frontend Architecture. Build a **fully frontend-only** Landing Page Builder that works without any backend, database, or paid hosting.

---

## Tech Stack
- **Vite + React** (no Next.js)
- **Tailwind CSS** (layout only)
- **React Context API** (global state)
- **CSS Variables** (theming engine)
- **LocalStorage** (persistence layer)
- **No external UI libraries**

---

## Project File Structure
```
src/
├── context/
│   └── ProjectContext.jsx
├── pages/
│   ├── Dashboard.jsx
│   └── BlankCanvas.jsx
├── components/
│   ├── blocks/
│   │   ├── NavbarBlock.jsx
│   │   ├── HeroBlock.jsx
│   │   └── FooterBlock.jsx
│   ├── Sidebar.jsx
│   └── SaveControls.jsx
├── templates/
│   ├── StartupTemplate.jsx
│   ├── ClothingTemplate.jsx
│   └── HospitalTemplate.jsx
├── styles/
│   └── variables.css
└── App.jsx
```

---

## ⚠️ Core Rules (Never Break These)
1. **No inline styles** on individual elements. All editable styles go through CSS Variables on `:root`
2. **No backend calls** of any kind
3. **Context is the single source of truth** — no local component state for styles
4. **Every page save** must write to both LocalStorage AND be exportable as `.json`
5. Use **Tailwind only for layout** (flex, grid, padding, margin). Never for colors or fonts that need to be editable

---

## Phase 1 — The Brain (`ProjectContext.jsx`)

Build the global Context with this exact state shape:

```json
{
  "activeProject": null,
  "activeView": "dashboard",
  "pages": [],
  "currentPage": {
    "id": "",
    "name": "",
    "components": ["navbar", "hero", "footer"],
    "styles": {
      "bgColor": "#ffffff",
      "primaryColor": "#3b82f6",
      "textColor": "#1f2937",
      "accentColor": "#f59e0b",
      "borderRadius": "8px",
      "fontSize": "16px",
      "fontFamily": "Inter",
      "sectionPadding": "60px",
      "navBg": "#ffffff",
      "footerBg": "#1f2937"
    }
  }
}
```

### Context must expose these functions:
- `setActiveProject(projectName)` — switches between Startup / Clothing / Hospital
- `updateStyle(key, value)` — updates a single style key without wiping others
- `savePage()` — saves `currentPage` to `localStorage['builder_pages']`
- `loadPage(id)` — loads a saved page back into `currentPage`
- `deletePage(id)` — removes a page from saved list
- `exportPageAsJSON()` — triggers a `.json` file download of `currentPage`
- `importPageFromJSON(file)` — reads an uploaded `.json` and loads it into state
- `navigateTo(view)` — switches between `dashboard`, `canvas`, `template`

### CSS Variable Injection (the Jugaad Engine):
```js
useEffect(() => {
  const root = document.documentElement;
  const s = currentPage.styles;
  root.style.setProperty('--bg-color', s.bgColor);
  root.style.setProperty('--primary-color', s.primaryColor);
  root.style.setProperty('--text-color', s.textColor);
  root.style.setProperty('--accent-color', s.accentColor);
  root.style.setProperty('--border-radius', s.borderRadius);
  root.style.setProperty('--font-size', s.fontSize);
  root.style.setProperty('--font-family', s.fontFamily);
  root.style.setProperty('--section-padding', s.sectionPadding);
  root.style.setProperty('--nav-bg', s.navBg);
  root.style.setProperty('--footer-bg', s.footerBg);
}, [currentPage.styles]);
```

### AutoSave:
```js
useEffect(() => {
  if (currentPage.id) {
    savePage();
  }
}, [currentPage]);
```

---

## Phase 2 — Dashboard (`Dashboard.jsx`)

### Layout:
- Full screen with a top navbar showing "Page Builder" title + saved pages count
- 3 Project Cards in a grid (Startup, Clothing, Hospital)
- 1 separate **"+ New Blank Page"** button below the cards

### Each Project Card shows:
- Project name
- Tagline (Startup: "Modern solutions", Clothing: "Clean aesthetics", Hospital: "Compassionate care")
- Suggested color palette preview (3 small color dots)
- "Open Builder" button → calls `setActiveProject()` + `navigateTo('template')`

### New Blank Page button:
- Opens a small modal asking for a **Page Name**
- On confirm → creates a new `currentPage` object with a unique `id` (use `Date.now()`)
- Calls `navigateTo('canvas')`

### Saved Pages section:
- Below the cards, show a list of all pages saved in LocalStorage
- Each saved page shows: name, date, a "Load" button and a "Delete" button

---

## Phase 3 — Editable Blocks

### Rules for ALL blocks:
- Never use hardcoded colors or fonts
- Always use CSS variables: `var(--primary-color)`, `var(--font-family)`, etc.
- Accept an optional `editMode` prop — when `true`, show editable outlines

### `NavbarBlock.jsx`
- Logo text (editable) + nav links
- Background uses `var(--nav-bg)`
- Links use `var(--primary-color)` on hover
- A hamburger icon for mobile

### `HeroBlock.jsx`
- Large heading (editable text)
- Subheading (editable text)
- One CTA button using `var(--primary-color)` and `var(--border-radius)`
- Background uses `var(--bg-color)`
- Font uses `var(--font-family)` and `var(--font-size)`

### `FooterBlock.jsx`
- Brand name + short tagline
- 3 columns of links (editable)
- Copyright line
- Background uses `var(--footer-bg)`
- Text uses `var(--text-color)`

---

## Phase 4 — Blank Canvas (`BlankCanvas.jsx`)

### Layout:
- **Left sidebar** (280px fixed) → the Style Editor
- **Right main area** → live preview of the page being designed

### Canvas behavior:
- On load, renders `NavbarBlock` + `HeroBlock` + `FooterBlock` by default
- Each block has a floating **edit icon** on hover
- Clicking the edit icon focuses that block's settings in the sidebar

### Sidebar sections:
1. **Page Info** — editable page name field
2. **Colors** — color pickers for bgColor, primaryColor, textColor, accentColor, navBg, footerBg
3. **Typography** — font family selector + font size slider
4. **Geometry** — border radius slider (0–30px), section padding slider (20–120px)
5. **Save Controls** — Save button, Export JSON button, Import JSON button

---

## Phase 5 — Local System Font Access (Figma-style)

This is the most important phase for the typography feature.

### Goal:
Let the user pick from fonts **actually installed on their computer**, exactly like Figma does — no Google Fonts API needed.

### Custom Hook: `useLocalFonts.js`
```js
const useLocalFonts = () => {
  const [fonts, setFonts] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestFonts = async () => {
    try {
      // Browser API that reads system fonts (Chrome 103+ / Edge 103+)
      const available = await window.queryLocalFonts();
      // Deduplicate by family name
      const families = [...new Set(available.map(f => f.family))].sort();
      setFonts(families);
      setPermissionGranted(true);
    } catch (err) {
      console.error('Font access denied or not supported:', err);
      // Fallback for Firefox / Safari
      setFonts([
        'Arial', 'Georgia', 'Times New Roman', 'Courier New',
        'Verdana', 'Trebuchet MS', 'Impact', 'Comic Sans MS'
      ]);
    }
  };

  return { fonts, permissionGranted, requestFonts };
};
```

### Font Selector UI in Sidebar:
- A **"Load My Fonts" button** that triggers `requestFonts()`
- Once loaded, a **searchable dropdown** (filter by typing) showing all font families
- Each font name in the dropdown **renders in its own font** (like Figma)
- On select → calls `updateStyle('fontFamily', selectedFont)`
- The canvas updates **instantly** via CSS variable

### Browser Support Note:
```js
// window.queryLocalFonts() → Chrome 103+ and Edge 103+ only
// Firefox and Safari do NOT support this API yet
// The fallback list above handles unsupported browsers gracefully
```

---

## Phase 6 — 3 Project Templates

Each template uses the **same CSS variables** but has a **different layout**.
Build these after the canvas is working.

### `StartupTemplate.jsx`
- **Default styles:** `bgColor: #0f172a`, `primary: #38bdf8`, `radius: 4px`
- **Layout:** Full-width hero, feature grid, pricing section, footer

### `ClothingTemplate.jsx`
- **Default styles:** `bgColor: #fafaf9`, `primary: #1c1917`, `radius: 0px`
- **Layout:** Editorial navbar, split hero (image left / text right), collections grid, footer

### `HospitalTemplate.jsx`
- **Default styles:** `bgColor: #ffffff`, `primary: #0284c7`, `radius: 12px`
- **Layout:** Trusted navbar, hero with appointment CTA, departments grid, doctor cards, footer

---

## Phase 7 — Save System (`SaveControls.jsx`)

### LocalStorage structure:
```js
localStorage.setItem('builder_pages', JSON.stringify([
  { id: 'page_1', name: 'My Page', styles: {...}, components: [...], createdAt: '...' },
  { id: 'page_2', name: 'Another Page', styles: {...}, components: [...], createdAt: '...' }
]))
```

### Export JSON:
```js
const exportPageAsJSON = () => {
  const blob = new Blob(
    [JSON.stringify(currentPage, null, 2)],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${currentPage.name || 'page'}.json`;
  a.click();
};
```

### Import JSON:
```js
const importPageFromJSON = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const imported = JSON.parse(e.target.result);
    // Loads into context → CSS variables update instantly
    setCurrentPage(imported);
  };
  reader.readAsText(file);
};
```

### Save Controls UI:
| Button | Color | Behaviour |
|--------|-------|-----------|
| **Save** | Green | Shows "Saved ✓" for 2 seconds |
| **Export JSON** | Blue | Downloads `.json` file |
| **Import JSON** | Grey | Opens file picker (`.json` only) |

---

## Demo Script for Seniors

Walk through in this exact order:

1. Open **Dashboard** → show 3 project cards + blank page option
2. Open **Blank Canvas** → show live style editing with color pickers
3. Click **"Load My Fonts"** → show system fonts loading like Figma
4. Change a font → show canvas updating instantly
5. Open **Browser DevTools → LocalStorage tab** → show JSON auto-saving live
6. Click **Export** → show the `.json` file downloading
7. **Refresh the page** → show styles persist from LocalStorage
8. Open a **Template** → show same CSS variables powering a completely different layout

> **Pro line to say:** *"I built a lightweight state-persistence layer using LocalStorage to keep the demo functional and fast without needing a backend in the prototype phase."*

---

## What NOT to Build (Keep it Jugaad)

- ❌ No drag-and-drop
- ❌ No user authentication
- ❌ No cloud sync
- ❌ No image uploads
- ❌ No Next.js or SSR
- ❌ No component libraries (shadcn, MUI, Chakra, etc.)

---

## How to Use This Prompt in Your AI IDE

> Paste this entire file into Cursor / Windsurf / Copilot and say:
> **"Start with Phase 1 only. Do not move to Phase 2 until I confirm Phase 1 is working."**

Build one phase at a time. Test each phase before moving forward.

# ML Interview Sprint Tracker

A dependency-free, interactive GitHub Pages site for tracking a 25-day machine-learning interview and job-search sprint.

## Features

- All 25 days from July 1–25, 2026
- Required daily order: R → C → Q → I → J → LOG
- Checkbox-level progress tracking
- Weighted completed-hour calculation
- Weekly, completion-status, and text filters
- Daily notes
- Job-application tracker
- Export/import progress as JSON
- Automatic browser persistence with `localStorage`
- Responsive desktop/mobile layout
- GitHub Pages deployment workflow

## Run locally

No build step is required.

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

Opening `index.html` directly also works in most browsers, but a local server is more reliable.

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Copy these files into the repository.
3. Push to the `main` branch.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, choose **GitHub Actions**.
6. The included workflow publishes the site after every push to `main`.

The site will normally appear at:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
```

## Data storage

Progress, notes, and applications are saved only in the current browser's `localStorage`. Use **Export progress** to create a backup or move progress to another browser/device.

## Customize the plan

Edit `data.js`:

- `BLOCKS` controls block names and durations.
- `PLAN` contains every day, title, and task.

The interface updates automatically from the data file.

## Repository structure

```text
.
├── .github/workflows/pages.yml
├── app.js
├── data.js
├── index.html
├── styles.css
├── LICENSE
└── README.md
```

## License

MIT

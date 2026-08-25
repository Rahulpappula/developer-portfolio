Developer Portfolio Demo

This is a small static demo of a developer portfolio as requested. It includes:
- Terminal-style hero
- Project cards with tech tags, demo & GitHub links
- Blog list
- Skills radar chart (Chart.js)
- GitHub stats fetch (replace placeholder username)
- Dark theme + green accent, Swiss-minimal inspired layout

How to run locally
1. Recommended: serve files with a static web server to avoid CORS problems when fetching GitHub data.
   - Python: python -m http.server 8000 (from this folder)
   - npm: npx http-server -c-1
2. Open http://localhost:8000 in your browser.

Where to edit content
- data/projects.json — projects shown in the Projects section
- data/blog.json — blog posts
- script.js — set GITHUB_USERNAME to your GitHub handle to enable stats

Next steps you might ask for
- Add form to upload a PDF resume and extract text
- Add pagination for blog posts or an authored Markdown pipeline
- Add automated GitHub stars and contributions badges server-side to avoid rate limits

This project is a demo — replace placeholders (your-username, demo links) with real values.

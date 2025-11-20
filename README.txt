Hi 👋, I'm Mano Aravindhan Gandhi
A passionate frontend & full-stack developer from India

Quick start
-----------

This is a static portfolio site (HTML/CSS/JS). To preview locally you can use any static server.

Using Python (Windows cmd.exe):

	python -m http.server 5500

Then open http://localhost:5500 in your browser.

SASS
----
Source SASS is available in `assets/sass`. If you edit SASS, compile it (example with dart-sass):

	sass assets/sass/main.scss assets/css/main.css --no-source-map --style=expanded

Notes
-----
- I replaced the main site with a fresh, single-page portfolio and added `assets/css/style.css`.
- Files added/changed:
	- `index.html` — new single-page portfolio (About, Work, Skills, Contact).
	- `assets/css/style.css` — new stylesheet for the site.
	- `resume.html` — downloadable resume (HTML); replace with a PDF if you have one.
	- `resume.pdf` — placeholder PDF added; header download now points to `resume.pdf`.
- If you'd like the contact form to post to a backend, I can add an Express route or wire a Form endpoint.


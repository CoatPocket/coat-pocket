# coat pocket

Phone-first notes on the games and apps we ship.

A static Astro site. The world sees a post when a markdown file is in the repo and the site is deployed. No accounts. No compose UI.

## Run

Install dependencies, then start the dev server with the dev script.
Astro prints a local URL (usually http://localhost:4321).

## Build

Use the build script. Static files land in dist/. Preview with the preview script.

## New post

1. Add a markdown file under src/content/posts/.
2. Frontmatter: title, date (YYYY-MM-DD), kind (game or app), hero (public path), dek (one line), url (optional Play/Open target).
3. Put the hero screenshot in public/.
4. Deploy. That is the publish step.

kind: game paints the slide ink (dark) with a Play CTA.
kind: app paints it bone (cream) with an Open CTA.
On the feed, Play / Open goes to the post page.
On the post page, Play / Open goes to url if you set one.

Filter the feed with /?kind=game or /?kind=app (also /games/ and /apps/).

## Brand

Lockup and mark live in public/ (lockup.svg, lockup-inverse.svg, mark.svg, mark-inverse.svg).
Do not redraw them. Signal orange #F15A24 is for Play / Open only.

Package scripts: dev, build, preview. See package.json.

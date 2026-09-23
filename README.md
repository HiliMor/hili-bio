# Hili — Bio

My personal site: who I am, what I've built, and what building it taught me.

**▶ [www.hili.bio](https://www.hili.bio)** · 🖥 Retro version: [xp.hili.bio](https://xp.hili.bio)

![The hili.bio landing page](preview.jpg)

## What's on the page

- **About:** seven years in intelligence analysis, now building software with AI in the loop
- **Work:** a filterable list of professional and personal projects, with links to live demos and code
- **Field notes:** short lessons from building things, each linked to a longer write-up in the project's README
- **Contact:** [hello@hili.bio](mailto:hello@hili.bio)

## Featured projects

| Project | What it is |
|---|---|
| [SEGS booking platform](https://github.com/HiliMor/ez-raider-booking-platform) | A production booking and operations system for an EZ Raider tour business ([live](https://segs.co.il/)) |
| [After Rain](https://github.com/HiliMor/after-rain) | An interactive miniature forest after rain, in three.js and WebGPU ([live](https://hilimor.github.io/after-rain/)) |
| [Skógafoss](https://github.com/HiliMor/skogafoss-waterfall) | A real-time WebGPU study of the Icelandic waterfall ([live](https://hilimor.github.io/skogafoss-waterfall/)) |
| [Picture House](https://github.com/HiliMor/movie-recommender) | A movie recommender built on MovieLens 25M ([live](https://movie-recommendations.up.railway.app)) |
| [Stroke prediction](https://github.com/HiliMor/stroke-prediction-project) | Stroke-risk models in WEKA and Python, and how I caught data leakage |

## How it's built

A single hand-written `index.html` with inline CSS and vanilla JavaScript. There is no framework and no build step. The fonts come from Google Fonts: Syne, DM Mono and Cormorant Garamond.

## Run it locally

```bash
git clone https://github.com/HiliMor/hili-bio.git
cd hili-bio
python3 -m http.server 8000
# open http://localhost:8000
```

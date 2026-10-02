# Performance — hili.bio

The authoritative source is `main` in HiliMor/hili-bio. Before this change, production Render service `srv-d70i0qc50q8c73a7bs1g` was serving commit `7b153cc`. The public HTML matched that commit apart from Cloudflare's injected email protection. The obsolete local `codex-personal-site-refresh` branch was deleted; its uncommitted files were backed up outside the repository.

## Changes

- Responsive, content-hashed WebP images for the homepage and Velvet Army case study; existing source media are retained.
- The original 1,076,872-byte homepage avatar is now 18,382 bytes at 800px, 43,312 bytes at 1600px, or 60,982 bytes at its full original width. The browser chooses the appropriate resolution.
- Animated SEGS and movie GIFs (24,592,411 bytes combined) are replaced with H.264 MP4 (3,802,138 bytes combined), a reduction of 84.5%. The odd-height SEGS capture is padded by one pixel for H.264 compatibility.
- Demo sources and lightweight posters attach only within 300px of the viewport. Playback pauses offscreen and in hidden tabs; reduced-motion users retain static posters and native controls. No-JavaScript visitors get static fallback images.
- Locally hosted, content-hashed WOFF2 fonts with their OFL licenses and inline font declarations remove the external stylesheet round trip. Existing typefaces and weights are preserved; `font-display: swap` keeps text visible.
- Explicit dimensions reserve image/video space. The existing entrance transition is shortened from 400ms to 200ms.
- Render: `/assets/*` is configured with `Cache-Control: public, max-age=31536000, immutable`. All referenced images, videos, posters and fonts in this directory use content-hashed names. HTML retains the hosting provider's revalidation policy.

## Verification — 2026-10-02

Headless Chrome; fresh browser contexts; local HTTP server; network latency 80ms and download throughput 200,000 bytes/second (1.6Mbps); no CPU throttling. Representative single-run measurements after load plus 1.6 seconds:

| Page | Viewport / DPR | FCP | LCP | CLS |
| --- | --- | ---: | ---: | ---: |
| Home | 1440×900 / 1 | 380ms | 1472ms | 0.00024 |
| Home | 390×844 / 2 | 356ms | 912ms | 0 |
| Velvet case study | 1440×900 / 1 | 260ms | 1304ms | 0.00084 |
| Velvet case study | 390×844 / 2 | 256ms | 628ms | 0 |

These are development measurements, not a production timing guarantee or a before/after speed benchmark. The previous report concerned an obsolete branch and was removed.

Browser checks: all images decode; no JavaScript errors or HTTP errors; no horizontal overflow at both tested sizes; mobile menu and keyboard Escape work; project filtering works; both demo videos decode and advance; offscreen playback pauses; reduced-motion mode does not autoplay; no-JavaScript text and demo fallbacks remain visible. Desktop/mobile homepage, project cards and case-study screenshots were inspected. JavaScript syntax and `git diff --check` pass.

Production verification must confirm the deployed commit, hashed asset responses, immutable cache header, WOFF2/WebP/MP4 content types, byte-range support and response compression.

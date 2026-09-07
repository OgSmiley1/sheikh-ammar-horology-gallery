# Cinematic Sheikh Background Sequence

## Curation boundary

The requested homepage sequence will be assembled only from images already treated as owner-provided or officially sourced within the project. It will remain a **non-commercial editorial backdrop** and will not manufacture an appearance, attribute a watch, or imply an ownership claim beyond an existing source-bound record.

| Asset reviewed | Finding | Curation status |
| --- | --- | --- |
| `slideshow-sheikh-only/slide-01.webp` | A vertical social-media interface screenshot containing platform chrome, caption text, and a third-party account context. | **Excluded.** It is neither an appropriate clean background frame nor a safe media source for a new cinematic sequence. |
| `sheikh-photos/sheikh-portrait-1.webp` | Clean, high-quality owner-supplied portrait with a distinctive blue-sky palette and suitable subject separation. | **Candidate retained** for a slow portrait push-in and a parchment/olive transitional overlay. |
| `slideshow-optimized/13.webp` | Existing project image of Sheikh Ammar closely examining timepieces, with a warm domestic palette and visible watch-making context. | **Candidate retained** as the narrative centrepiece; it is visually distinct and supports the archive theme without a new factual caption. |
| `slideshow-optimized/2jYk0frrLuaE.webp` | Formal portrait against a red background with a printed title strip embedded in the image. | **Not selected as a primary frame.** It may be used only as a deeply blurred, detail-cropped transition if its existing project provenance is confirmed; no embedded text will remain visible. |
| `slideshow-optimized/5eq9eKmCN05B.webp` | Clean outdoor portrait in the same blue-sky setting and pose family as the retained `sheikh-portrait-1.webp`. | **Excluded as a duplicate visual direction.** The final sequence must avoid near-identical portrait frames. |
| `slideshow-optimized/DgsysO9I0DZU.webp` | Circular social-profile style crop on a white canvas. | **Excluded.** Its framing reads as an avatar rather than a cinematic background plate. |
| `IMG_7794(1).png` | User-uploaded social screenshot showing Sheikh Ammar and a watch image but including phone, app, notification, and account interface chrome. | **Excluded as a raw sequence frame.** A social-platform screenshot must not be presented as a clean cinematic photograph. |
| Official Gallery search asset `YbP9UDbesgzS.webp` | High-resolution official-gallery leadership portrait with a distinctive airy white composition and a documentary pairing. | **Candidate retained.** It supplies an archival, portrait-scale transition and will be used without an event-specific caption. |
| Official Gallery search asset `KHaNtc4Brd2x.webp` | High-resolution official-gallery ceremonial image with formal gold-trimmed dress and architectural surroundings. | **Candidate retained.** It supplies a warmer, formal tonal movement that contrasts with the blue portrait and horology-study frame. |

## Selected four-frame sequence

1. `sheikh-photos/sheikh-portrait-1.webp` — **Dawn portrait**, clean blue-sky entry frame.
2. `slideshow-optimized/13.webp` — **The study**, a quiet horology-facing frame.
3. Official Gallery `YbP9UDbesgzS.webp` — **Continuity**, an airy archival leadership frame.
4. Official Gallery `KHaNtc4Brd2x.webp` — **Ceremony**, a warm formal closing frame.

The two Official Gallery frames retain the official media-gallery source link and the existing authorization boundary from `docs/EDITORIAL_IMAGE_SOURCING.md`. The local project frames are already part of the owner-provided project asset set. None will receive an invented watch, event, or ownership label.

## Creative specification

| Dimension | Direction |
| --- | --- |
| Purpose | A silent, loopable homepage background that establishes the Royal Horology Collection as an editorial gallery rather than a retail experience. |
| Duration and format | A 24-second **16:9** loop, formed from four six-second sequences. |
| Visual language | Editorial luxury, archival photography, soft natural light, ivory and nocturne-olive tonal restraint, burnished-bronze highlights, gentle analog grain. |
| Camera language | Slow, physically plausible digital push-ins and lateral drifts; no synthetic camera motion that changes the people, watches, or locations in the source images. |
| Text and sound | No on-screen text, no narration, no music, no generated dialogue. The website supplies any text and remains fully bilingual. |
| Accessibility | The integrated video will be muted, decorative, pausable, and disabled for reduced-motion preference. A poster image will ensure a stable first paint. |

## Four-clip plan

| Time | Frame and purpose | Motion and transition |
| --- | --- | --- |
| 00:00–00:06 | **Dawn portrait** — owner-provided blue-sky portrait; establishes a calm, human opening. | The portrait exists from the first frame; the view advances in a slow 4% push-in toward the eyes while an ivory veil gradually gathers at the edges. It dissolves through a parchment-white field rather than morphing the subject. |
| 00:06–00:12 | **The study** — Sheikh Ammar examining timepieces; introduces the horological atmosphere. | The timepiece study is present from the first frame; the virtual camera moves downward by a small, plausible amount toward the hands and watch objects. A subdued olive shadow develops along the lower frame before a soft crossfade. |
| 00:12–00:18 | **Continuity** — official-gallery leadership image with generous negative space. | Both figures stay still and identifiable throughout; the camera makes a gentle rightward drift through the natural white space. Light blooms softly at the upper edge, transitioning to warm architectural tones without introducing new subjects. |
| 00:18–00:24 | **Ceremony** — official-gallery formal portrait in a warm architectural setting; resolves the sequence. | The formal composition remains stable while the camera makes a very slow 3% pull-back, revealing more of the symmetrical surroundings. The final frame fades through a bronze-tinted ivory veil that matches the opening frame, producing a seamless loop. |

> **Production boundary:** The sequence uses motion from the selected source images only. It must not create new people, watches, garments, locations, claims, or text.

## Reference-image requirement

The four curated project or official-gallery frames are the source-image references for the execution. A 16:9 ivory-toned reference frame will be created before the background motion sequence to establish the required crop, tonal treatment, and edge veil without creating a new photographic subject.

## Initial integration review

The local homepage review confirmed that the cinematic backdrop sits behind the watch-story stage rather than replacing it: the main watch record remains legible, the video is visually softened by the existing parchment veil, the updated non-commercial source boundary is visible, and the official-gallery link appears directly beneath it. The browser’s isolated console evaluation context did not return a media-element diagnostic value, so it is not used as evidence of playback state. The component itself sets the video to muted, inline, looping playback and synchronizes it with the existing pause and reduced-motion state; the public-domain review will confirm delivery after publication.

## Publication observation

The first two fresh requests to the public domain after checkpoint `9db687f1` continued to return the preceding Arabic homepage artifact: the old boundary sentence appeared and the official-gallery source link plus cinematic video markup were absent from extracted content. This is recorded as a **deployment-propagation state**, not as a failure of the verified local integration. A public English/Arabic review will resume once the current artifact is served.

The managed MP4 itself is publicly reachable through the published `/manus-storage/royal-horology-cinematic-background_8dac247a.mp4` path. Browser playback shows a 25-second video with the curated portrait opening frame, confirming that media delivery is healthy and that the outstanding issue is limited to public application-shell propagation.

An additional public-domain request after refreshed checkpoint `e13fa999` still returned the previous Arabic homepage shell. The persisted old boundary string and absent source link continue to identify a deployment-propagation lag rather than a media delivery or code-integration issue.

The subsequent live request propagated the current artifact. The Arabic homepage displayed the updated Arabic source boundary and official-gallery link with the watch image on the right and editorial copy on the left. The English review then displayed the corresponding English source boundary, Official Gallery link, and LTR presentation. The cinematic video layer remains visually subordinate beneath the parchment treatment in both views, preserving foreground legibility and the non-commercial gallery hierarchy.

The remaining three frames will be selected only after matching their existing in-project provenance to the documented official or owner-provided boundaries.

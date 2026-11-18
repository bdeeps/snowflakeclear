<!-- glassbox:start -->
<!-- Generated from glassbox.json by the Glassbox hub (npm run readme -- snowflakeclear). Edit glassbox.json, not this block. -->

<h1 align="center">SnowflakeClear</h1>

<p align="center"><b>How does a snowflake get its shape?</b><br>Every snowflake is a tiny recording of the weather it fell through. Watch six arms grow the same way, because they all feel the same air.</p>

<p align="center"><a href="https://glassbox.how/snowflakeclear/"><b>▶ Play with it</b></a> &nbsp;·&nbsp; <a href="https://glassbox.how/e/snowflakeclear/">Read the 60-second explainer</a></p>

<p align="center">
  <a href="https://glassbox.how/e/snowflakeclear/"><img alt="Glassbox No. 239" src="https://img.shields.io/badge/Glassbox-No.%20239-8ef0ff"></a>
  <a href="https://glassbox.how/e/snowflakeclear/"><img alt="Nature" src="https://img.shields.io/badge/field-Nature-a3e635"></a>
  <a href="LICENSE"><img alt="Code: MIT" src="https://img.shields.io/badge/code-MIT-3fb950"></a>
  <a href="LICENSE-CONTENT.md"><img alt="Content: CC BY 4.0" src="https://img.shields.io/badge/content-CC%20BY%204.0-ef9421"></a>
  <a href="#privacy"><img alt="Privacy: explained" src="https://img.shields.io/badge/privacy-explained-555"></a>
</p>

## In 60 seconds

1. **It starts with water.** A water molecule is bent, with about 104.5 degrees between its hydrogens. Hydrogen bonds link each molecule to four neighbours, and that frame is built from six-sided rings. So ice crystals are hexagonal.
2. **A speck grows.** A crystal starts as a tiny hexagon on a speck of dust. Corners poke into fresher, moister air, catch more vapour and race ahead. That runaway makes branches. The model runs this rule on a hexagonal grid.
3. **Temperature picks the shape.** In the 1930s Ukichiro Nakaya grew snow in a cold lab and found shapes flip with temperature and humidity. Roughly: plates near minus 2, needles near minus 5, columns after that, plates and ferns near minus 15.
4. **Six arms, one journey.** The arms do not signal each other. The flake is small and travels as one piece, so all six arms meet the same air at the same moment and grow the same way. The shape records its path.
5. **No two alike?.** Wilson Bentley found no two flakes the same after photographing thousands from 1885. But alike is not identical, and twins can grow side by side. Nancy Knight's 1988 paper was about near-matches, not exact ones.
6. **Clear ice, white snow.** Many snowflakes are broken, rimed or clumped, not neat stars. And snow looks white because countless faces scatter every colour of light, even though each crystal is clear.

## Words worth knowing

| Term | Meaning |
|---|---|
| **Hydrogen bond** | A weak pull between a hydrogen on one water molecule and the oxygen of another. |
| **Ice Ih** | The ordinary form of ice, whose oxygen atoms sit in a hexagonal lattice. |
| **Six-fold symmetry** | A pattern that looks the same after turning by 60 degrees. |
| **Supersaturation** | Air holding more water vapour than it could in balance with ice, which drives crystals to grow. |
| **Branching instability** | A bump on a growing crystal reaches fresher vapour, grows faster and sticks out more, so edges break into branches. |
| **Cellular automaton** | A grid of cells that each follow the same simple rule using only their neighbours. |
| **Habit** | The overall shape type of a crystal, such as plate, column or needle. |
| **Nakaya diagram** | A map of crystal shape against temperature and humidity, named for Ukichiro Nakaya. |
| **Dendrite** | A branching, fern-like pattern, from the Greek word for tree. |
| **Rime** | Ice formed when supercooled cloud droplets freeze onto a crystal. |

## A short history

**From a Chinese scholar's six-pointed flowers to cellular models on a hex grid, 2,000 years of asking why snow has six arms.**

- **135 BCE** · "Snow flowers are six-pointed" (Han Ying, China)
- **1611** · Kepler asks why snow has six corners (Johannes Kepler, Prague / Frankfurt)
- **1637** · Descartes describes snow crystals in detail (René Descartes, Amsterdam and the Netherlands)
- **1665** · Hooke draws snowflakes under a microscope (Robert Hooke, London, England)
- **1885** · Bentley takes his first snow crystal photograph (Wilson A. Bentley, Jericho, Vermont)
- **1936** · The first artificial snow crystal (Ukichiro Nakaya, Sapporo, Hokkaido)
- **1936** · The Nakaya diagram (Ukichiro Nakaya and colleagues, Sapporo, Hokkaido)
- **1966** · Magono and Lee classify natural snow crystals (Choji Magono and Chung Woo Lee, Sapporo, Hokkaido)

The full story, with 25 moments, charts, people and 25 sources: [glassbox.how/e/snowflakeclear/history](https://glassbox.how/e/snowflakeclear/history/). The data lives in [`history.json`](history.json).

## Privacy

This box has no accounts and no ads, and it ships its own fonts and libraries. When you run it yourself it sends nothing anywhere. On glassbox.how, the site's `/bar.js` also loads Glassbox's analytics: **Google Analytics** to count visits (it asks first in the EU, UK and Switzerland, and stays off when your browser sends Global Privacy Control or Do Not Track) and **ClickTrust** to detect bots.

It remembers a few things **in your own browser only**, and never sends them anywhere:

| Browser storage key | What it holds |
|---|---|
| `snowflakeclear.v1` | Which chapters you have opened, your best quiz scores, and sound on or off. |

Exactly what each one sees is at [glassbox.how/privacy](https://glassbox.how/privacy/).

## Licences

- **Code:** [MIT](LICENSE). Use it, change it, ship it.
- **Explanations, text, images and videos** (`glassbox.json`, `glassbox/`): [CC BY 4.0](LICENSE-CONTENT.md). Credit “Glassbox, glassbox.how/e/snowflakeclear”.
- **Third-party parts** keep their own licences: [three.js](https://threejs.org) (MIT), [Geist, Instrument Serif](https://openfontlicense.org) (SIL OFL 1.1), [Reiter cellular automaton (algorithm only, implemented from the published description; no code copied)](https://ideas.repec.org/a/eee/chsofr/v23y2005i4p1111-1119.html) (Published method, Reiter 2005).
- The Glassbox name and logo aren't covered by either licence. See the [terms](https://glassbox.how/terms/).

Found a mistake? [Open an issue](https://github.com/bdeeps/snowflakeclear/issues). Corrections happen in public.
<!-- glassbox:end -->

## Run it

It's plain HTML, CSS and JavaScript. No build step and no dependencies. Run locally, it contacts no other website.

```bash
python3 -m http.server 8000
```

Three.js and the fonts ship in `vendor/` and `fonts/`, so it also works offline.

Then open http://localhost:8000.

## How it's built

| File | What |
|---|---|
| `index.html`, `css/app.css` | The page and its styles |
| `js/app.js`, `js/stage.js`, `js/ui.js`, `js/kit.js` | The shared Glassbox 3D engine: chapters, 3D stage, controls, quiz, video director |
| `js/chapters/*.js` | One file per chapter: the 3D model, controls, text, key terms, quiz and video scenes |
| `glassbox.json` | Title, question, explainer beats, key terms, browser storage and credits shown on glassbox.how |
| `reel` in each chapter | The storyboard the Glassbox studio records into short videos |
| `glassbox/` | The published video, slides, thumbnail and post copy |
| `fonts/`, `vendor/three/` | Self-hosted Geist and Instrument Serif (SIL OFL 1.1) and three.js (MIT) |

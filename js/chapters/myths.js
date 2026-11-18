// Chapter 5: "no two alike" and other myths. Wilson Bentley photographed thousands of crystals from 1885 and found no two the same.
// In 1988 Nancy Knight published "No Two Alike?" in the Bulletin of the American Meteorological Society about two snow crystals
// that looked nearly the same; she was clear that alike is not identical. Kenneth Libbrecht has grown lab "identical-twin"
// crystals side by side. The gallery below uses the same flake generator as the previous chapter, with each flake given its own
// slightly different cloud path. Spread 0 gives the same path to every flake. This is an illustration of the idea, not a statistic.
import { THREE, M, smooth, lerp } from '../kit.js';
import { drawFlake, flakeMesh, rng, COL } from '../snow.js';
import { CLOUD } from './arms.js';

const COLS = 4, ROWS = 3, NF = COLS * ROWS;
const histFor = (seed, spread) => {
  const R = rng(seed * 131 + 7), { U, TT, SS } = CLOUD;
  const dT = U.map(() => (R() - 0.5) * 2 * 2.6 * spread), dS = U.map(() => (R() - 0.5) * 2 * 8 * spread);
  return (u) => {
    u = Math.min(1, Math.max(0, u)); let i = 0; while (i < U.length - 2 && u > U[i + 1]) i++;
    const f = smooth((u - U[i]) / (U[i + 1] - U[i]));
    return { T: lerp(TT[i] + dT[i], TT[i + 1] + dT[i + 1], f), S: Math.max(0, lerp(SS[i] + dS[i], SS[i + 1] + dS[i + 1], f)) };
  };
};
const opts = (i, spread, W) => ({ hist: histFor(spread < 0.001 ? 0 : i, spread), u1: 1, rings: false, noise: 0.07 * spread, seed: 40 + i, N: W > 128 ? 110 : 70 });

export default {
  id: 'myths',
  short: 'No two alike?',
  title: 'No two alike, and other myths',
  subtitle: 'Alike is not the same as identical. Why twins are possible, and why you will never find one on your sleeve.',
  view: { pos: [0, 12.5, 7], target: [0, 0, -1.6] },
  learn: `<p><b>"No two snowflakes are alike."</b> In 1885, a Vermont farmer named <b>Wilson Bentley</b> photographed a snow crystal through a microscope, and he went on to photograph thousands. He never found two that matched, and the saying took hold. (A photographer named Johann Flögel took snow crystal pictures earlier, in 1879, so Bentley was not quite the first.)</p>
    <p>The idea is half right. A crystal's shape records the path it took through the cloud, and no two paths are exactly the same, so any two flakes you catch will differ. But there is nothing in physics that forbids twins. Grow two crystals <b>side by side</b>, through the same air, and you can get nearly the same shape. Kenneth Libbrecht has done it in the lab.</p>
    <p>In <b>1988</b> the scientist <b>Nancy Knight</b> published <b>"No Two Alike?"</b> about two hollow crystals from a Wisconsin storm that looked very similar under the microscope. She did not claim they were identical. The headline made it sound that way. At the level of single molecules, no two are.</p>
    <p class="tip"><b>Try it:</b> set <b>Spread</b> to 0. Every flake gets the same journey and comes out the same. Turn it up, and watch the match between A and B fall.</p>`,
  terms: [
    { t: 'Photomicrograph', d: 'A photograph taken through a microscope. Bentley made his by fixing a camera to a microscope.' },
    { t: 'Alike vs identical', d: 'Alike means looks very close. Identical means the same in every detail, even at the scale of molecules.' },
    { t: 'Twin crystals', d: 'Two crystals grown side by side through the same conditions. They can come out very similar, but not exactly the same.' },
  ],
  defaults: { spread: 0.45, n: 20 },
  controls: [
    { key: 'spread', type: 'range', label: 'Spread: how different each journey is', min: 0, max: 1, step: 0.01, fmt: (v) => (v === 0 ? 'none (same journey)' : `${Math.round(v * 100)}%`) },
    { key: 'n', type: 'range', label: 'Branching decisions along one arm', min: 1, max: 60, step: 1, fmt: (v) => `${Math.round(v)}`, hint: 'Pretend each one has 3 possible outcomes.' },
  ],
  quiz: [
    { q: 'What did Wilson Bentley do from 1885?', options: ['Grew snowflakes in a lab', 'Photographed snow crystals through a microscope', 'Classified clouds', 'Measured snowfall'], answer: 1, why: 'He photographed thousands of crystals through a microscope on his farm in Vermont, and found no two the same.' },
    { q: 'What did Nancy Knight\'s 1988 paper "No Two Alike?" report?', options: ['Two exactly identical flakes', 'Two crystals that looked very similar, not claimed to be identical', 'That all flakes are different', 'A new snow machine'], answer: 1, why: 'She wrote about two nearly matching crystals. Alike is not identical, and she objected to it being reported that way.' },
    { q: 'What makes twin crystals possible in the lab?', options: ['Using the same camera', 'Growing them side by side through the same conditions', 'Freezing them quickly', 'Keeping them dry'], answer: 1, why: 'Shape comes from the conditions along the path. Give two crystals the same path and the shapes come out nearly the same.' },
  ],
  reel: [
    { ms: 6400, caption: 'In 1885 Wilson Bentley found no two snowflakes the same. But give flakes one journey and they can match.', set: { spread: 0.9, n: 20 }, view: { pos: [0, 12.5, 7], target: [0, 0, -1.6] }, anim: { spread: [0.9, 0, false] }, spin: 0 },
  ],
  build({ stage, s }) {
    stage.floor.visible = false;
    const root = new THREE.Group(); stage.root.add(root);
    const board = new THREE.Mesh(new THREE.PlaneGeometry(15, 11), new THREE.MeshStandardMaterial({ color: 0x0b0f1a, roughness: 0.9 })); board.rotation.x = -Math.PI / 2; board.position.y = -0.05; root.add(board);
    const fl = [];
    for (let i = 0; i < NF; i++) {
      const f = flakeMesh(2.9, 256), c = i % COLS, r = Math.floor(i / COLS);
      f.position.set((c - (COLS - 1) / 2) * 3.55, 0, (r - (ROWS - 1) / 2) * 3.3); root.add(f); fl.push(f);
    }
    [0, 1].forEach((i, k) => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(1.52, 1.58, 48), new THREE.MeshBasicMaterial({ color: COL.lime, side: THREE.DoubleSide, toneMapped: false })); ring.rotation.x = -Math.PI / 2; ring.position.copy(fl[i].position); ring.position.y = -0.02; root.add(ring);
      stage.label(k ? 'B' : 'A', [0, 0, -1.75], fl[i], 'hot');
    });
    const cmp = document.createElement('canvas'); cmp.width = cmp.height = 96; const cg = cmp.getContext('2d', { willReadFrequently: true });
    const mask = (i, spread) => { drawFlake(cg, 96, opts(i, spread, 96)); const d = cg.getImageData(0, 0, 96, 96).data, m = new Uint8Array(96 * 96); for (let k = 0; k < m.length; k++) m[k] = d[k * 4 + 3] > 80 ? 1 : 0; return m; };
    let match = 100, lk = '';
    const redraw = (st) => {
      fl.forEach((f, i) => f.draw(opts(i, st.spread, 256)));
      const a = mask(0, st.spread), b = mask(1, st.spread); let inter = 0, uni = 0;
      for (let k = 0; k < a.length; k++) { if (a[k] && b[k]) inter++; if (a[k] || b[k]) uni++; }
      match = uni ? Math.round((inter / uni) * 100) : 100;
    };
    redraw(s);
    let t0 = 0;
    return {
      update(dt, st) {
        t0 += dt;
        const k = st.spread.toFixed(3); if (k !== lk) { lk = k; redraw(st); }
        root.rotation.y = Math.sin(t0 * 0.2) * 0.04;
      },
      readout(st) {
        const n = Math.round(st.n), log10 = n * Math.log10(3), digits = log10 < 6 ? Math.round(Math.pow(3, n)).toLocaleString('en-US') : `about 10^${Math.floor(log10)}`;
        return `<div class="big">${match}% match</div><p class="r-say">How well flake A overlaps flake B (shape overlap, from the picture). ${st.spread === 0 ? 'Same journey and so the same shape.' : 'Different journeys, different shapes.'}</p>
          <div class="row"><span>${n} decisions, 3 options each</span><b>${digits}</b></div><p class="r-say note">different possible arm histories. It grows fast, which is why a match needs nearly the same journey.</p>`;
      },
    };
  },
};

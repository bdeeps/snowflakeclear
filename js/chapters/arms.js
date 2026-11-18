// Chapter 4: why the six arms look alike. A flake is small, a fraction of a millimetre across, and it drifts as one piece through
// the cloud. Each arm meets the same temperature and the same humidity at the same moment, so each arm grows the same
// way at the same time. The shape therefore records the flake's journey. The cloud path below is made up for the
// demonstration: it is the kind of changing path real flakes follow, not a measurement.
import { THREE, M, sphere, smooth, lerp } from '../kit.js';
import { drawFlake, flakeMesh, habitOf, tempColor, COL } from '../snow.js';

const U = [0, 0.2, 0.35, 0.55, 0.7, 0.85, 1], TT = [-12, -13.5, -15, -16, -14, -14.5, -15.5], SS = [7, 10, 22, 12, 6, 20, 23];
export const CLOUD = { U, TT, SS };
export const cloud = (u) => {
  u = Math.min(1, Math.max(0, u));
  let i = 0; while (i < U.length - 2 && u > U[i + 1]) i++;
  const f = smooth((u - U[i]) / (U[i + 1] - U[i]));
  return { T: lerp(TT[i], TT[i + 1], f), S: lerp(SS[i], SS[i + 1], f) };
};
const Y0 = 4.2, Y1 = -4.2;

export default {
  id: 'arms',
  short: 'Why six arms match',
  title: 'Why six arms match',
  subtitle: 'The arms are not talking to each other. They just live through the same weather.',
  view: { pos: [0, 2.4, 17], target: [0, 1.4, 0] },
  learn: `<p>How do six arms, growing apart from each other, end up the same? A common guess is that the arms somehow <b>signal</b> to each other. They do not. A snowflake is far too small and too fast-growing for that.</p>
    <p>The real reason is simpler. The flake is small, less than a few millimetres, and it is carried through the cloud <b>as one piece</b>. At any moment all six arms meet the <b>same temperature and the same humidity</b>. When the air says "branch", all six branch. When it says "grow flat", all six grow flat. The pattern of each arm is a <b>recording of the flake's journey</b>, played six times.</p>
    <p>Because the cloud changes along the fall, a flake's centre is a record of where it started, and its edge is a record of where it ended. If one arm meets different conditions, for example a neighbour flake steals its vapour, that arm falls behind and the symmetry breaks. Real flakes are mostly lopsided for this reason, and only a small fraction is neatly six-fold.</p>
    <p class="tip"><b>Try it:</b> slide <b>Fall</b> and watch each ring colour appear on all six arms at once. Then turn up <b>Starve one arm</b> and see symmetry fail.</p>`,
  terms: [
    { t: 'Growth history', d: 'The record of conditions a crystal grew through. It stays frozen into the shape.' },
    { t: 'Sector plate', d: 'A plate with six wedge-shaped sections, separated by ribs along the arms.' },
    { t: 'Side branch', d: 'A short branch growing off an arm at 60 degrees, as on a fern.' },
    { t: 'Symmetry breaking', d: 'When something treats one part differently, so the parts stop matching.' },
  ],
  defaults: { fall: 1, play: false, shield: 0, rings: true },
  controls: [
    { key: 'fall', type: 'range', label: 'Fall through the cloud', min: 0.02, max: 1, step: 0.002, fmt: (v) => `${Math.round(v * 100)}% down` },
    { key: 'play', type: 'toggle', label: 'Play the fall' },
    { key: 'shield', type: 'range', label: 'Starve one arm of vapour', min: 0, max: 1, step: 0.01, fmt: (v) => (v ? `${Math.round(v * 100)}%` : 'off'), hint: 'Like a neighbouring flake taking the moist air.' },
    { key: 'rings', type: 'toggle', label: 'Colour by temperature', hint: 'Each ring of colour is the temperature when that part grew.' },
  ],
  quiz: [
    { q: 'Why do all six arms of a flake usually look alike?', options: ['They talk to each other', 'They meet the same conditions at the same time', 'Gravity shapes them', 'Wind sculpts them'], answer: 1, why: 'The flake drifts as one small piece, so all six arms feel the same temperature and humidity, and grow the same way.' },
    { q: 'What does the centre of a flake record?', options: ['Where the flake ended its fall', 'Where it started growing', 'The wind speed', 'The colour of the cloud'], answer: 1, why: 'Growth goes outward, so the centre formed first. The edge is the most recent conditions.' },
    { q: 'What happens when one arm gets less vapour than the others?', options: ['It grows longer', 'It falls behind and the flake becomes lopsided', 'Nothing', 'All arms shrink to match'], answer: 1, why: 'The arms only match because they get identical conditions. Change the conditions on one, and it grows differently.' },
  ],
  reel: [
    { ms: 6400, caption: 'All six arms meet the same air at the same moment, so all six grow the same way.', set: { fall: 0.03, rings: true, shield: 0, play: false }, view: { pos: [0, 2.4, 17], target: [0, 1.4, 0] }, anim: { fall: [0.03, 1] }, spin: 0 },
    { ms: 5000, caption: 'Starve one arm and the match breaks. A flake is a recording of its journey.', set: { fall: 1, rings: true, shield: 0, play: false }, view: { pos: [3.4, 2.4, 13], target: [3.4, 0.3, 0] }, anim: { shield: [0, 0.8, false] }, spin: 0 },
  ],
  build({ stage, s }) {
    stage.floor.visible = false;
    const root = new THREE.Group(); stage.root.add(root);
    // the cloud path on the left
    const path = new THREE.Group(); path.position.set(-6.3, 0, 0); root.add(path);
    const NP = 90, dots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.075, 10, 8), new THREE.MeshBasicMaterial({ toneMapped: false }), NP);
    const o = new THREE.Object3D(), pc = new THREE.Color();
    const px = (u) => Math.sin(u * 7) * 0.45 + Math.sin(u * 17) * 0.1, py = (u) => lerp(Y0, Y1, u);
    for (let i = 0; i < NP; i++) { const u = i / (NP - 1), c = cloud(u); o.position.set(px(u), py(u), 0); o.updateMatrix(); dots.setMatrixAt(i, o.matrix); pc.set(tempColor(c.T)); dots.setColorAt(i, pc); }
    path.add(dots);
    [0, 0.35, 0.7, 1].forEach((u) => { const c = cloud(u); path.add(stage.label(`${c.T.toFixed(0)} °C · ${habitOf(c.T, c.S).n.toLowerCase()}`, [1.8, py(u), 0], path)); });
    const mark = sphere(0.22, M.glow(COL.lime), 16); path.add(mark);
    path.add(stage.label('The flake', [0.2, 0.55, 0], mark, 'hot'));
    path.add(stage.label('Cloud top: start', [-0.5, Y0 + 0.6, 0], path));
    path.add(stage.label('Cloud base: end', [-0.5, Y1 - 0.6, 0], path));
    // the flake on the right
    const holder = new THREE.Group(); holder.position.set(3.4, 0, 0); root.add(holder);
    const flake = flakeMesh(7.6, 1024); holder.add(flake);
    // faint reference arm axes so symmetry is easy to see
    const axes = new THREE.Group(); holder.add(axes);
    for (let k = 0; k < 6; k++) { const a = (k * Math.PI) / 3 - Math.PI / 2; const ln = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.01, 0), new THREE.Vector3(Math.cos(a) * 3.7, 0.01, Math.sin(a) * 3.7)]), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 })); axes.add(ln); }
    let info = { radius: [0, 0, 0, 0, 0, 0] }, lk = '', t0 = 0;
    const lab = stage.label('', [0, -0.2, 4.3], holder, 'hot');
    const redraw = (st) => { info = flake.draw({ hist: cloud, u1: st.fall, shield: st.shield, rings: st.rings, N: 140 }); };
    redraw(s);
    return {
      update(dt, st) {
        t0 += dt;
        if (st.play && !document.body.classList.contains('gb-reel')) { st.fall += dt * 0.07; if (st.fall >= 1) { st.fall = 1; st.play = false; } }
        const k = `${st.fall.toFixed(4)}${st.shield}${st.rings}`; if (k !== lk) { lk = k; redraw(st); }
        const c = cloud(st.fall);
        mark.position.set(px(st.fall), py(st.fall), 0);
        holder.rotation.x = -0.9 + Math.sin(t0 * 0.4) * 0.05; holder.rotation.y = Math.sin(t0 * 0.25) * 0.15;
        axes.visible = true;
        lab.element.textContent = habitOf(c.T, c.S).n + ' growing now';
      },
      readout(st) {
        const c = cloud(st.fall), h = habitOf(c.T, c.S), r = info.radius, mx = Math.max(...r), mn = Math.min(...r);
        const diff = mx > 0 ? Math.round(((mx - mn) / mx) * 100) : 0;
        return `<div class="big">${Math.round(st.fall * 100)}% down</div>
          <div class="row"><span>Air now</span><b>${c.T.toFixed(1)} °C · +${c.S.toFixed(0)}%</b></div>
          <div class="row"><span>Growing as</span><b>${h.n.toLowerCase()}</b></div>
          <div class="row"><span>Longest vs shortest arm</span><b class="${diff < 3 ? 'ok' : 'no'}">${diff}% apart</b></div>
          <p class="r-say">${st.shield > 0.05 ? 'One arm is getting less vapour, so it has fallen behind the others.' : 'All six arms read the same journey, so they match. The centre grew first, the rim last.'}</p>`;
      },
    };
  },
};

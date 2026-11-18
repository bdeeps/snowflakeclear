// Chapter 1: the water molecule and the hexagon. A water molecule is bent, with an H-O-H angle of about 104.5 degrees in
// the gas. In ordinary ice (ice Ih) each oxygen is hydrogen-bonded to four neighbours in a roughly tetrahedral pattern, and
// that open framework, seen along its c axis, is a honeycomb of six-sided rings. Oxygen positions below are the standard
// ice Ih ones: a = 4.52 A, c = 7.37 A, oxygen at (1/3, 2/3, 1/16) and its symmetry partners (space group P6_3/mmc).
// The hydrogen positions are one random arrangement that follows "each oxygen gives two and takes two" as far as it can;
// in real ice the hydrogens are disordered.
import { THREE, M, sphere, beam } from '../kit.js';
import { rng, COL } from '../snow.js';

const A = 4.52, C = 7.37, ZZ = 1 / 16, S = 0.42; // Angstrom to scene units in lattice mode
const TET = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map((v) => new THREE.Vector3(...v).normalize());

function iceOxygens(radius) {
  const base = [[1 / 3, 2 / 3, ZZ], [2 / 3, 1 / 3, ZZ + 0.5], [2 / 3, 1 / 3, -ZZ], [1 / 3, 2 / 3, 0.5 - ZZ]], out = [];
  const zc = C * 0.25;
  for (let i = -4; i <= 4; i++) for (let j = -4; j <= 4; j++) for (let k = -2; k <= 2; k++) for (const b of base) {
    const u = b[0] + i, v = b[1] + j, w = b[2] + k;
    const X = A * (u - v / 2), Y = A * 0.8660254 * v, Z = C * w - zc;
    if (Math.hypot(X, Y, Z) <= radius) out.push(new THREE.Vector3(X, Z, -Y)); // c axis points up
  }
  return out;
}
const show = (g, v) => { g.traverse((o) => { o.visible = v; }); };

export default {
  id: 'molecule',
  short: 'Water and the hexagon',
  title: 'Water and the hexagon',
  subtitle: 'A bent molecule, a web of hydrogen bonds, and a frame full of six-sided rings.',
  view: { pos: [0, 1.2, 8.5], target: [0, 0, 0] },
  learn: `<p>A water molecule is <b>bent</b>: the two hydrogens sit on one side of the oxygen, with an <b>H-O-H angle of about 104.5 degrees</b> in the gas. The oxygen pulls electrons toward itself, so it carries a little negative charge and the hydrogens a little positive charge.</p>
    <p>That lopsided charge lets a hydrogen on one molecule reach toward the oxygen of the next. This is a <b>hydrogen bond</b>. In ice each oxygen ends up with four neighbours in a roughly <b>tetrahedral</b> arrangement, close to 109.5 degrees between bonds. Build that out and you get <b>ice Ih</b>, an open frame made of puckered rings of six oxygens.</p>
    <p>Look down the frame's long axis, the <b>c axis</b>, and the rings form a honeycomb. Turn it by 60 degrees and it looks the same. The plate-like or six-armed shape of a snow crystal grows from that six-fold lattice.</p>
    <p class="tip"><b>Try it:</b> pick <b>Ice lattice</b>, tick <b>Look down the c axis</b>, then drag <b>Turn the lattice</b> and watch for the angles where it lines up with itself.</p>`,
  terms: [
    { t: 'Hydrogen bond', d: 'A weak pull between a hydrogen on one molecule and an oxygen on another. Much weaker than a covalent bond, but there are a lot of them.' },
    { t: 'Ice Ih', d: 'The ordinary form of ice, with a hexagonal lattice. The "h" stands for hexagonal.' },
    { t: 'c axis', d: 'The long axis of the hexagonal ice lattice, at right angles to the flat six-sided layers.' },
    { t: 'Six-fold symmetry', d: 'A shape that looks the same after being turned by one sixth of a full circle, which is 60 degrees.' },
  ],
  defaults: { mode: 'lattice', hyd: false, top: false, turn: 0, spin: 0.25 },
  controls: [
    { key: 'mode', type: 'seg', label: 'Show', options: [{ v: 'molecule', label: 'One molecule' }, { v: 'bonds', label: 'Hydrogen bonds' }, { v: 'lattice', label: 'Ice lattice' }] },
    { key: 'hyd', type: 'toggle', label: 'Show the hydrogens', hint: 'In the lattice, only one of many possible arrangements. Real ice is disordered.' },
    { key: 'top', type: 'toggle', label: 'Look down the c axis', hint: 'The honeycomb of six-sided rings.' },
    { key: 'turn', type: 'range', label: 'Turn the lattice', min: 0, max: 360, step: 1, fmt: (v) => `${Math.round(v)}°` },
    { key: 'spin', type: 'range', label: 'Slow spin', min: 0, max: 1, step: 0.01, fmt: (v) => (v ? `${v.toFixed(2)}` : 'off') },
  ],
  quiz: [
    { q: 'About what angle is the H-O-H angle in a water molecule in the gas?', options: ['90 degrees', '104.5 degrees', '120 degrees', '180 degrees'], answer: 1, why: 'It is bent, at about 104.5 degrees, a little less than the 109.5 degrees of a perfect tetrahedron.' },
    { q: 'How many near neighbours does each oxygen have in ice Ih?', options: ['Two', 'Three', 'Four', 'Six'], answer: 2, why: 'Four, joined by hydrogen bonds in a roughly tetrahedral pattern. The rings of six come from how those four-neighbour bonds are arranged.' },
    { q: 'Looking down the c axis of ice, you see rings that repeat every...', options: ['30 degrees', '60 degrees', '90 degrees', '120 degrees only'], answer: 1, why: 'The pattern is six-fold: turn it by 60 degrees and it matches itself.' },
  ],
  reel: [
    { ms: 5200, caption: 'A water molecule is bent: about 104.5 degrees between its two hydrogens.', set: { mode: 'molecule', top: false, spin: 0.3 }, view: { pos: [0, 0.8, 6.2], target: [0, 0.2, 0] }, spin: 0.3 },
    { ms: 5400, caption: 'Look down the axis and turn it 60 degrees: the lattice matches itself. That is where six arms come from.', set: { mode: 'lattice', hyd: false, top: true, turn: 0 }, view: { pos: [0, 9.5, 0.01], target: [0, 0, 0] }, anim: { turn: [0, 60] }, spin: 0 },
  ],
  build({ stage, s }) {
    stage.floor.visible = false;
    const root = new THREE.Group(); stage.root.add(root);
    const R = rng(11);
    const redM = M.plastic(0xff5d5d, { roughness: 0.35 }), whiteM = M.plastic(0xf4f8ff, { roughness: 0.3 }), bondM = M.glow(0x9aa6c0);

    // ---- one molecule
    const mol = new THREE.Group(); root.add(mol);
    const K = 1.6, half = (104.5 / 2) * Math.PI / 180, oh = 0.96 * K;
    mol.add(sphere(0.62, redM, 40));
    const H = [-1, 1].map((sg) => { const p = [sg * Math.sin(half) * oh, Math.cos(half) * oh, 0]; const h = sphere(0.36, whiteM, 32); h.position.set(...p); mol.add(h, beam([0, 0, 0], p, 0.06, M.matte(0xcfd5e4))); return p; });
    const arc = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 41 }, (_, i) => { const a = -half + (i / 40) * 2 * half; return new THREE.Vector3(Math.sin(a) * 1.15, Math.cos(a) * 1.15, 0); })), new THREE.LineBasicMaterial({ color: COL.amber }));
    mol.add(arc);
    mol.add(stage.label('<b>104.5°</b>', [0, 1.5, 0], mol, 'hot'));
    mol.add(stage.label('O  δ−', [0, -0.95, 0], mol));
    mol.add(stage.label('H δ+', [H[0][0] - 0.1, H[0][1] + 0.62, 0], mol));
    mol.add(stage.label('H δ+', [H[1][0] + 0.1, H[1][1] + 0.62, 0], mol));

    // ---- a molecule and its four neighbours
    const cl = new THREE.Group(); root.add(cl);
    const k2 = 0.88, d = 2.75 * k2;
    cl.add(sphere(0.34, redM, 28));
    const dash = new THREE.LineDashedMaterial({ color: 0x8ef0ff, dashSize: 0.1, gapSize: 0.08 });
    TET.forEach((t, i) => {
      const o = sphere(0.3, redM, 24); o.position.copy(t).multiplyScalar(d); cl.add(o);
      const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), t.clone().multiplyScalar(d)]);
      const ln = new THREE.Line(g, dash); ln.computeLineDistances(); cl.add(ln);
      const donor = i < 2; // centre gives to 0 and 1; 2 and 3 give to the centre
      const hp = t.clone().multiplyScalar(donor ? 0.96 * k2 : d - 0.96 * k2);
      const h = sphere(0.19, whiteM, 20); h.position.copy(hp); cl.add(h);
      cl.add(beam(donor ? [0, 0, 0] : t.clone().multiplyScalar(d).toArray(), hp.toArray(), 0.045, M.matte(0xcfd5e4)));
      // each neighbour's other hydrogen points off to the side
      const side = new THREE.Vector3().crossVectors(t, new THREE.Vector3(0, 1, 0.3)).normalize();
      const o2 = t.clone().multiplyScalar(d);
      for (const sg of [-1, 1]) if (i >= 2 || sg > 0) { const p = o2.clone().add(side.clone().multiplyScalar(0.95 * k2 * 0.8 * sg)).add(t.clone().multiplyScalar(0.3)); const hh = sphere(0.17, whiteM, 16); hh.position.copy(p); cl.add(hh, beam(o2.toArray(), p.toArray(), 0.04, M.matte(0xcfd5e4))); }
    });
    cl.add(stage.label('Each oxygen: two hydrogen bonds given, two taken', [0, -2.9, 0], cl));
    cl.add(stage.label('about 2.75 Å apart', [d * 0.6, d * 0.7 + 0.2, 0], cl));

    // ---- lattice
    const lat = new THREE.Group(); root.add(lat);
    const O = iceOxygens(9.5), N = O.length;
    const oMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.2, 18, 12), redM, N);
    const o = new THREE.Object3D();
    O.forEach((p, i) => { o.position.copy(p).multiplyScalar(S); o.updateMatrix(); oMesh.setMatrixAt(i, o.matrix); });
    lat.add(oMesh);
    const bonds = [];
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) if (O[i].distanceTo(O[j]) < 2.9) bonds.push([i, j]);
    const bMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.06, 0.06, 1, 6), M.matte(0x9fe9ff, { roughness: 0.4 }), bonds.length);
    const up = new THREE.Vector3(0, 1, 0);
    bonds.forEach(([i, j], n) => {
      const a = O[i].clone().multiplyScalar(S), b = O[j].clone().multiplyScalar(S);
      o.position.copy(a).add(b).multiplyScalar(0.5); o.quaternion.setFromUnitVectors(up, b.clone().sub(a).normalize());
      o.scale.set(1, a.distanceTo(b), 1); o.updateMatrix(); bMesh.setMatrixAt(n, o.matrix);
    });
    o.quaternion.identity(); o.scale.set(1, 1, 1);
    lat.add(bMesh);
    // hydrogens: direct each bond so that no oxygen gives more than two
    const gave = new Array(N).fill(0), order = bonds.map((_, i) => i).sort(() => R() - 0.5), hPos = [];
    order.forEach((bi) => {
      let [i, j] = bonds[bi]; if (R() < 0.5) [i, j] = [j, i];
      let from = gave[i] < 2 ? i : gave[j] < 2 ? j : -1; if (from < 0) return;
      const to = from === i ? j : i; gave[from]++;
      hPos.push(O[from].clone().add(O[to].clone().sub(O[from]).normalize().multiplyScalar(0.96)).multiplyScalar(S));
    });
    const hMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.15, 14, 10), whiteM, hPos.length);
    hPos.forEach((p, i) => { o.position.copy(p); o.updateMatrix(); hMesh.setMatrixAt(i, o.matrix); });
    lat.add(hMesh);
    // a fixed reference: a hexagon and six spokes around the c axis, which do not turn
    const ref = new THREE.Group(); root.add(ref);
    const rh = (A / Math.sqrt(3)) * S, ry = 3.2;
    const hexPts = Array.from({ length: 7 }, (_, i) => new THREE.Vector3(Math.sin((i / 6) * Math.PI * 2) * rh, ry, Math.cos((i / 6) * Math.PI * 2) * rh));
    ref.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(hexPts), new THREE.LineBasicMaterial({ color: COL.amber })));
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2, L = 5.2; ref.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, ry, 0), new THREE.Vector3(Math.sin(a) * L, ry, Math.cos(a) * L)]), new THREE.LineBasicMaterial({ color: COL.amber, transparent: true, opacity: 0.35 }))); }
    ref.add(stage.label('c axis', [0, 5.6, 0], ref));
    ref.add(stage.label('Reference hexagon (does not turn)', [rh + 2.2, ry + 0.2, 0], ref, 'hot'));
    const axis = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -5.2, 0), new THREE.Vector3(0, 5.2, 0)]), new THREE.LineBasicMaterial({ color: COL.amber, transparent: true, opacity: 0.5 }));
    ref.add(axis);

    let lastMode = s.mode, lastTop = s.top, tt = 0;
    const inReel = () => document.body.classList.contains('gb-reel');
    const apply = () => { show(mol, s.mode === 'molecule'); show(cl, s.mode === 'bonds'); show(lat, s.mode === 'lattice'); show(ref, s.mode === 'lattice'); };
    apply();
    const api = {
      look() { if (inReel()) return; if (s.mode === 'lattice') { if (s.top) stage.setView([0, 11.5, 0.01], [0, 0, 0], 0.9); else stage.setView([6, 3.6, 11.5], [0, 0, 0], 0.9); } },
      update(dt, st) {
        tt += dt;
        if (st.mode !== lastMode) {
          lastMode = st.mode; apply();
          if (!inReel()) { const v = st.mode === 'lattice' ? (st.top ? [[0, 11.5, 0.01], [0, 0, 0]] : [[6, 3.6, 11.5], [0, 0, 0]]) : st.mode === 'bonds' ? [[4.6, 2.6, 6.2], [0, 0, 0]] : [[0, 0.8, 6.2], [0, 0.2, 0]]; stage.setView(v[0], v[1], 0.9); }
        }
        if (st.top !== lastTop) { lastTop = st.top; api.look(); }
        hMesh.visible = !!st.hyd && st.mode === 'lattice';
        lat.rotation.y = (st.turn * Math.PI) / 180;
        if (st.spin > 0 && !st.top && st.turn === 0 && !inReel()) root.rotation.y += dt * st.spin * 0.4; else root.rotation.y *= 0.9;
        mol.rotation.y = Math.sin(tt * 0.6) * 0.25;
      },
      readout(st) {
        if (st.mode === 'molecule') return `<div class="big">104.5°</div><p class="r-say">One water molecule in the gas. Oxygen (red) pulls electrons, so it is slightly negative and the hydrogens slightly positive.</p><div class="row"><span>O to H distance</span><b>about 0.96 Å</b></div><div class="row"><span>Perfect tetrahedron</span><b>109.5°</b></div>`;
        if (st.mode === 'bonds') return `<div class="big">4 neighbours</div><p class="r-say">Two hydrogens reach out to neighbours and two neighbours reach in. The dashed lines are hydrogen bonds, about 2.75 Å from oxygen to oxygen in ice.</p>`;
        const m = ((st.turn % 60) + 60) % 60, hit = Math.min(m, 60 - m) < 1.5;
        return `<div class="big">${Math.round(st.turn)}°</div><div class="row"><span>Matches itself?</span><b class="${hit ? 'ok' : 'no'}">${hit ? 'yes' : 'no'}</b></div><p class="r-say">Seen along the c axis the pattern lines up at every multiple of 60°: ${[60, 120, 180, 240, 300, 360].map((x) => x + '°').join(', ')}. ${N} oxygen atoms drawn.</p>`;
      },
    };
    return api;
  },
};

// Chapter 6: the zoo of snow crystal types, and why snow is white. Classification: Nakaya (1930s-50s) first sorted crystals
// by shape; Magono and Lee (1966, Hokkaido University) sorted natural snow crystals into 80 types in eight main groups; Kenneth
// Libbrecht's SnowCrystals.com guide describes the common ones. The models here are simple illustrations of each type.
import { THREE, M } from '../kit.js';
import { flakeMesh, columnMesh, rng, COL, disposeGroup } from '../snow.js';

const TYPES = {
  plate: { n: 'Plate', says: 'A flat hexagon. The simplest crystal that grows on a speck in fairly dry, cold air, often near minus 15 °C or near minus 2 °C.' },
  sector: { n: 'Sectored plate', says: 'A plate with six wedge-shaped sections separated by ribs. Fast growth ran along the ribs.' },
  stellar: { n: 'Stellar plate', says: 'A hexagonal plate that has pushed out six broad arms with a few short side branches.' },
  dendrite: { n: 'Stellar dendrite', says: 'The classic snowflake: long arms with many side branches, best near minus 15 °C in very moist air.' },
  column: { n: 'Column', says: 'A hexagonal pencil of ice that grows near minus 6 °C. The ends can be hollow when growth is fast.' },
  needle: { n: 'Needle', says: 'A very long, thin column. Needles are common in moist air near minus 5 °C.' },
  capped: { n: 'Capped column', says: 'A column that drifted into a different layer of cloud. Plates grew on its ends, like a pair of wheels on an axle.' },
  twelve: { n: 'Twelve-branched', says: 'Twelve arms instead of six. Often two crystals grown together, turned about 30 degrees apart.' },
  rimed: { n: 'Rimed flake', says: 'Tiny supercooled cloud droplets hit the flake and freeze on it. With enough of them it becomes soft hail, called graupel.' },
  rosette: { n: 'Bullet rosette', says: 'Several pencil-shaped columns that grow outward from a shared centre in all directions.' },
  pile: { n: 'A pile of snow', says: 'Each crystal is clear ice. Together, thousands of tiny faces scatter light in every direction, and snow looks white.' },
};
const OPT = Object.entries(TYPES).map(([v, t]) => ({ v, label: t.n }));

export default {
  id: 'types',
  short: 'Types, and why white',
  title: 'Snow crystal types, and why snow is white',
  subtitle: 'Plates, ferns, pencils and bullets: a whole zoo. And the trick that makes clear ice look white.',
  view: { pos: [0, 2.8, 10.5], target: [0, 0.6, 0] },
  learn: `<p>Snowflakes are not all six-armed stars. Nakaya sorted snow crystals by shape in the 1930s onward. In <b>1966</b> <b>Magono and Lee</b> at Hokkaido University published a classification of natural snow crystals with about <b>80 types in eight main groups</b>: needles, columns, plates, combinations, dendrites, rimed crystals, irregular crystals and tiny germs. Newer charts, such as the guide on Kenneth Libbrecht's SnowCrystals.com, have more.</p>
    <p>Most flakes that reach the ground are <b>broken, rimed or clumped</b>. The tidy ones in pictures are a minority that someone took the trouble to find.</p>
    <p><b>Why is snow white?</b> Ice is clear. A single crystal is like a tiny glass bead. But a pile holds a huge number of crystals, and every flat face and edge <b>reflects and bends a little light</b>. The light bounces about inside the pile and leaves in every direction. No colour is favoured, so you see all of them mixed together: white. Crushed glass and sea foam work the same way.</p>
    <p class="tip"><b>Try it:</b> flip through the types, then choose <b>A pile of snow</b> and slide the number of crystals up from one.</p>`,
  terms: [
    { t: 'Rime', d: 'Ice formed when supercooled cloud droplets freeze on contact with a crystal.' },
    { t: 'Graupel', d: 'A soft, pellet-like snow formed when a crystal collects so much rime that its shape is lost.' },
    { t: 'Scattering', d: 'Light bouncing off or through many small surfaces so that it leaves in many directions.' },
    { t: 'Classification', d: 'A system for sorting things into named types. Snow crystal charts have had 41, about 80 and more than 100 types.' },
  ],
  defaults: { type: 'dendrite', count: 400 },
  controls: [
    { key: 'type', type: 'seg', label: 'Type', options: OPT },
    { key: 'count', type: 'log', label: 'Crystals in the pile', min: 1, max: 800, fmt: (v) => `${Math.round(v)}`, hint: 'Only used for “A pile of snow”.' },
  ],
  quiz: [
    { q: 'Why does snow look white even though ice is clear?', options: ['It is dyed white by dust', 'Many small faces scatter all colours of light', 'Cold makes ice white', 'It absorbs red light'], answer: 1, why: 'Every face of every crystal reflects and bends a little light. The light scatters in all directions, and all colours together look white.' },
    { q: 'Magono and Lee (1966) sorted natural snow crystals into about how many types?', options: ['8', '41', '80', '1000'], answer: 2, why: 'About 80 types in eight main groups, published at Hokkaido University in 1966.' },
    { q: 'What is rime?', options: ['A kind of cloud', 'Supercooled droplets frozen onto a crystal', 'Salt on snow', 'Melted snow'], answer: 1, why: 'Cloud droplets can stay liquid below 0 °C. When they hit a crystal they freeze on it. Enough of them makes graupel.' },
  ],
  reel: [
    { ms: 5000, caption: 'Not every flake is a star. There are plates, pencils, needles, bullets and ferns.', set: { type: 'capped', count: 400 }, view: { pos: [0, 2.8, 10.5], target: [0, 0.6, 0] }, spin: 0.5 },
    { ms: 5200, caption: 'And snow is white because a pile of clear ice has countless faces that scatter every colour.', set: { type: 'pile', count: 1 }, view: { pos: [0, 3, 9], target: [0, 0.8, 0] }, anim: { count: [1, 700, true] }, spin: 0.3 },
  ],
  build({ stage, s }) {
    stage.floor.visible = false;
    const root = new THREE.Group(); stage.root.add(root);
    const holder = new THREE.Group(); root.add(holder);
    const flakes = {};
    const getFlake = (k, T, S, size = 4.4) => { if (!flakes[k]) { const f = flakeMesh(size, 768); f.draw({ hist: () => ({ T, S }), rings: false }); flakes[k] = f; } return flakes[k]; };
    const R = rng(21);
    // the pile: transparent hexagonal prisms heaped on a dark plate
    const NP = 800, geo = new THREE.CylinderGeometry(0.16, 0.16, 0.05, 6);
    const pileMat = new THREE.MeshStandardMaterial({ color: 0xeaf4ff, transparent: true, opacity: 0.2, roughness: 0.1, metalness: 0, depthWrite: false, emissive: 0xaec6e6, emissiveIntensity: 0.18 });
    const pile = new THREE.InstancedMesh(geo, pileMat, NP); root.add(pile);
    const o = new THREE.Object3D();
    for (let i = 0; i < NP; i++) {
      const r = Math.sqrt(R()) * 2.7, a = R() * 6.283, y = Math.max(0, (1 - (r / 2.7) ** 2)) * 1.5 * R();
      o.position.set(Math.cos(a) * r, y, Math.sin(a) * r); o.rotation.set(R() * 6.3, R() * 6.3, R() * 6.3); o.scale.setScalar(0.7 + R() * 0.9); o.updateMatrix(); pile.setMatrixAt(i, o.matrix);
    }
    const base = new THREE.Mesh(new THREE.CircleGeometry(3.4, 48), new THREE.MeshStandardMaterial({ color: 0x151a2a, roughness: 0.9 })); base.rotation.x = -Math.PI / 2; base.position.y = -0.04; root.add(base);
    const lbl = stage.label('', [0, -0.2, 3.3], root, 'hot');
    let cur = null, lk = '', t0 = 0, extras = [];
    const clearHolder = () => { [...holder.children].forEach((c) => { holder.remove(c); if (!Object.values(flakes).includes(c)) disposeGroup(c); }); extras = []; };
    const make = (type) => {
      clearHolder(); holder.rotation.set(0, 0, 0); holder.position.set(0, 1.1, 0);
      if (type === 'plate') holder.add(getFlake('plate', -15, 3));
      if (type === 'sector') holder.add(getFlake('sector', -12, 18));
      if (type === 'stellar') holder.add(getFlake('stellar', -15, 13));
      if (type === 'dendrite') holder.add(getFlake('dendrite', -15, 22));
      if (type === 'column') holder.add(columnMesh(3.6, 0.75, true));
      if (type === 'needle') holder.add(columnMesh(7.2, 0.14, false));
      if (type === 'capped') {
        holder.add(columnMesh(3.2, 0.42, false));
        for (const sg of [-1, 1]) { const f = new THREE.Group(); const p = flakeMesh(3.4, 512); p.draw({ hist: () => ({ T: -15, S: 3 }), rings: false }); f.add(p); f.rotation.z = Math.PI / 2; f.position.x = sg * 1.35; holder.add(f); }
      }
      if (type === 'twelve') {
        const a = flakeMesh(4.4, 768), b = flakeMesh(4.4, 768); a.draw({ hist: () => ({ T: -15, S: 22 }), rings: false }); b.draw({ hist: () => ({ T: -15, S: 22 }), rings: false });
        b.rotation.y = Math.PI / 6; b.position.y = 0.08; holder.add(a, b);
      }
      if (type === 'rimed') {
        const f = flakeMesh(4.4, 768); f.draw({ hist: () => ({ T: -15, S: 22 }), rings: false }); holder.add(f);
        const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 8, 6), M.matte(0xf4f8ff, { roughness: 0.6 }), 260);
        for (let i = 0; i < 260; i++) { const k = Math.floor(R() * 6), a = (k * Math.PI) / 3 - Math.PI / 2 + (R() - 0.5) * 0.5, r = 0.35 + R() * 2.2; o.position.set(Math.cos(a) * r, 0.04 + R() * 0.14, Math.sin(a) * r); o.rotation.set(0, 0, 0); o.scale.setScalar(0.5 + R() * 1.2); o.updateMatrix(); dots.setMatrixAt(i, o.matrix); }
        holder.add(dots);
      }
      if (type === 'rosette') {
        for (const ax of [[0, 0, 0], [0, 0, Math.PI / 2], [0, Math.PI / 2, 0]]) { const c = columnMesh(4.2, 0.32, false); c.rotation.set(...ax); holder.add(c); }
      }
      pile.visible = type === 'pile'; base.visible = type === 'pile';
      if (type === 'pile') holder.position.set(0, 0, 0);
      lbl.element.textContent = TYPES[type].n;
      cur = type;
    };
    make(s.type);
    return {
      update(dt, st) {
        t0 += dt;
        if (st.type !== cur) make(st.type);
        pile.count = Math.max(1, Math.round(st.count));
        if (cur === 'pile') { root.rotation.y += dt * 0.15; }
        else {
          root.rotation.y = 0;
          const flat = ['plate', 'sector', 'stellar', 'dendrite', 'twelve', 'rimed'].includes(cur);
          holder.rotation.x = flat ? -0.95 + Math.sin(t0 * 0.5) * 0.06 : 0.35; holder.rotation.y = flat ? Math.sin(t0 * 0.3) * 0.25 : t0 * 0.35;
        }
      },
      readout(st) {
        const t = TYPES[st.type];
        return `<div class="big">${t.n}</div><p class="r-say">${t.says}</p>${st.type === 'pile' ? `<div class="row"><span>Crystals</span><b>${Math.round(st.count)}</b></div><p class="r-say note">${st.count < 8 ? 'Almost clear: a few bits of glass-like ice.' : st.count < 100 ? 'Getting cloudy as the faces add up.' : 'White: light has scattered off so many faces that every colour comes out together.'}</p>` : ''}`;
      },
    };
  },
};

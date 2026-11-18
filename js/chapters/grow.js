// Chapter 2: growing from a speck. This is a real, small model of snow crystal growth: Clifford Reiter's local cellular
// automaton (Chaos, Solitons & Fractals 23:1111, 2005) on a hexagonal grid (see js/ca.js). Two dials do most of the work:
// beta, the background vapour density, and gamma, a little vapour added at the crystal's edge. alpha (diffusion) is fixed
// at 1. It is a cartoon of growth limited by diffusion, not a full physical simulation, and it is the same rule at every
// scale and every cell, which is why the six arms come out alike.
import { THREE, M } from '../kit.js';
import { Reiter } from '../ca.js';

const PRESETS = [
  { label: 'Plate', beta: 0.3, gamma: 0.05 },
  { label: 'Sectored', beta: 0.5, gamma: 0.01 },
  { label: 'Thin star', beta: 0.6, gamma: 0.001 },
  { label: 'Dendrite', beta: 0.4, gamma: 0.001 },
  { label: 'Fern', beta: 0.9, gamma: 0.01 },
];
const MAXI = 11000, CELL = 0.056;

export default {
  id: 'grow',
  short: 'Growing from a speck',
  title: 'Growing from a speck',
  subtitle: 'A small working model: water vapour wanders in, sticks to the crystal, and the arms race ahead.',
  view: { pos: [0, 6.2, 17.5], target: [0, 1.3, 0] },
  learn: `<p>A snow crystal starts as a tiny hexagon of ice, grown on a speck, in air that holds more water vapour than ice can keep. Vapour molecules <b>diffuse</b> through the air and stick to the crystal. A corner sticks out into fresher air, so it catches more vapour and grows faster. That makes it stick out even more. This runaway is called the <b>branching instability</b>.</p>
    <p>The model on the right is a real <b>cellular automaton</b>, after Clifford Reiter (2005). The ice lives on a grid of hexagons. Each step, cells next to ice hold their water, and every other cell shares its water with its six neighbours. A cell becomes ice when it is full. There is no random number anywhere: the same settings always make the same flake.</p>
    <p>Two dials matter. <b>β (beta)</b> is how much vapour the air starts with. <b>γ (gamma)</b> is a little vapour that gets added right at the crystal surface, which helps the edges fill in. Low β grows slow thin arms. High γ fills the gaps and makes plates.</p>
    <p class="tip"><b>Try it:</b> press the presets, then change <b>β</b> and <b>γ</b> by a little. Watch how the shape flips between a plate, a star and a fern. The 3D crystal is the same grid, one hexagonal prism per ice cell.</p>`,
  terms: [
    { t: 'Diffusion', d: 'Molecules spreading out from where there are many to where there are few, by random wandering.' },
    { t: 'Cellular automaton', d: 'A grid of cells that each follow the same simple rule, using only their neighbours. Complex patterns come from it.' },
    { t: 'Supersaturation', d: 'Air holding more water vapour than it could at equilibrium. It is what drives a crystal to grow.' },
    { t: 'Branching instability', d: 'A bump that sticks out reaches fresher vapour, grows faster and sticks out more, so smooth edges break into branches.' },
  ],
  defaults: { beta: 0.4, gamma: 0.001, auto: true, speed: 1, view: 'both', age: 0 },
  controls: [
    { key: 'p', type: 'buttons', label: 'Presets', items: PRESETS.map((p) => ({ label: p.label, act: (s) => { s.beta = p.beta; s.gamma = p.gamma; s._dirty = true; } })) },
    { key: 'beta', type: 'range', label: 'β  vapour density', min: 0.25, max: 0.95, step: 0.01, fmt: (v) => v.toFixed(2), hint: 'The vapour the air holds, as a share of what makes a cell freeze. Less vapour means thinner arms.' },
    { key: 'gamma', type: 'log', label: 'γ  vapour at the edge', min: 0.0001, max: 0.2, fmt: (v) => (v < 0.001 ? v.toFixed(4) : v < 0.01 ? v.toFixed(3) : v.toFixed(2)), hint: 'A little water added to cells touching ice. More of it fills in the gaps between the arms.' },
    { key: 'auto', type: 'toggle', label: 'Keep growing' },
    { key: 'speed', type: 'range', label: 'Speed', min: 0.2, max: 4, step: 0.05, fmt: (v) => `${v.toFixed(1)}×` },
    { key: 'r', type: 'buttons', label: 'Start again', items: [{ label: 'New speck', act: (s) => { s._dirty = true; } }] },
    { key: 'view', type: 'seg', label: 'Show', options: [{ v: 'both', label: '2D and 3D' }, { v: '2d', label: '2D grid' }, { v: '3d', label: '3D' }] },
  ],
  onChange(s, key) { if (key === 'beta' || key === 'gamma') s._dirty = true; },
  quiz: [
    { q: 'Why do the tips of a growing crystal grow fastest?', options: ['They are warmer', 'They poke into fresher, moister air and catch more vapour', 'They are heavier', 'They are pulled by gravity'], answer: 1, why: 'A tip sticks out into air that has not yet been drained of vapour, so it grows faster still. That is the branching instability.' },
    { q: 'In the model, what does raising γ (vapour added at the edge) do?', options: ['Makes the arms thinner', 'Fills in between the arms, giving plates', 'Stops growth', 'Makes the crystal rotate'], answer: 1, why: 'With more water reaching the surface cells, the gaps between arms fill in, and the flake becomes a plate or a broad star.' },
    { q: 'Does the model use random numbers?', options: ['Yes, for every cell', 'No, the same settings always give the same flake', 'Only for the centre', 'Only at the edges'], answer: 1, why: 'The rule is fully deterministic. The six-fold symmetry is built into the hexagonal grid and the identical rule.' },
  ],
  reel: [
    { ms: 7000, caption: 'A speck of ice in damp, cold air. Corners reach the freshest air, so six arms race ahead at the same speed.', set: { beta: 0.4, gamma: 0.001, auto: false, age: 0, view: 'both' }, view: { pos: [0, 6.2, 17.5], target: [0, 1.3, 0] }, anim: { age: [0, 2300] }, spin: 0 },
  ],
  build({ stage, s }) {
    stage.floor.visible = false;
    const root = new THREE.Group(); stage.root.add(root);
    const sim = new Reiter(141, 163);
    sim.reset(s.beta, s.gamma);
    const W = 512, c = document.createElement('canvas'); c.width = c.height = W;
    const g = c.getContext('2d'), tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const slide = new THREE.Group(); root.add(slide); slide.position.set(-5.4, 0.3, 0);
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 7.6), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); slide.add(plane);
    const frame = new THREE.LineSegments(new THREE.EdgesGeometry(plane.geometry), new THREE.LineBasicMaterial({ color: 0x3a4660 })); slide.add(frame);
    slide.add(stage.label('The model: each dot is one hexagonal cell', [0, -4.25, 0], slide));
    const cry = new THREE.Group(); root.add(cry); cry.position.set(4.2, 0, 0); cry.rotation.x = -0.85;
    const mesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.58 * CELL, 0.58 * CELL, 0.2 * CELL * 3, 6), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0, emissive: 0x4a6a88, emissiveIntensity: 0.5 }), MAXI);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.count = 0; cry.add(mesh);
    const lab3 = stage.label('The same cells, as ice', [0, 0, 4.5], cry);
    const o = new THREE.Object3D(), cA = new THREE.Color(0x6fc8ff), cB = new THREE.Color(0xffffff), cc = new THREE.Color();
    let lastRev = -1, lastView = '', acc = 0;

    const redraw = () => {
      g.fillStyle = '#0b1020'; g.fillRect(0, 0, W, W);
      const sc = W / sim.W, sz = sc * 1.18, inv = 1 / Math.max(1, sim.age);
      for (let r = 0; r < sim.H; r++) for (let q = 0; q < sim.W; q++) {
        const i = r * sim.W + q;
        if (sim.s[i] >= 1) {
          const k = 1 - sim.born[i] * inv, h = sim.born[i] ? 1 - 0.65 * k : 1;
          g.fillStyle = `rgb(${Math.round(90 + 165 * h)},${Math.round(180 + 70 * h)},255)`;
          g.fillRect((q + (r & 1) * 0.5) * sc - sz * 0.1, r * 0.866 * sc + (W - sim.H * 0.866 * sc) / 2 - sz * 0.1, sz, sz * 0.96);
        }
      }
      tex.needsUpdate = true;
    };
    const rebuild = () => {
      let n = 0; const inv = 1 / Math.max(1, sim.age);
      for (let r = 0; r < sim.H && n < MAXI; r++) for (let q = 0; q < sim.W && n < MAXI; q++) {
        const i = r * sim.W + q;
        if (sim.s[i] >= 1) {
          const [x, y] = sim.pos(q, r);
          o.position.set(x * CELL, 0, y * CELL); o.updateMatrix(); mesh.setMatrixAt(n, o.matrix);
          const k = sim.born[i] ? sim.born[i] * inv : 0; cc.copy(cA).lerp(cB, k); mesh.setColorAt(n, cc); n++;
        }
      }
      mesh.count = n; mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    };
    redraw(); rebuild();
    const inReel = () => document.body.classList.contains('gb-reel');

    return {
      update(dt, st) {
        if (st._dirty) { st._dirty = false; sim.reset(st.beta, st.gamma); if (!inReel()) st.age = 0; }
        if (st.auto && !inReel() && !sim.done) { st.age += dt * 300 * st.speed; }
        if (sim.beta !== st.beta || sim.gamma !== st.gamma) sim.reset(st.beta, st.gamma);
        sim.advanceTo(Math.floor(st.age));
        if (sim.rev !== lastRev) { lastRev = sim.rev; acc++; redraw(); if (acc % 2 === 0 || sim.done || inReel()) rebuild(); }
        if (st.view !== lastView) {
          lastView = st.view;
          slide.visible = st.view !== '3d'; cry.visible = st.view !== '2d';
          slide.position.x = st.view === 'both' ? -5.4 : 0; cry.position.x = st.view === 'both' ? 4.2 : 0;
          slide.scale.setScalar(st.view === '2d' ? 1.2 : 1); cry.scale.setScalar(st.view === '3d' ? 1.5 : 1.2);
          slide.traverse((x) => { x.visible = st.view !== '3d'; }); cry.traverse((x) => { x.visible = st.view !== '2d'; });
        }
        if (inReel() === false && st.view === '3d') cry.rotation.y += dt * 0.15;
      },
      readout(st) {
        const fill = sim.radius > 1 ? sim.count / (2.598 * sim.radius * sim.radius) : 1;
        const kind = sim.age < 40 ? 'just starting' : fill > 0.9 ? 'a solid plate' : fill > 0.65 ? 'a broad, sectored plate' : fill > 0.45 ? 'a branched dendrite' : 'a thin-armed star';
        return `<div class="big">${kind}</div>
          <div class="row"><span>Steps</span><b>${sim.age}</b></div>
          <div class="row"><span>Ice cells</span><b>${sim.count}</b></div>
          <div class="row"><span>Arm length</span><b>${Math.round(sim.radius)} cells</b></div>
          <div class="row"><span>Filled vs. a solid hexagon</span><b>${Math.round(fill * 100)}%</b></div>
          <p class="r-say">${sim.done ? 'The flake has reached the edge of the grid, so it stops. Press New speck to go again.' : 'β = ' + st.beta.toFixed(2) + ', γ = ' + (st.gamma < 0.001 ? st.gamma.toFixed(4) : st.gamma.toFixed(3)) + '. Same rule in every cell and no random numbers: arms match because the rules are the same.'}</p>`;
      },
    };
  },
};

// Chapter 3: the morphology diagram. In the 1930s Ukichiro Nakaya and colleagues grew snow crystals in a cold lab
// and found that the shape depends mainly on temperature and on how far the air is above saturation. The map below is
// an approximation of the commonly published diagram (plates near -2 and -15 C, needles near -5, columns about -5 to -10,
// dendrites near -15 when the air is very moist, plates or columns below about -22). Real boundaries are fuzzy and differ
// between sources; this is a teaching version, not data.
import { THREE, M } from '../kit.js';
import { habitOf, HABITS, flakeMesh, columnMesh, COL } from '../snow.js';

const LABELS = [[-1, 4, 'plates'], [-4.4, 19, 'needles'], [-3.8, 5, 'columns'], [-8, 14, 'hollow columns'], [-11.2, 5, 'plates'], [-11.2, 18, 'sectors'], [-15, 3.5, 'thin plates'], [-15, 13, 'stellar plates'], [-15, 22, 'dendrites'], [-20, 5, 'plates'], [-20, 18, 'sectors'], [-27, 5, 'plates'], [-27, 18, 'hollow columns']];
const TMAX = 30, SMAX = 25;

export default {
  id: 'nakaya',
  short: 'The shape map',
  title: 'The shape map',
  subtitle: 'Temperature and humidity decide whether you get plates, columns, needles or ferns.',
  view: { pos: [0, 1.6, 15.5], target: [0, 0.9, 0] },
  learn: `<p>In the 1930s, the Japanese physicist <b>Ukichiro Nakaya</b> grew snow crystals in a cold laboratory and changed the temperature and the humidity one at a time. The shapes did not drift smoothly. They <b>flipped</b>: plates, then columns, then plates again as the temperature fell. The result is called the <b>Nakaya diagram</b> or the <b>morphology diagram</b>.</p>
    <p>The commonly published picture, which this model follows roughly: <b>thin plates near minus 2 °C</b>, <b>needles near minus 5 °C</b> in moist air, <b>hollow columns</b> from about minus 5 to minus 10 °C, then <b>plates again near minus 15 °C</b>, where moist air grows the branching <b>dendrites</b>. The vertical axis is <b>how far above saturation</b> the air is, from dry to very moist. More excess vapour means faster, more branched growth.</p>
    <p>Why the shape flips with temperature is still an open question in physics. The boundaries here are approximate, and published diagrams differ in detail.</p>
    <p class="tip"><b>Try it:</b> set humidity high, then slide the temperature from 0 to minus 30. Count how many times the shape changes. Then try the presets.</p>`,
  terms: [
    { t: 'Habit', d: 'The overall shape type of a crystal, such as plate, column or needle. Not the fine detail.' },
    { t: 'Nakaya diagram', d: 'A map of crystal shape against temperature and excess humidity, named for Ukichiro Nakaya.' },
    { t: 'Dendrite', d: 'A branching, fern-like pattern. From the Greek for tree.' },
    { t: 'Saturation', d: 'The most water vapour the air can hold in balance with ice at that temperature. Above it, ice grows.' },
  ],
  defaults: { T: -15, S: 18 },
  controls: [
    { key: 'T', type: 'range', label: 'Temperature', min: -30, max: 0, step: 0.1, fmt: (v) => `${v.toFixed(1)} °C` },
    { key: 'S', type: 'range', label: 'Humidity above ice saturation', min: 0, max: 25, step: 0.5, fmt: (v) => `+${v.toFixed(1)}%`, hint: 'Dry on the left, very moist on the right.' },
    { key: 'j', type: 'buttons', label: 'Jump to', items: [
      { label: 'Plates, −2', act: (s) => { s.T = -2; s.S = 5; } },
      { label: 'Needles, −5', act: (s) => { s.T = -5; s.S = 19; } },
      { label: 'Columns, −8', act: (s) => { s.T = -8; s.S = 6; } },
      { label: 'Thin plates, −15', act: (s) => { s.T = -15; s.S = 3; } },
      { label: 'Dendrites, −15', act: (s) => { s.T = -15; s.S = 22; } },
    ] },
  ],
  quiz: [
    { q: 'Around what temperature do the classic branched dendrites grow best?', options: ['About 0 °C', 'About minus 5 °C', 'About minus 15 °C', 'About minus 40 °C'], answer: 2, why: 'Around minus 15 °C, in very moist air. That is also where thin plates form if the air is drier.' },
    { q: 'As the temperature falls from 0 to minus 10 °C, which order of shapes does the diagram show?', options: ['Plates, then needles and columns', 'Columns, then plates', 'Dendrites, then needles', 'All the same shape'], answer: 0, why: 'Thin plates near minus 2, needles near minus 5, then columns, before the shape goes back to plates near minus 15.' },
    { q: 'What does more humidity above saturation do?', options: ['Slower, simpler growth', 'Faster, more branched growth', 'Nothing', 'Changes crystals into water'], answer: 1, why: 'More excess vapour drives faster growth, and fast growth makes complex, branched shapes.' },
  ],
  reel: [
    { ms: 7000, caption: 'In the 1930s Nakaya grew snow in a cold lab. The shape flips with temperature: plates, needles, columns, then ferns near minus 15.', set: { T: -2, S: 22 }, view: { pos: [0, 1.6, 15.5], target: [0, 0.9, 0] }, anim: { T: [-2, -16, false] }, spin: 0 },
  ],
  build({ stage, s }) {
    stage.floor.visible = false;
    const root = new THREE.Group(); stage.root.add(root);
    const CW = 960, CH = 600, ML = 70, MB = 56, MT = 22, MR = 18;
    const dc = document.createElement('canvas'); dc.width = CW; dc.height = CH;
    const dg = dc.getContext('2d'), dtex = new THREE.CanvasTexture(dc); dtex.colorSpace = THREE.SRGBColorSpace; dtex.anisotropy = 8;
    const diag = new THREE.Mesh(new THREE.PlaneGeometry(9, 5.625), new THREE.MeshBasicMaterial({ map: dtex, toneMapped: false })); diag.position.set(-3.6, 0, 0); root.add(diag);
    const base = document.createElement('canvas'); base.width = CW; base.height = CH;
    const bg = base.getContext('2d');
    const px = (T) => ML + (-T / TMAX) * (CW - ML - MR), py = (S) => CH - MB - (S / SMAX) * (CH - MB - MT);
    // static map
    bg.fillStyle = '#0b1020'; bg.fillRect(0, 0, CW, CH);
    const nx = 120, ny = 60;
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const T = -((i + 0.5) / nx) * TMAX, S = ((j + 0.5) / ny) * SMAX;
      bg.fillStyle = habitOf(T, S).col;
      bg.fillRect(px(-(i / nx) * TMAX), py(((j + 1) / ny) * SMAX), (CW - ML - MR) / nx + 1, (CH - MB - MT) / ny + 1);
    }
    bg.fillStyle = 'rgba(8,12,24,0.45)'; bg.fillRect(ML, MT, CW - ML - MR, CH - MB - MT);
    bg.strokeStyle = '#8fa0c0'; bg.lineWidth = 2; bg.strokeRect(ML, MT, CW - ML - MR, CH - MB - MT);
    bg.fillStyle = '#c8d0e4'; bg.font = '500 20px Geist, sans-serif'; bg.textAlign = 'center';
    for (let T = 0; T >= -30; T -= 5) { bg.fillText(String(T), px(T), CH - MB + 28); bg.fillRect(px(T) - 1, CH - MB, 2, 7); }
    bg.fillText('Temperature (°C)', ML + (CW - ML - MR) / 2, CH - 8);
    bg.save(); bg.translate(18, MT + (CH - MB - MT) / 2); bg.rotate(-Math.PI / 2); bg.fillText('Humidity above ice saturation  →', 0, 0); bg.restore();
    bg.font = '600 17px Geist, sans-serif'; bg.fillStyle = '#ffffff';
    LABELS.forEach(([T, S, t]) => bg.fillText(t, px(T), py(S)));
    const drawDiag = (st) => {
      dg.drawImage(base, 0, 0);
      const x = px(st.T), y = py(st.S);
      dg.strokeStyle = '#ffffff'; dg.lineWidth = 2; dg.setLineDash([6, 6]);
      dg.beginPath(); dg.moveTo(x, MT); dg.lineTo(x, CH - MB); dg.moveTo(ML, y); dg.lineTo(CW - MR, y); dg.stroke(); dg.setLineDash([]);
      dg.fillStyle = '#07080c'; dg.beginPath(); dg.arc(x, y, 11, 0, 7); dg.fill();
      dg.strokeStyle = '#ffffff'; dg.lineWidth = 4; dg.stroke();
      dtex.needsUpdate = true;
    };

    const holder = new THREE.Group(); holder.position.set(5.5, 0, 0); root.add(holder);
    const flake = flakeMesh(5.2); holder.add(flake);
    const mat = new THREE.MeshBasicMaterial();
    let col = null, lastKey = '', t0 = 0, lbl = stage.label('', [0, -3.1, 0], holder, 'hot');
    const rebuild = (st) => {
      const h = habitOf(st.T, st.S), key = `${h.type}${h.hollow}${st.T.toFixed(1)}${st.S.toFixed(1)}`;
      if (key === lastKey) return h; lastKey = key;
      if (col) { holder.remove(col); col.traverse((m) => { m.geometry?.dispose?.(); m.material?.dispose?.(); }); col = null; }
      if (h.type === 'column' || h.type === 'needle') {
        flake.visible = false;
        const len = h.type === 'needle' ? 6.2 : 2.9 + (-st.T - 5.6) * 0.05, rad = h.type === 'needle' ? 0.12 : 0.62;
        col = columnMesh(len, rad, h.hollow); holder.add(col);
      } else { flake.visible = true; flake.draw({ hist: () => ({ T: st.T, S: st.S }), rings: false }); }
      lbl.element.innerHTML = h.n;
      return h;
    };
    rebuild(s); drawDiag(s);
    let ls = `${s.T}${s.S}`;
    return {
      update(dt, st) {
        t0 += dt;
        const k = `${st.T}${st.S}`; if (k !== ls) { ls = k; drawDiag(st); }
        rebuild(st);
        holder.rotation.x = -0.75 + Math.sin(t0 * 0.5) * 0.1; holder.rotation.y = t0 * 0.18;
        if (col) { holder.rotation.x = 0.25; holder.rotation.y = t0 * 0.3; }
      },
      readout(st) {
        const h = habitOf(st.T, st.S);
        return `<div class="big" style="color:${h.col}">${h.n}</div><p class="r-say">${h.says}${h.hollow ? ' The ends are hollow.' : ''}</p>
          <div class="row"><span>Temperature</span><b>${st.T.toFixed(1)} °C</b></div><div class="row"><span>Excess humidity</span><b>+${st.S.toFixed(1)}%</b></div>
          <p class="r-say note">A teaching map, after the commonly published diagram. Real boundaries are fuzzy and differ between sources.</p>`;
      },
    };
  },
};

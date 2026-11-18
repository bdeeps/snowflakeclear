// Shared parts for SnowflakeClear: the habit (shape-type) map after Nakaya, a flake drawing generator that
// grows arms through a changing cloud, and little 3D crystal builders.
import { THREE, M, clamp, lerp, smooth } from './kit.js';

export { clamp, lerp, smooth };
export const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
export const COL = { ice: 0xdff3ff, lime: 0xa3e635, amber: 0xffb547, coral: 0xff7a59, cyan: 0x8ef0ff, violet: 0xc49bff, red: 0xff5d5d, white: 0xf4f8ff };

// ---------------------------------------------------------------- the habit map
// Approximate, after the Nakaya diagram as commonly published. T in degrees C (0 to -30), S = how far the air is
// above ice saturation, in percent (0 to 25). The real boundaries are fuzzy and differ between sources.
export const HABITS = {
  plate: { n: 'Thin plates', col: '#8ef0ff', says: 'Flat hexagons. The corners grow fastest, but at low supersaturation the edges keep up, so the plate stays a plain hexagon.' },
  sector: { n: 'Sectored plates', col: '#c49bff', says: 'A plate with six wedges. Ribs of fast growth run out from the middle, with thin flat sectors between.' },
  stellar: { n: 'Stellar plates', col: '#a3e635', says: 'A hexagon that has put out six broad arms with a few short side branches.' },
  dendrite: { n: 'Stellar dendrites', col: '#ffb547', says: 'Long arms with many side branches, like a fern. The classic snowflake. Needs a lot of excess vapour.' },
  column: { n: 'Columns', col: '#ff7a59', says: 'A hexagonal pencil. The growth along the prism faces beats growth on the end caps. Hollow when the air is very moist.' },
  needle: { n: 'Needles', col: '#ff5d8f', says: 'Very long, very thin columns. They are favoured near minus 5 degrees when the air is well above saturation.' },
};
export function habitOf(T, S) {
  const sn = clamp(S / 25, 0, 1);
  let type, hollow = false;
  if (T > -3.2) type = sn < 0.4 ? 'plate' : 'stellar';
  else if (T > -5.6) type = sn >= 0.45 ? 'needle' : 'column';
  else if (T > -10) { type = 'column'; hollow = sn > 0.5; }
  else if (T > -12.5) type = sn < 0.4 ? 'plate' : 'sector';
  else if (T > -17.5) type = sn < 0.22 ? 'plate' : sn < 0.45 ? 'sector' : sn < 0.62 ? 'stellar' : 'dendrite';
  else if (T > -22) type = sn < 0.4 ? 'plate' : 'sector';
  else { type = sn < 0.45 ? 'plate' : 'column'; hollow = sn > 0.7; }
  return { type, hollow, ...HABITS[type] };
}
// How fast the crystal grows (relative): faster in moist air, with a peak in the plate/dendrite zone near -15.
export function growRate(T, S) {
  const peak = Math.exp(-Math.pow((T + 15) / 3.2, 2));
  return (0.35 + clamp(S, 0, 30) / 14) * (0.55 + 1.1 * peak);
}
// A colour for a temperature, used for the growth rings (warm to cold).
export function tempColor(T) {
  const k = clamp((-T) / 24, 0, 1);
  const stops = [[255, 181, 71], [255, 235, 120], [163, 230, 53], [142, 240, 255], [120, 150, 255], [196, 155, 255]];
  const x = k * (stops.length - 1), i = Math.min(stops.length - 2, Math.floor(x)), f = x - i;
  const c = stops[i].map((v, j) => Math.round(lerp(v, stops[i + 1][j], f)));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

// ---------------------------------------------------------------- the flake drawing
// Draws a six-armed flake on a square canvas. `hist(u)` gives the conditions {T, S} at fall time u (0 to 1).
// All six arms read the same history, so they come out alike. `shield` starves arm 0 of vapour after u = 0.3.
// `noise` adds small random differences between arms (used for the "twins" gallery).
export function drawFlake(g, W, o) {
  const { hist, u1 = 1, shield = 0, rings = true, noise = 0, seed = 1, N = 120 } = o;
  const R = W * 0.455, cx = W / 2, rand = rng(seed);
  g.clearRect(0, 0, W, W);
  const n1 = Math.max(1, Math.ceil(u1 * N));
  const sl = [];
  let G = 0;
  for (let i = 0; i < N; i++) { const c = hist((i + 0.5) / N); G += growRate(c.T, c.S); }
  for (let i = 0; i < n1; i++) { const u = (i + 0.5) / N, c = hist(u); sl.push({ u, c, h: habitOf(c.T, c.S), rate: growRate(c.T, c.S) }); }
  const mul = [], jit = [];
  for (let k = 0; k < 6; k++) { mul.push(k === 0 ? 1 - 0.6 * shield : 1); jit.push(1 + (rand() - 0.5) * 2 * noise); }
  const rad = (k) => { const a = [0]; let r = 0; sl.forEach((s) => { const m = k === 0 && s.u > 0.3 ? mul[0] : 1; r += (s.rate * m * jit[k]) / G * R; a.push(r); }); return a; };
  const rr = [0, 1, 2, 3, 4, 5].map(rad);
  const ang = (k) => (k * Math.PI) / 3 - Math.PI / 2;
  const pt = (k, r) => [cx + Math.cos(ang(k)) * r, cx + Math.sin(ang(k)) * r];
  const col = (s) => (rings ? tempColor(s.c.T) : '#e6f6ff');
  g.lineCap = 'round'; g.lineJoin = 'round';
  // pass 1: plate-like slices fill the ring between the previous and the next hexagon
  sl.forEach((s, i) => {
    const t = s.h.type;
    if (t === 'stellar' && rr[0][i + 1] > R * 0.3) return;
    if (t === 'plate' || t === 'sector' || t === 'stellar') {
      g.fillStyle = col(s);
      g.beginPath();
      for (let k = 0; k < 6; k++) { const p = pt(k, rr[k][i + 1]); k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }
      g.closePath();
      for (let k = 5; k >= 0; k--) { const p = pt(k, rr[k][i]); k === 5 ? g.moveTo(p[0], p[1]) : g.lineTo(p[0], p[1]); }
      g.closePath();
      g.fill('evenodd');
    }
  });
  const lastType = sl.length ? sl[sl.length - 1].h.type : 'plate';
  // pass 2: arms and side branches
  const lines = [];
  sl.forEach((s, i) => {
    const t = s.h.type;
    const wide = t === 'dendrite' ? 4 : t === 'stellar' ? 6.5 : t === 'sector' ? 3.6 : 3;
    for (let k = 0; k < 6; k++) lines.push({ k, a: rr[k][i], b: rr[k][i + 1], w: wide, s });
  });
  lines.forEach((L) => {
    g.strokeStyle = col(L.s); g.lineWidth = L.w * (W / 512) * (L.s.h.type === 'stellar' ? 1.4 : 1);
    const p = pt(L.k, L.a), q = pt(L.k, L.b);
    g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke();
  });
  // side branches: spawn along arms in dendrite and stellar slices, grow as long as the arm kept growing
  sl.forEach((s, i) => {
    const t = s.h.type;
    const every = t === 'dendrite' ? 10 : t === 'stellar' ? 16 : 0;
    if (!every || i % every !== 0 || i < 4) return;
    for (let k = 0; k < 6; k++) {
      const r0 = rr[k][i], tip = rr[k][sl.length];
      const L = Math.min((tip - r0) * 0.4, r0 * 0.6, R * 0.22) * (t === 'dendrite' ? 1 : 0.55);
      if (L < 3) continue;
      for (const sd of [-1, 1]) {
        const a = ang(k) + sd * (Math.PI / 3), x0 = cx + Math.cos(ang(k)) * r0, y0 = cx + Math.sin(ang(k)) * r0;
        g.strokeStyle = col(s); g.lineWidth = (t === 'dendrite' ? 2.8 : 4.2) * (W / 512);
        g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + Math.cos(a) * L, y0 + Math.sin(a) * L); g.stroke();
        if (t === 'dendrite' && L > 14) {
          for (const f of [0.4, 0.72]) for (const sd2 of [-1, 1]) {
            const xs = x0 + Math.cos(a) * L * f, ys = y0 + Math.sin(a) * L * f, a2 = a + sd2 * (Math.PI / 3), L2 = L * (0.38 - 0.18 * f);
            g.lineWidth = 2.4 * (W / 512);
            g.beginPath(); g.moveTo(xs, ys); g.lineTo(xs + Math.cos(a2) * L2, ys + Math.sin(a2) * L2); g.stroke();
          }
        }
      }
    }
  });
  // sector gaps: cut a wedge out of each of the six sectors, leaving ribs and a thin rim
  if (lastType === 'sector') {
    g.save(); g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000';
    for (let k = 0; k < 6; k++) {
      const ta = pt(k, rr[k][sl.length]), tb = pt((k + 1) % 6, rr[(k + 1) % 6][sl.length]);
      const at = (f) => [cx + (ta[0] + (tb[0] - ta[0]) * f - cx) * 0.93, cx + (ta[1] + (tb[1] - ta[1]) * f - cx) * 0.93];
      const a = ang(k) + Math.PI / 6, rm = (rr[k][sl.length] + rr[(k + 1) % 6][sl.length]) / 2, ap = [cx + Math.cos(a) * rm * 0.4, cx + Math.sin(a) * rm * 0.4];
      const p1 = at(0.22), p2 = at(0.78);
      g.beginPath(); g.moveTo(ap[0], ap[1]); g.lineTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); g.closePath(); g.fill();
    }
    g.restore();
  }
  return { radius: rr.map((a) => a[sl.length]), slices: sl };
}

// A flat flake mesh: a few stacked cut-out planes with the drawn texture.
export function flakeMesh(size = 3, W = 512) {
  const c = document.createElement('canvas'); c.width = c.height = W;
  const g = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.25, side: THREE.DoubleSide, roughness: 0.3, metalness: 0, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.4 });
  const grp = new THREE.Group();
  for (const y of [-0.05, 0, 0.05]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat); m.rotation.x = -Math.PI / 2; m.position.y = y * size * 0.5; grp.add(m); }
  grp.canvas = c; grp.g = g; grp.W = W;
  grp.draw = (o) => { const r = drawFlake(g, W, o); tex.needsUpdate = true; return r; };
  return grp;
}

// A hexagonal prism lying along X (a column or a needle): length, radius, hollow ends.
export function columnMesh(len, rad, hollow = false) {
  const grp = new THREE.Group();
  const geo = new THREE.CylinderGeometry(rad, rad, len, 6, 1, false); geo.rotateZ(Math.PI / 2);
  const body = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xdff3ff, transparent: true, opacity: 0.82, roughness: 0.15, metalness: 0, emissive: 0x4a6a88, emissiveIntensity: 0.5 }));
  grp.add(body);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }));
  grp.add(edges);
  if (hollow) {
    for (const s of [-1, 1]) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(rad * 0.62, len * 0.34, 6), new THREE.MeshBasicMaterial({ color: 0x0c1220, transparent: true, opacity: 0.88 }));
      cone.rotation.z = -s * Math.PI / 2; cone.position.x = s * (len / 2 - len * 0.17 + 0.01);
      grp.add(cone);
    }
  }
  return grp;
}

export function disposeGroup(o) {
  o.traverse((m) => { m.geometry?.dispose?.(); const ms = Array.isArray(m.material) ? m.material : m.material ? [m.material] : []; ms.forEach((x) => { x.map?.dispose?.(); x.dispose?.(); }); });
}
export { THREE, M };

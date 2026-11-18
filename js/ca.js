// Reiter's local cellular model of snow-crystal growth (Reiter 2005, Chaos, Solitons & Fractals 23:1111).
// Cells sit on a hexagonal grid (stored as odd-r rows). Each cell holds a "water mass" s.
// A cell is part of the crystal when s >= 1, and "receptive" when it is crystal or touches crystal.
// Each step: receptive cells keep their water and gain gamma (vapour added); the others spread their water
// to their six neighbours (diffusion, alpha). The edge of the grid is held at the background vapour density beta.
export class Reiter {
  constructor(W = 141, H = 163) {
    this.W = W; this.H = H; const n = W * H;
    this.s = new Float32Array(n); this.t = new Float32Array(n); this.v = new Float32Array(n);
    this.rec = new Uint8Array(n); this.born = new Uint16Array(n);
    this.cx = (W - 1) >> 1; this.cy = (H - 1) >> 1; if (this.cy & 1) this.cy++;
    this.dist = new Float32Array(n);
    const px = (c, r) => c + (r & 1) * 0.5, py = (r) => r * 0.8660254;
    const x0 = px(this.cx, this.cy), y0 = py(this.cy);
    for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) this.dist[r * W + c] = Math.hypot(px(c, r) - x0, py(r) - y0);
    this.limit = Math.min(W * 0.5, H * 0.866 * 0.5) - 5;
    this.reset(0.4, 0.001, 1);
  }
  pos(c, r) { return [c + (r & 1) * 0.5 - (this.cx + (this.cy & 1) * 0.5), (r - this.cy) * 0.8660254]; }
  reset(beta, gamma, alpha = 1) {
    this.beta = beta; this.gamma = gamma; this.alpha = alpha; this.age = 0; this.done = false; this.radius = 0; this.count = 1; this.rev = 0;
    this.s.fill(beta); this.born.fill(0); this.s[this.cy * this.W + this.cx] = 1;
  }
  step() {
    if (this.done) return;
    const { W, H, s, t, v, rec, beta, gamma } = this, a2 = this.alpha / 2;
    for (let r = 1; r < H - 1; r++) {
      const odd = r & 1, o1 = odd ? 0 : -1, o2 = odd ? 1 : 0;
      for (let c = 1; c < W - 1; c++) {
        const i = r * W + c;
        const m = s[i] >= 1 || s[i - 1] >= 1 || s[i + 1] >= 1 || s[i - W + o1] >= 1 || s[i - W + o2] >= 1 || s[i + W + o1] >= 1 || s[i + W + o2] >= 1;
        rec[i] = m ? 1 : 0; v[i] = m ? 0 : s[i]; t[i] = m ? s[i] + gamma : 0;
      }
    }
    let radius = this.radius, count = 0;
    for (let r = 1; r < H - 1; r++) {
      const odd = r & 1, o1 = odd ? 0 : -1, o2 = odd ? 1 : 0;
      for (let c = 1; c < W - 1; c++) {
        const i = r * W + c;
        const mean = (v[i - 1] + v[i + 1] + v[i - W + o1] + v[i - W + o2] + v[i + W + o1] + v[i + W + o2]) / 6;
        const ns = t[i] + v[i] + a2 * (mean - v[i]);
        if (ns >= 1) { count++; if (s[i] < 1) this.born[i] = Math.min(65535, this.age + 1); if (this.dist[i] > radius) radius = this.dist[i]; }
        s[i] = ns;
      }
    }
    for (let c = 0; c < W; c++) { s[c] = beta; s[(H - 1) * W + c] = beta; }
    for (let r = 0; r < H; r++) { s[r * W] = beta; s[r * W + W - 1] = beta; }
    this.age++; this.radius = radius; this.count = count; this.rev++;
    if (radius >= this.limit) this.done = true;
  }
  advanceTo(n) { if (n < this.age) this.reset(this.beta, this.gamma, this.alpha); while (this.age < n && !this.done) this.step(); }
}

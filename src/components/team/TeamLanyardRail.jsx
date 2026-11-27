import * as React from "react";

// Adapted from the supplied 21st.dev TeamLanyardRail reference.
const RATIO = 96 / 62;
const MAX_W = 124;
const MIN_RAIL_W = 100;
const EM = 11.2;
const RAIL_PITCH_MIN = 1.16;
const RAIL_PITCH_MAX = 1.62;
const CAROUSEL_PITCH = 1.2;
const GAP = 0.07;
const PERSPECTIVE = 900;
const MAX_STRETCH = 64;
const SWING_K = 28;
const SWING_DAMP = 2.2;
const LAG = 0.12;
const REEL_K = 220;
const REEL_ZETA = 0.5;
const REST_Y = [9, -10, 7, -8, 10, -7, 8, -9];
const REST_Z = [-1.6, 1.2, -2, 1.5, -1, 1.8, -1.3, 2];
const DROPS = [6, 20, 0, 13, 22, 4, 16, 9];
const TONES = ["text-brand-lime", "text-[#a9a5ff]", "text-[#c7d6ff]"];
const METAL = "linear-gradient(to right, color-mix(in oklab, var(--lanyard-metal) 70%, black), color-mix(in oklab, var(--lanyard-metal) 22%, white) 38%, var(--lanyard-metal) 70%, color-mix(in oklab, var(--lanyard-metal) 65%, black))";
const PLASTIC = "linear-gradient(180deg, color-mix(in oklab, var(--lanyard-metal) 30%, var(--color-brand-blue)), color-mix(in oklab, var(--lanyard-metal) 72%, var(--color-brand-blue)))";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function soft(distance, max) {
  const knee = max * 0.75;
  if (distance <= knee) return distance;
  return knee + (max - knee) * (1 - Math.exp(-(distance - knee) / (max - knee)));
}

function geometry(W, items) {
  const u = W / MAX_W;
  const H = W * RATIO;
  const railR = Math.max(3, 4.2 * u);
  const railY = 14 + railR;
  const ring = 9 * u;
  const pivotY = railY + ring * 0.8;
  const strapW = Math.max(8, 11 * u);
  const crimp = 6 * u;
  const reel = 21 * u;
  const cordRest = 12 * u;
  const clipH = 13 * u;
  const clipW = 30 * u;
  const base = 56 * u;
  const straps = items.map((item, i) => base + Math.max(0, item.drop ?? DROPS[i % DROPS.length] ?? 0) * u);
  const reelTops = straps.map((len) => pivotY + len + crimp * 0.6);
  const clipTops = reelTops.map((top) => top + reel * 0.82 + cordRest);
  const cardTops = clipTops.map((top) => top + clipH * 0.62);
  const pendulum = cardTops.map((top) => top + H / 2 - pivotY);
  const restLength = pivotY + base + crimp * 0.6 + reel * 0.82 + cordRest + clipH * 0.62 + H / 2 - pivotY;
  const bottom = Math.max(0, ...cardTops.map((top) => top + H));
  return {
    W, H, u, railR, railY, ring, pivotY, strapW, crimp, reel, cordRest, clipH, clipW, straps, reelTops, clipTops, cardTops, pendulum,
    swingK: pendulum.map((len) => (SWING_K * restLength) / len),
    couple: pendulum.map((len) => (0.25 * 57.3) / len),
    maxStretch: Math.round(MAX_STRETCH * Math.min(1, W / 118)),
    height: Math.ceil(bottom + 16 * u + 8),
  };
}

function layoutTargets(width, W, carousel, center, count) {
  if (!carousel) {
    const pitch = clamp((width - 40 - W * 0.6) / Math.max(1, count), W * RAIL_PITCH_MIN, W * RAIL_PITCH_MAX);
    const start = width / 2 - (pitch * (count - 1)) / 2;
    return { xs: Array.from({ length: count }, (_, i) => start + i * pitch), total: 0 };
  }
  const pitch = W * CAROUSEL_PITCH;
  const total = pitch * count;
  const cyclic = count > 2 && total >= width + W * 2;
  const c = center ?? 0;
  const xs = Array.from({ length: count }, (_, i) => {
    let k = i - c;
    if (cyclic) {
      k = ((k % count) + count) % count;
      if (k >= count / 2) k -= count;
    }
    return width / 2 + k * pitch;
  });
  return { xs, total: cyclic ? total : 0 };
}

function emptySim() {
  return {
    x: [], vx: [], px: [], tx: [], sw: [], vsw: [], beta: [], ry: [], vry: [], tr: [], rz: [], vrz: [], tz: [],
    lift: [], vlift: [], tl: [], pop: [], vpop: [], tp: [], st: [], vst: [],
    drag: -1, grab: 0, pull: -1, free: 0, last: 0, raf: 0, carousel: null,
  };
}

function spring(value, velocity, target, i, k, zeta, h) {
  const v = velocity[i] ?? 0;
  const x = value[i] ?? 0;
  const next = v + (-k * (x - target) - 2 * zeta * Math.sqrt(k) * v) * h;
  velocity[i] = next;
  value[i] = x + next * h;
}

function badgeWidth(s, W, i) {
  return W * (1 + 0.08 * (s.pop[i] ?? 0));
}

function minGap(s, W, a, b) {
  return (badgeWidth(s, W, a) + badgeWidth(s, W, b)) / 2 + W * GAP;
}

function stops(s, W, width, count) {
  return [W * 0.32 + badgeWidth(s, W, 0) / 2, width - W * 0.32 - badgeWidth(s, W, count - 1) / 2];
}

function cardEdge(s, g, i, side) {
  const theta = ((s.sw[i] ?? 0) * Math.PI) / 180;
  const psi = (((s.beta[i] ?? 0) + (s.rz[i] ?? 0)) * Math.PI) / 180;
  const scale = 1 + 0.08 * (s.pop[i] ?? 0);
  const clipDepth = (g.clipTops[i] ?? 0) + (s.st[i] ?? 0) - 4 * (s.lift[i] ?? 0) - g.pivotY;
  const offset = (g.cardTops[i] ?? 0) - (g.clipTops[i] ?? 0);
  const cx = (s.x[i] ?? 0) - clipDepth * Math.sin(theta);
  const half = (g.W / 2) * scale * Math.cos(psi) * side;
  return [
    cx + half - offset * scale * Math.sin(psi),
    cx + half - (offset + g.H) * scale * Math.sin(psi),
    clipDepth + offset * scale,
    clipDepth + (offset + g.H) * scale,
  ];
}

function Band({ tone }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-x-0 top-0 block h-[2.15em] ${tone}`}
      style={{ background: "repeating-linear-gradient(135deg, transparent 0 0.45em, color-mix(in oklab, white 10%, transparent) 0.45em 0.56em), linear-gradient(180deg, color-mix(in oklab, currentColor 80%, white), currentColor 72%, color-mix(in oklab, currentColor 86%, black))" }}
    >
      <span className="absolute inset-x-0 bottom-0 h-px bg-black/15" />
    </span>
  );
}

function Hole() {
  return (
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-[0.72em] block h-[0.56em] w-[2.7em] -translate-x-1/2 rounded-full bg-brand-blue"
      style={{ boxShadow: "inset 0 0.09em 0.2em color-mix(in oklab, black 55%, transparent), 0 0.05em 0 color-mix(in oklab, white 30%, transparent)" }}
    />
  );
}

function Finish() {
  return (
    <>
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 block w-[200%] opacity-70" style={{ background: "linear-gradient(100deg, transparent 40%, color-mix(in oklab, white 26%, transparent) 48%, color-mix(in oklab, white 8%, transparent) 52%, transparent 58%)", transform: "translateX(var(--gx, 0%))" }} />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 block bg-black" style={{ opacity: "var(--shade, 0)" }} />
    </>
  );
}

const BadgeFaces = React.memo(function BadgeFaces({ name, year, yearId, tone }) {
  return (
    <span aria-hidden="true" className="contents">
      <span data-face="front" className="absolute inset-0 overflow-hidden rounded-[0.85em] border border-brand-white/30 bg-[#211c8a] text-brand-white [backface-visibility:hidden]" style={{ transform: "translateZ(1px)" }}>
        <Band tone={tone} />
        <Hole />
        <span className="absolute inset-x-[0.45em] inset-y-[2.75em] grid place-content-center text-balance text-center text-[1.85em] font-bold leading-[0.9]">{name}</span>
        <span className="absolute inset-x-0 bottom-0 block border-t border-brand-white/20 bg-brand-blue py-[0.75em] text-center text-[1.15em] font-bold leading-none tracking-[0.08em] text-brand-lime">THE EXCHANGE</span>
        <Finish />
      </span>
      <span data-face="back" className="absolute inset-0 overflow-hidden rounded-[0.85em] border border-brand-white/30 bg-brand-blue [backface-visibility:hidden]" style={{ transform: "rotateY(180deg) translateZ(1px)" }}>
        <Band tone={tone} />
        <Hole />
        <span className="absolute inset-x-[0.6em] bottom-[0.65em] top-[3.05em] flex flex-col items-center justify-center gap-[0.85em] rounded-[0.35em] border border-dashed border-brand-lime/65 bg-[#211c8a] px-[0.45em] text-center">
          <span className="block text-[1.35em] font-bold leading-none tracking-[0.07em] text-brand-lime">THE EXCHANGE</span>
          <span className="block text-balance text-[1.55em] font-semibold leading-none text-brand-white">{name}</span>
          <span id={yearId} className="block whitespace-nowrap text-[1.2em] font-semibold leading-none tracking-wide text-brand-lime">{year}</span>
        </span>
        <Finish />
      </span>
      {[0, 1].map((side) => (
        <span key={side} aria-hidden="true" className="absolute inset-y-[0.85em] block w-[2px]" style={{ [side ? "right" : "left"]: 0, transform: `translateX(${side ? 1 : -1}px) rotateY(90deg)`, background: "color-mix(in oklab, var(--color-brand-white) 30%, #211c8a)" }} />
      ))}
    </span>
  );
});

export default function TeamLanyardRail({ items, label = "Team" }) {
  const instructionsId = React.useId();
  const count = items.length;
  const stageRef = React.useRef(null);
  const slots = React.useRef([]);
  const swings = React.useRef([]);
  const straps = React.useRef([]);
  const cords = React.useRef([]);
  const hangs = React.useRef([]);
  const buttons = React.useRef([]);
  const flips = React.useRef([]);
  const shadows = React.useRef([]);
  const sim = React.useRef(emptySim());
  const [size, setSize] = React.useState({ width: 0, W: MAX_W, carousel: false });
  const [focusIndex, setFocusIndex] = React.useState(0);
  const [reduced, setReduced] = React.useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const pendingOpen = React.useRef(-1);
  const pointer = React.useRef({ id: -1, index: -1, x: 0, y: 0, mode: "", kind: "", lastX: 0, lastT: 0, v: 0, swipe: 0, hoverX: 0, hoverT: 0, hoverHit: -1 });
  const [active, setActiveIndex] = React.useState(null);
  const [flipped, setFlipped] = React.useState(null);
  const geo = React.useMemo(() => geometry(size.W, items), [size.W, items]);
  const live = React.useRef({ active, flipped, size, geo, reduced, count, focusIndex, cyclic: false });

  React.useLayoutEffect(() => {
    Object.assign(live.current, { active, flipped, size, geo, reduced, count, focusIndex });
  }, [active, flipped, size, geo, reduced, count, focusIndex]);

  const setActive = React.useCallback((index) => {
    const L = live.current;
    if (L.active === index) return;
    if (L.size.carousel && L.flipped !== index) setFlipped(null);
    L.active = index;
    setActiveIndex(index);
  }, []);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  React.useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = (width) => {
      const n = Math.max(1, live.current.count);
      const railW = Math.min(MAX_W, (width - 40) / (n * RAIL_PITCH_MIN + 0.4));
      const carousel = railW < MIN_RAIL_W;
      const W = Math.round((carousel ? clamp(width * 0.3, 96, 118) : railW) * 4) / 4;
      setSize((old) => (Math.abs(old.width - width) < 0.5 && old.carousel === carousel && old.W === W ? old : { width, W, carousel }));
    };
    measure(stage.clientWidth);
    const observer = new ResizeObserver((entries) => { const box = entries[0]; if (box) measure(box.contentRect.width); });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [count]);

  const paint = React.useCallback((i) => {
    const s = sim.current;
    const g = live.current.geo;
    const slot = slots.current[i];
    if (!slot) return;
    if (live.current.size.carousel) {
      // Fade badges out while they still fit rather than cutting through their faces at the edge.
      const x = s.x[i] ?? 0;
      const clearance = Math.min(x, live.current.size.width - x) - g.W * 0.57;
      slot.style.opacity = String(clamp(clearance / 18, 0, 1));
    } else {
      slot.style.opacity = "";
    }
    slot.style.transform = `translate3d(${((s.x[i] ?? 0) - g.W / 2).toFixed(2)}px,0,0)`;
    const sw = s.sw[i] ?? 0;
    const swing = swings.current[i];
    if (swing) swing.style.transform = `rotate(${sw.toFixed(3)}deg)`;
    const st = s.st[i] ?? 0;
    straps.current[i]?.style.setProperty("--stretch", `${st.toFixed(2)}px`);
    const cord = cords.current[i];
    if (cord) cord.style.transform = `scaleY(${Math.max(0.12, (g.cordRest + st) / g.cordRest).toFixed(4)})`;
    const lift = s.lift[i] ?? 0;
    const pop = s.pop[i] ?? 0;
    const hang = hangs.current[i];
    if (hang) hang.style.transform = `translate3d(0,${(st - 4 * lift).toFixed(2)}px,0) rotate(${((s.beta[i] ?? 0) - sw + (s.rz[i] ?? 0)).toFixed(3)}deg) scale(${(1 + 0.08 * pop).toFixed(4)})`;
    const ry = s.ry[i] ?? 0;
    const flip = flips.current[i];
    const facing = Math.abs(Math.cos((ry * Math.PI) / 180));
    if (flip) {
      flip.style.transform = `perspective(${PERSPECTIVE}px) rotateY(${ry.toFixed(2)}deg)`;
      flip.style.setProperty("--shade", ((1 - facing) * 0.45).toFixed(3));
      const phi = ((((ry + 90) % 180) + 180) % 180) - 90;
      flip.style.setProperty("--gx", `${(phi * 0.9).toFixed(1)}%`);
    }
    const shadow = shadows.current[i];
    if (shadow) {
      shadow.style.transform = `translate3d(${(g.W * 0.045 + lift * 3 * g.u).toFixed(2)}px,${(g.H * 0.03 + lift * 7 * g.u).toFixed(2)}px,0) scale(${(Math.max(0.12, facing) * (1 + 0.03 * lift + 0.05 * pop)).toFixed(3)},${(1 + 0.03 * lift + 0.05 * pop).toFixed(3)})`;
      shadow.style.opacity = (0.72 + 0.28 * lift).toFixed(3);
    }
  }, []);

  const step = React.useCallback(function frame(now) {
    const s = sim.current;
    const L = live.current;
    const n = L.count;
    const g = L.geo;
    const { width, carousel } = L.size;
    const dt = s.last ? Math.min(0.1, (now - s.last) / 1000) : 1 / 60;
    s.last = now;
    // sub-steps of at most ~6 ms keep the springs accurate when frames arrive slowly (60 fps → 3)
    const sub = Math.max(3, Math.ceil(dt / 0.006));
    const h = dt / sub;
    let busy = false;
    for (let k = 0; k < sub; k++) {
      for (let i = 0; i < n; i++) {
        const before = s.vx[i] ?? 0;
        if (i !== s.drag) {
          const restoring = now > s.free;
          const ax = restoring ? -130 * ((s.x[i] ?? 0) - (s.tx[i] ?? 0)) - 2 * Math.sqrt(130) * 0.86 * before : -3.2 * before;
          s.vx[i] = before + ax * h;
          s.x[i] = (s.x[i] ?? 0) + (s.vx[i] ?? 0) * h;
        }
      }
      if (!carousel && n > 0) {
        const [left, right] = stops(s, g.W, width, n);
        if (s.drag >= 0) {
          const d = s.drag;
          for (let j = d - 1; j >= 0; j--) {
            const limit = (s.x[j + 1] ?? 0) - minGap(s, g.W, j, j + 1);
            if ((s.x[j] ?? 0) > limit) { s.x[j] = limit; s.vx[j] = Math.min(s.vx[j] ?? 0, s.vx[j + 1] ?? 0); }
          }
          for (let j = d + 1; j < n; j++) {
            const limit = (s.x[j - 1] ?? 0) + minGap(s, g.W, j - 1, j);
            if ((s.x[j] ?? 0) < limit) { s.x[j] = limit; s.vx[j] = Math.max(s.vx[j] ?? 0, s.vx[j - 1] ?? 0); }
          }
        } else {
          for (let pass = 0; pass < 3; pass++) {
            for (let j = 0; j < n - 1; j++) {
              const a = s.x[j] ?? 0;
              const b = s.x[j + 1] ?? 0;
              const overlap = minGap(s, g.W, j, j + 1) - (b - a);
              if (overlap <= 0) continue;
              s.x[j] = a - overlap / 2;
              s.x[j + 1] = b + overlap / 2;
              const va = s.vx[j] ?? 0;
              const vb = s.vx[j + 1] ?? 0;
              if (va > vb) { const shared = (va + vb) / 2; s.vx[j] = shared; s.vx[j + 1] = shared; }
            }
          }
          if ((s.x[0] ?? 0) < left) { s.x[0] = left; s.vx[0] = Math.abs(s.vx[0] ?? 0) * 0.3; }
          for (let j = 1; j < n; j++) s.x[j] = Math.max(s.x[j] ?? 0, (s.x[j - 1] ?? 0) + minGap(s, g.W, j - 1, j));
          if ((s.x[n - 1] ?? 0) > right) { s.x[n - 1] = right; s.vx[n - 1] = -Math.abs(s.vx[n - 1] ?? 0) * 0.3; }
          for (let j = n - 2; j >= 0; j--) s.x[j] = Math.min(s.x[j] ?? 0, (s.x[j + 1] ?? 0) - minGap(s, g.W, j, j + 1));
        }
      }
      for (let i = 0; i < n; i++) {
        const dv = (s.vx[i] ?? 0) - (s.px[i] ?? 0);
        s.px[i] = s.vx[i] ?? 0;
        if (i !== s.pull) {
          const sw = s.sw[i] ?? 0;
          const vsw = clamp((s.vsw[i] ?? 0) + (g.couple[i] ?? 0.07) * clamp(dv, -900, 900), -90, 90);
          const next = vsw + (-(g.swingK[i] ?? SWING_K) * sw - SWING_DAMP * vsw) * h;
          s.vsw[i] = next;
          s.sw[i] = clamp(sw + next * h, -18, 18);
        }
        s.beta[i] = (s.beta[i] ?? 0) + ((s.sw[i] ?? 0) - (s.beta[i] ?? 0)) * Math.min(1, h / LAG);
        spring(s.ry, s.vry, s.tr[i] ?? 0, i, 170, 0.62, h);
        spring(s.rz, s.vrz, s.tz[i] ?? 0, i, 120, 0.8, h);
        spring(s.lift, s.vlift, s.tl[i] ?? 0, i, 200, 0.75, h);
        spring(s.pop, s.vpop, s.tp[i] ?? 0, i, 160, 0.55, h);
        if (i !== s.pull) {
          spring(s.st, s.vst, 0, i, REEL_K, REEL_ZETA, h);
          s.st[i] = Math.max(-g.cordRest * 0.85, s.st[i] ?? 0);
        }
      }
      for (let a = 0; a < n - 1; a++) {
        const b = a + 1;
        if ((s.x[b] ?? 0) <= (s.x[a] ?? 0)) continue;
        const [aTop, aBottom, aArmTop, aArmBottom] = cardEdge(s, g, a, 1);
        const [bTop, bBottom, bArmTop, bArmBottom] = cardEdge(s, g, b, -1);
        const topExcess = aTop - bTop + 2;
        const bottomExcess = aBottom - bBottom + 2;
        const excess = Math.max(topExcess, bottomExcess);
        if (excess <= 0) continue;
        const arm = Math.max(40, topExcess > bottomExcess ? (aArmTop + bArmTop) / 2 : (aArmBottom + bArmBottom) / 2);
        const push = (Math.asin(clamp(excess / arm, 0, 1)) * 180) / Math.PI;
        const share = a === s.pull ? 0 : b === s.pull ? 1 : 0.5;
        s.sw[a] = clamp((s.sw[a] ?? 0) + push * share, -18, 18);
        s.beta[a] = (s.beta[a] ?? 0) + push * share;
        s.sw[b] = clamp((s.sw[b] ?? 0) - push * (1 - share), -18, 18);
        s.beta[b] = (s.beta[b] ?? 0) - push * (1 - share);
        const va = s.vsw[a] ?? 0;
        const vb = s.vsw[b] ?? 0;
        if (vb - va > 0) {
          const mean = (va + vb) / 2;
          if (a !== s.pull) s.vsw[a] = mean + (vb - va) * 0.15;
          if (b !== s.pull) s.vsw[b] = mean - (vb - va) * 0.15;
        }
      }
    }
    for (let i = 0; i < n; i++) {
      paint(i);
      if (
        Math.abs(s.vx[i] ?? 0) > 0.4 || (now > s.free && Math.abs((s.x[i] ?? 0) - (s.tx[i] ?? 0)) > 0.25) ||
        Math.abs((s.ry[i] ?? 0) - (s.tr[i] ?? 0)) > 0.05 || Math.abs(s.vry[i] ?? 0) > 0.05 ||
        Math.abs((s.rz[i] ?? 0) - (s.tz[i] ?? 0)) > 0.02 || Math.abs(s.vrz[i] ?? 0) > 0.05 ||
        Math.abs((s.lift[i] ?? 0) - (s.tl[i] ?? 0)) > 0.002 || Math.abs(s.vlift[i] ?? 0) > 0.01 ||
        Math.abs((s.pop[i] ?? 0) - (s.tp[i] ?? 0)) > 0.002 || Math.abs(s.vpop[i] ?? 0) > 0.01 ||
        Math.abs(s.sw[i] ?? 0) > 0.02 || Math.abs(s.vsw[i] ?? 0) > 0.05 || Math.abs((s.beta[i] ?? 0) - (s.sw[i] ?? 0)) > 0.01 ||
        Math.abs(s.st[i] ?? 0) > 0.05 || Math.abs(s.vst[i] ?? 0) > 0.1
      ) busy = true;
    }
    if (s.drag >= 0 || s.pull >= 0 || now < s.free) busy = true;
    if (busy) s.raf = requestAnimationFrame(frame);
    else {
      s.raf = 0;
      s.last = 0;
      for (let i = 0; i < n; i++) {
        if (now > s.free) { s.x[i] = s.tx[i] ?? 0; s.vx[i] = 0; s.px[i] = 0; }
        s.sw[i] = 0; s.vsw[i] = 0; s.beta[i] = 0; s.st[i] = 0; s.vst[i] = 0;
        s.ry[i] = s.tr[i] ?? 0; s.vry[i] = 0; s.rz[i] = s.tz[i] ?? 0; s.vrz[i] = 0;
        s.lift[i] = s.tl[i] ?? 0; s.vlift[i] = 0; s.pop[i] = s.tp[i] ?? 0; s.vpop[i] = 0;
        paint(i);
      }
    }
  }, [paint]);

  const snap = React.useCallback(() => {
    const s = sim.current;
    for (let i = 0; i < live.current.count; i++) {
      s.x[i] = s.tx[i] ?? 0; s.vx[i] = 0; s.px[i] = 0;
      s.sw[i] = 0; s.vsw[i] = 0; s.beta[i] = 0;
      if (i !== s.pull) { s.st[i] = 0; s.vst[i] = 0; }
      s.ry[i] = s.tr[i] ?? 0; s.vry[i] = 0; s.rz[i] = s.tz[i] ?? 0; s.vrz[i] = 0;
      s.lift[i] = s.tl[i] ?? 0; s.vlift[i] = 0; s.pop[i] = s.tp[i] ?? 0; s.vpop[i] = 0;
      paint(i);
    }
  }, [paint]);

  const kick = React.useCallback(() => {
    const s = sim.current;
    if (live.current.reduced) { cancelAnimationFrame(s.raf); s.raf = 0; snap(); return; }
    if (!s.raf) { s.last = 0; s.raf = requestAnimationFrame(step); }
  }, [snap, step]);

  const impulse = React.useCallback((i, amount) => {
    const s = sim.current;
    if (live.current.reduced || i < 0 || i >= live.current.count) return;
    s.vsw[i] = (s.vsw[i] ?? 0) + amount;
    kick();
  }, [kick]);

  const tug = React.useCallback((i, amount) => {
    const s = sim.current;
    if (live.current.reduced || i < 0 || i >= live.current.count) return;
    s.vst[i] = (s.vst[i] ?? 0) + amount;
    kick();
  }, [kick]);

  React.useLayoutEffect(() => {
    if (!size.width) return;
    const s = sim.current;
    const L = live.current;
    const center = size.carousel ? (active ?? focusIndex) : null;
    const { xs, total } = layoutTargets(size.width, size.W, size.carousel, center, count);
    L.cyclic = total > 0;
    const fresh = s.x.length !== count || s.carousel !== size.carousel;
    s.carousel = size.carousel;
    for (let i = 0; i < count; i++) {
      const tx = (xs[i] ?? 0) + (size.carousel ? pointer.current.swipe : 0);
      if (!fresh && total > 0) {
        const shift = Math.round((tx - (s.tx[i] ?? tx)) / total) * total;
        if (shift) s.x[i] = (s.x[i] ?? 0) + shift;
      }
      s.tx[i] = tx;
      const front = flipped === i || active === i;
      s.tr[i] = flipped === i ? 180 : active === i ? 0 : REST_Y[i % REST_Y.length] ?? 0;
      s.tz[i] = front ? 0 : REST_Z[i % REST_Z.length] ?? 0;
      s.tl[i] = front ? 1 : 0;
      s.tp[i] = flipped === i ? 1 : 0;
      if (fresh) {
        s.x[i] = tx; s.vx[i] = 0; s.px[i] = 0; s.sw[i] = 0; s.vsw[i] = 0; s.beta[i] = 0; s.st[i] = 0; s.vst[i] = 0;
        s.ry[i] = s.tr[i] ?? 0; s.vry[i] = 0; s.rz[i] = s.tz[i] ?? 0; s.vrz[i] = 0;
        s.lift[i] = s.tl[i] ?? 0; s.vlift[i] = 0; s.pop[i] = s.tp[i] ?? 0; s.vpop[i] = 0;
      }
    }
    for (const key of ["x", "vx", "px", "tx", "sw", "vsw", "beta", "ry", "vry", "tr", "rz", "vrz", "tz", "lift", "vlift", "tl", "pop", "vpop", "tp", "st", "vst"]) s[key].length = count;
    if (fresh) for (let i = 0; i < count; i++) paint(i);
    kick();
  }, [size, active, flipped, count, focusIndex, paint, kick]);

  React.useEffect(() => { if (reduced) kick(); }, [reduced, kick]);

  const swayed = React.useRef(false);
  const ready = size.width > 0;
  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !ready || reduced || swayed.current) return;

    let timers = [];
    let done;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio < 0.35) return;
      observer.disconnect();
      timers = Array.from({ length: count }, (_, i) => window.setTimeout(() => impulse(i, (i % 2 ? -1 : 1) * (30 - (i % 4) * 3)), 60 + i * 70));
      done = window.setTimeout(() => { swayed.current = true; }, 80 + count * 70);
    }, { threshold: 0.35 });
    observer.observe(stage);

    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(done);
    };
  }, [ready, reduced, count, impulse]);

  React.useEffect(() => () => { cancelAnimationFrame(sim.current.raf); sim.current.raf = 0; }, []);

  const previous = React.useRef({ active: null, flipped: null });
  React.useEffect(() => {
    const old = previous.current;
    const wrap = (i) => (live.current.cyclic ? ((i % count) + count) % count : i);
    if (old.active !== active) {
      if (active !== null) { impulse(wrap(active - 1), 16); impulse(wrap(active + 1), -16); }
      if (old.active !== null) { impulse(wrap(old.active - 1), -6); impulse(wrap(old.active + 1), 6); }
    }
    if (old.flipped !== flipped) {
      if (flipped !== null) { impulse(flipped, flipped % 2 ? 9 : -9); tug(flipped, 70); }
      if (old.flipped !== null) tug(old.flipped, 40);
    }
    previous.current = { active, flipped };
  }, [active, flipped, count, impulse, tug]);

  React.useEffect(() => {
    if (flipped === null) return;
    const onKey = (event) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      const stage = stageRef.current;
      if (stage && event.target instanceof Node && stage.contains(event.target)) return;
      setFlipped(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [flipped, setFlipped]);

  const toggle = React.useCallback((index) => {
    const next = live.current.flipped === index ? null : index;
    if (next !== null) setActive(index);
    setFlipped(next);
  }, [setActive, setFlipped]);

  const retarget = () => {
    const s = sim.current;
    const L = live.current;
    const { xs } = layoutTargets(L.size.width, L.size.W, L.size.carousel, L.active ?? L.focusIndex, L.count);
    for (let i = 0; i < L.count; i++) s.tx[i] = (xs[i] ?? 0) + (L.size.carousel ? pointer.current.swipe : 0);
    if (L.reduced) snap();
    else kick();
  };

  const feasible = (d) => {
    const s = sim.current;
    const L = live.current;
    const W = L.geo.W;
    const n = L.count;
    let [lo, hi] = stops(s, W, L.size.width, n);
    for (let k = 0; k < d; k++) lo += minGap(s, W, k, k + 1);
    for (let k = n - 1; k > d; k--) hi -= minGap(s, W, k - 1, k);
    return [lo, Math.max(lo, hi)];
  };

  const nearest = (clientX, clientY) => {
    const stage = stageRef.current;
    if (!stage) return null;
    const box = stage.getBoundingClientRect();
    const x = clientX - box.left;
    const y = clientY - box.top;
    const g = live.current.geo;
    const s = sim.current;
    if (y < g.railY - 12) return null;
    let best = null;
    let distance = Infinity;
    for (let i = 0; i < live.current.count; i++) {
      if (y > (g.cardTops[i] ?? 0) + g.H + Math.max(0, s.st[i] ?? 0) + 8) continue;
      if (slots.current[i]?.style.opacity === "0") continue;
      const d = Math.abs(x - (s.x[i] ?? 0));
      if (d < g.W / 2 + 6 && d < distance) { best = i; distance = d; }
    }
    return best;
  };

  const onPointerMove = (event) => {
    const p = pointer.current;
    const s = sim.current;
    const L = live.current;
    const stage = stageRef.current;
    const now = performance.now();
    if (p.id === event.pointerId && stage) {
      const dx = event.clientX - p.x;
      const dy = event.clientY - p.y;
      if (!p.mode && Math.hypot(dx, dy) > 8) {
        if (Math.abs(dy) > Math.abs(dx)) p.mode = p.kind !== "touch" && dy > 0 && p.index >= 0 ? "pull" : "none";
        else p.mode = L.size.carousel ? "swipe" : p.index >= 0 && !L.reduced ? "drag" : "none";
        if (p.mode !== "none" && stage.isConnected) stage.setPointerCapture(event.pointerId);
        if (p.mode === "pull") s.pull = p.index;
        if (p.mode === "drag") {
          s.drag = p.index;
          s.grab = event.clientX - stage.getBoundingClientRect().left - (s.x[p.index] ?? 0);
        }
      }
      const elapsed = Math.max(1, now - p.lastT);
      p.v = p.v * 0.6 + ((event.clientX - p.lastX) / elapsed) * 0.4;
      p.lastX = event.clientX;
      p.lastT = now;
      if (p.mode === "pull") {
        const i = p.index;
        s.st[i] = soft(Math.max(0, dy), L.geo.maxStretch);
        s.vst[i] = 0;
        const angle = clamp((-Math.atan2(dx, (L.geo.pendulum[i] ?? 200) + (s.st[i] ?? 0)) * 180) / Math.PI, -16, 16);
        s.vsw[i] = ((angle - (s.sw[i] ?? 0)) / elapsed) * 1000 * 0.5;
        s.sw[i] = angle;
        if (L.reduced) paint(i);
        else kick();
      } else if (p.mode === "drag" && s.drag >= 0) {
        const [lo, hi] = feasible(s.drag);
        s.x[s.drag] = clamp(event.clientX - stage.getBoundingClientRect().left - s.grab, lo, hi);
        s.vx[s.drag] = p.v * 1000;
        s.free = now + 900;
        kick();
      } else if (p.mode === "swipe") {
        p.swipe = dx;
        retarget();
      }
      return;
    }
    if (event.pointerType !== "mouse" || p.id >= 0) return;
    const hit = nearest(event.clientX, event.clientY);
    const hoverV = (event.clientX - p.hoverX) / Math.max(1, now - p.hoverT);
    p.hoverX = event.clientX;
    p.hoverT = now;
    if (L.size.carousel) {
      const center = L.active ?? L.focusIndex;
      if (hit !== null && hit === center && L.active !== hit) { setActive(hit); }
      return;
    }
    if (hit !== null && hit !== p.hoverHit) impulse(hit, clamp(-hoverV * 22, -24, 24));
    p.hoverHit = hit ?? -1;
    if (hit !== null && hit !== L.active) { setActive(hit); }
  };

  const onPointerDown = (event) => {
    if (event.button !== 0) return;
    const hit = nearest(event.clientX, event.clientY);
    const now = performance.now();
    pendingOpen.current = -1;
    pointer.current = { ...pointer.current, id: event.pointerId, index: hit ?? -1, x: event.clientX, y: event.clientY, mode: "", kind: event.pointerType, lastX: event.clientX, lastT: now, v: 0, swipe: 0 };
  };

  const finishPointer = (event, cancelled) => {
    const p = pointer.current;
    if (p.id !== event.pointerId) return;
    const s = sim.current;
    const L = live.current;
    const stage = stageRef.current;
    if (stage?.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    pointer.current = { ...p, id: -1 };
    if (p.mode === "pull") {
      const i = s.pull;
      s.pull = -1;
      if (L.reduced) { s.st[i] = 0; s.vst[i] = 0; s.sw[i] = 0; s.vsw[i] = 0; s.beta[i] = 0; paint(i); }
      else kick();
      return;
    }
    if (p.mode === "drag") {
      s.drag = -1;
      s.free = performance.now() + 700;
      kick();
      return;
    }
    if (p.mode === "swipe") {
      const dx = event.clientX - p.x;
      const n = L.count;
      const current = L.active ?? L.focusIndex;
      const by = !cancelled && (Math.abs(dx) > 40 || Math.abs(p.v) > 0.45) ? (dx < 0 ? 1 : -1) : 0;
      pointer.current.swipe = 0;
      const next = L.cyclic ? (((current + by) % n) + n) % n : clamp(current + by, 0, n - 1);
      if (next === L.active) retarget();
      else setActive(next);
      return;
    }
    if (cancelled || p.mode || p.index < 0) return;
    const selected = L.active ?? (L.size.carousel ? L.focusIndex : null);
    if ((p.kind !== "mouse" || L.size.carousel) && selected !== p.index) setActive(p.index);
    else pendingOpen.current = p.index;
  };

  const onKeyDown = (event) => {
    const L = live.current;
    if (event.key === "Escape") {
      if (L.flipped !== null) { event.preventDefault(); setFlipped(null); }
      return;
    }
    const target = event.target instanceof HTMLElement ? event.target : null;
    const badge = target?.dataset.badge;
    if (event.key === "ArrowDown") {
      if (badge === undefined) return;
      event.preventDefault();
        tug(Number(badge), 300);
      return;
    }
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const from = badge === undefined ? (L.active ?? focusIndex) : Number(badge);
    const next = event.key === "Home" ? 0 : event.key === "End" ? L.count - 1 : clamp(from + (event.key === "ArrowRight" ? 1 : -1), 0, L.count - 1);
    setFocusIndex(next);
    setActive(next);
    buttons.current[next]?.focus({ preventScroll: true });
  };

  const g = geo;
  const W = g.W;
  const base = W / EM;
  const centerIndex = size.carousel ? (active ?? focusIndex) : null;

  return (
    <section
      data-slot="team-lanyard-rail"
      data-mode={size.carousel ? "carousel" : "rail"}
      data-active={active ?? ""}
      data-flipped={flipped ?? ""}
      className="relative isolate w-full font-['Poster_Handjet'] [--lanyard-metal:#aab2d9]"
    >
      <p id={instructionsId} className="sr-only">Press Enter or Space to flip a badge, Escape to turn it back, or use the arrow keys to move along the rail.</p>
      <div
        ref={stageRef}
        data-stage
        role="group"
        aria-label={label}
        aria-roledescription="lanyard rail"
        className="relative w-full touch-pan-y select-none overflow-x-clip"
        style={{ height: g.height + g.maxStretch + 12 }}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={(event) => finishPointer(event, false)}
        onPointerCancel={(event) => finishPointer(event, true)}
        onLostPointerCapture={(event) => {
          if (event.target === event.currentTarget) finishPointer(event, true);
        }}
        onPointerLeave={(event) => {
          if (pointer.current.id === event.pointerId && !event.currentTarget.hasPointerCapture(event.pointerId)) finishPointer(event, true);
          pointer.current.hoverHit = -1;
          if (event.pointerType === "mouse" && pointer.current.id < 0 && !size.carousel && !document.activeElement?.matches("[data-badge]:focus-visible")) setActive(null);
        }}
        onKeyDown={onKeyDown}
      >
        <div aria-hidden="true" data-rail className="pointer-events-none absolute inset-x-0 z-0" style={{ top: g.railY - g.railR, height: g.railR * 2 }}>
          <div className="absolute inset-x-0 h-3 rounded-full bg-brand-white/10 blur-[5px]" style={{ top: g.railR * 2 + 2 }} />
          <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(to bottom, color-mix(in oklab, var(--lanyard-metal) 35%, white) 0%, white 20%, color-mix(in oklab, var(--lanyard-metal) 70%, white) 40%, var(--lanyard-metal) 64%, color-mix(in oklab, var(--lanyard-metal) 55%, black) 100%)", boxShadow: "0 1px 0 color-mix(in oklab, var(--color-brand-white) 18%, transparent)" }} />
          <div className="absolute inset-0 rounded-full opacity-40 mix-blend-overlay" style={{ background: "repeating-linear-gradient(90deg, transparent 0 2px, color-mix(in oklab, white 40%, transparent) 2px 3px, transparent 3px 7px)" }} />
          {!size.carousel && [0, 1].map((side) => (
            <div key={side} className="absolute top-1/2 h-7 w-4 -translate-y-1/2 rounded-[3px]" style={{ [side ? "right" : "left"]: 6, background: "linear-gradient(to right, color-mix(in oklab, var(--lanyard-metal) 60%, white), var(--lanyard-metal) 55%, color-mix(in oklab, var(--lanyard-metal) 60%, black))", boxShadow: "0 3px 6px color-mix(in oklab, var(--color-brand-white) 18%, transparent)" }}>
              <span className="absolute left-1/2 top-1 size-1 -translate-x-1/2 rounded-full bg-brand-white/35" />
              <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-brand-white/35" />
            </div>
          ))}
        </div>

        {items.map((item, i) => {
          const tone = TONES[i % TONES.length];
          const isActive = active === i;
          const isFlipped = flipped === i;
          const yearId = `${instructionsId}-year-${i}`;
          const strap = g.straps[i] ?? 0;
          const reelTop = g.reelTops[i] ?? 0;
          const clipTop = g.clipTops[i] ?? 0;
          const cardOffset = (g.cardTops[i] ?? 0) - clipTop;
          return (
            <div
              key={item.name}
              ref={(node) => { slots.current[i] = node; }}
              data-lanyard={i}
              className={`pointer-events-none absolute left-0 top-0 ${tone}`}
              style={{ width: W, height: g.height, zIndex: isFlipped ? 40 : isActive ? 30 : 10 + i }}
            >
              <span aria-hidden="true" className="absolute block rounded-full" style={{ left: W / 2 - 4.5 * g.u, top: g.railY - g.ring, width: 9 * g.u, height: g.ring * 2, border: `${Math.max(1.6, 2.2 * g.u).toFixed(2)}px solid color-mix(in oklab, var(--lanyard-metal) 45%, white)`, boxShadow: "inset 1px 0 0 color-mix(in oklab, black 25%, transparent), 1px 1px 2px color-mix(in oklab, black 20%, transparent)" }} />
              <span ref={(node) => { swings.current[i] = node; }} data-swing className="absolute inset-0 block" style={{ transformOrigin: `${W / 2}px ${g.pivotY}px` }}>
                <span ref={(node) => { straps.current[i] = node; }} data-strap aria-hidden="true" className="absolute inset-0 block" style={{ "--stretch": "0px" }}>
                  <span className="absolute block bg-black/15 blur-[2px]" style={{ left: W / 2 - g.strapW / 2 + 3 * g.u, top: g.pivotY + 3, width: g.strapW, height: strap }} />
                  <span
                    className="absolute block"
                    style={{
                      left: W / 2 - g.strapW / 2,
                      top: g.pivotY - 2,
                      width: g.strapW,
                      height: strap + 2,
                      background: [
                        "repeating-linear-gradient(135deg, color-mix(in oklab, white 16%, transparent) 0 1px, transparent 1px 3px)",
                        "repeating-linear-gradient(45deg, color-mix(in oklab, black 13%, transparent) 0 1px, transparent 1px 3px)",
                        "linear-gradient(90deg, color-mix(in oklab, currentColor 68%, black) 0%, currentColor 16%, color-mix(in oklab, currentColor 86%, white) 48%, currentColor 80%, color-mix(in oklab, currentColor 66%, black) 100%)",
                      ].join(","),
                    }}
                  >
                    <span className="absolute inset-y-0 left-[1.5px] right-[1.5px] block border-x border-dashed border-white/35" />
                    <span className="absolute inset-x-0 top-0 block bg-black/25" style={{ height: 7 * g.u }} />
                    <span className="absolute inset-x-[2px] block border-t border-dashed border-white/45" style={{ top: 9 * g.u }} />
                  </span>
                  <svg aria-hidden="true" className="absolute overflow-visible" style={{ left: W / 2 - g.strapW * 0.75, top: g.pivotY - 4 * g.u, width: g.strapW * 1.5, height: 8 * g.u }} viewBox="0 0 30 16" preserveAspectRatio="none">
                    <rect x="2" y="3" width="26" height="10" rx="5" fill="none" stroke="color-mix(in oklab, var(--lanyard-metal) 40%, white)" strokeWidth="3" />
                    <path d="M7 4.5 H23" stroke="white" strokeOpacity="0.6" strokeWidth="1" />
                  </svg>
                  <span className="absolute block rounded-[2px]" style={{ left: W / 2 - g.strapW / 2 - 1.5, top: g.pivotY + strap - g.crimp * 0.4, width: g.strapW + 3, height: g.crimp, background: METAL, boxShadow: "0 1px 1.5px color-mix(in oklab, black 30%, transparent)" }} />
                  <span
                    className="absolute block rounded-full"
                    style={{
                      left: W / 2 - g.reel / 2,
                      top: reelTop,
                      width: g.reel,
                      height: g.reel,
                      background: "radial-gradient(circle at 34% 30%, color-mix(in oklab, var(--color-brand-white) 48%, var(--color-brand-blue)) 0%, var(--color-brand-white) 58%, color-mix(in oklab, var(--color-brand-white) 82%, var(--color-brand-blue)) 100%)",
                      boxShadow: "inset 0 -1px 2px color-mix(in oklab, black 40%, transparent), 0 2px 3px color-mix(in oklab, black 28%, transparent)",
                    }}
                  >
                    <span className="absolute inset-[14%] block rounded-full border border-white/20" />
                    <span className="absolute left-1/2 top-1/2 block size-[32%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: METAL }} />
                  </span>
                  <span ref={(node) => { cords.current[i] = node; }} className="absolute block w-[1.5px] bg-brand-white/60" style={{ left: W / 2 - 0.75, top: reelTop + g.reel * 0.82, height: g.cordRest, transformOrigin: "50% 0" }} />
                </span>
                <span ref={(node) => { hangs.current[i] = node; }} data-hang className="absolute left-0 block" style={{ top: clipTop, width: W, height: cardOffset + g.H, transformOrigin: `${W / 2}px 0px` }}>
                  <span aria-hidden="true" className="absolute left-0 block" style={{ top: cardOffset, width: W, height: g.H, filter: `blur(${Math.max(4, 8 * g.u).toFixed(1)}px)` }}>
                    <span ref={(node) => { shadows.current[i] = node; }} data-shadow className="absolute inset-0 block rounded-[10px] bg-black/25" />
                  </span>
                  <button
                    ref={(node) => { buttons.current[i] = node; }}
                    type="button"
                    data-badge={i}
                    data-flipped={isFlipped ? "true" : "false"}
                    data-active={isActive || undefined}
                    tabIndex={i === (centerIndex ?? focusIndex) ? 0 : -1}
                    aria-label={item.name}
                    aria-describedby={isFlipped ? `${yearId} ${instructionsId}` : instructionsId}
                    aria-pressed={isFlipped}
                    className="pointer-events-auto absolute left-0 cursor-pointer rounded-[0.85em] p-0 text-left outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-lime"
                    style={{ top: cardOffset, width: W, height: g.H, fontSize: base }}
                    onFocus={() => { setFocusIndex(i); if (pointer.current.id < 0) { setActive(i); } }}
                    onClick={(event) => { const pending = pendingOpen.current; pendingOpen.current = -1; if (event.detail === 0 || pending === i) toggle(i); }}
                  >
                    <span ref={(node) => { flips.current[i] = node; }} data-flip className="absolute inset-0 block [transform-style:preserve-3d]" style={{ transform: `perspective(${PERSPECTIVE}px) rotateY(${REST_Y[i % REST_Y.length] ?? 0}deg)` }}>
                      <BadgeFaces name={item.name} year={item.year} yearId={yearId} tone={tone} />
                    </span>
                  </button>
                  <span aria-hidden="true" className="pointer-events-none absolute block" style={{ left: W / 2 - g.clipW / 2, top: 0, width: g.clipW, height: g.clipH + 10 * g.u }}>
                    <span className="absolute left-1/2 block -translate-x-1/2 rounded-b-[2px]" style={{ top: g.clipH * 0.7, width: g.clipW * 0.42, height: cardOffset - g.clipH * 0.7 + 0.72 * base + 0.3 * base, background: PLASTIC }} />
                    <span className="absolute inset-x-0 top-0 block" style={{ height: g.clipH, clipPath: "polygon(24% 0, 76% 0, 100% 72%, 94% 100%, 6% 100%, 0 72%)", background: PLASTIC }} />
                    <span className="absolute block bg-white/50" style={{ left: "30%", right: "30%", top: 1, height: 1 }} />
                    <span className="absolute left-1/2 block -translate-x-1/2 rounded-full bg-brand-blue" style={{ top: g.clipH * 0.14, width: g.clipH * 0.34, height: g.clipH * 0.34, boxShadow: "inset 0 1px 1px color-mix(in oklab, black 45%, transparent)" }} />
                  </span>
                </span>
              </span>
            </div>
          );
        })}
      </div>

      {size.carousel && count > 1 && (
        <div className="relative z-10 flex justify-center" role="group" aria-label="Select a team member">
          {items.map((item, i) => (
            <button
              key={item.name}
              type="button"
              aria-label={`Show ${item.name}`}
              aria-current={centerIndex === i}
              onClick={() => setActive(i)}
              className="grid size-8 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-brand-lime"
            >
              <span aria-hidden="true" className={`h-1.5 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${centerIndex === i ? "w-6 bg-brand-lime" : "w-1.5 bg-brand-white/50"}`} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

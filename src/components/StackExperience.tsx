"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * "The Stack": a chip-like block whose four layers stand for what I do.
 * One sticky canvas sits behind the hero and the story steps; scroll position
 * (measured from elements marked data-stop) picks the pose.
 */

type Pose = {
  x: number; y: number; s: number; rx: number; ry: number;
  wire: number; o: number[]; tilt: number; ui: number; flow: number; trace: number; dim: number; ring: number;
};

const Z = [0, 0, 0, 0];
const P: Pose[] = [
  { x: 2.6, y: 0, s: 1, rx: 0.42, ry: 0, wire: 0, o: Z, tilt: 0, ui: 0.15, flow: 0, trace: 0.15, dim: 0, ring: 1 }, // hero
  { x: 2.8, y: -0.2, s: 1.05, rx: 0.38, ry: -0.55, wire: 1, o: Z, tilt: 0, ui: 0, flow: 0, trace: 0, dim: 0, ring: 0 }, // 3D
  { x: 2.8, y: -0.6, s: 0.95, rx: 0.5, ry: -0.75, wire: 0, o: [0, 0.2, 1.0, 2.0], tilt: 0.35, ui: 1, flow: 0, trace: 0, dim: 0, ring: 0 }, // UI
  { x: 2.8, y: -0.7, s: 0.95, rx: 0.3, ry: -0.95, wire: 0, o: [0, 0.75, 1.45, 2.15], tilt: 0.1, ui: 0.45, flow: 1, trace: 0.3, dim: 0, ring: 0 }, // data
  { x: 2.8, y: -0.05, s: 1.1, rx: 0.95, ry: -0.6, wire: 0, o: [0, 2.3, 2.7, 3.1], tilt: 0, ui: 0, flow: 0.25, trace: 1, dim: 1, ring: 0 }, // back-end
  { x: 2.8, y: 0, s: 1.05, rx: 0.4, ry: -0.35, wire: 0, o: Z, tilt: 0, ui: 0.6, flow: 0, trace: 0.6, dim: 0, ring: 0.6 }, // together
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => v * v * (3 - 2 * v);
const mix = (a: number, b: number, f: number) => a + (b - a) * f;

function roundedSlab(w: number, d: number, h: number, r: number, bt: number) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -d / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelThickness: bt, bevelSize: bt, bevelSegments: 3, curveSegments: 6 });
  g.rotateX(-Math.PI / 2); // extrusion now runs along +y, from -bt to h + bt
  return g;
}

export default function StackExperience({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = wrap.current, el = host.current;
    if (!root || !el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL: page still reads fine without the model
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.localClippingEnabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    const canvas = renderer.domElement;
    Object.assign(canvas.style, { width: "100%", height: "100%", display: "block" });
    el.appendChild(canvas);

    const geos: { dispose(): void }[] = [];
    const mats: THREE.Material[] = [];
    const G = <T extends { dispose(): void }>(g: T) => (geos.push(g), g);
    const M = <T extends THREE.Material>(m: T) => (mats.push(m), m);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x070a12, 10, 26);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.3, 10);

    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 5, 4);
    const rim = new THREE.DirectionalLight(0xa78bfa, 2.2);
    rim.position.set(-4, -2, -4);
    scene.add(key, rim);

    // clipping for the wireframe scan: solid keeps x < X, wire keeps x > X
    const solidPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 100);
    const wirePlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -100);

    const baseMat = M(new THREE.MeshStandardMaterial({ color: 0x0b1220, metalness: 0.6, roughness: 0.4, clippingPlanes: [solidPlane] }));
    const dataMat = M(new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.3, roughness: 0.25, emissive: 0x1d4ed8, emissiveIntensity: 0.5, transparent: true, clippingPlanes: [solidPlane] }));
    const glassMat = M(new THREE.MeshStandardMaterial({ color: 0xbfdbfe, metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.22, depthWrite: false, clippingPlanes: [solidPlane] }));
    const capMat = M(new THREE.MeshStandardMaterial({ color: 0xdfe5ee, metalness: 0.95, roughness: 0.22, transparent: true, clippingPlanes: [solidPlane] }));
    const chipMat = M(new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.7, roughness: 0.3, clippingPlanes: [solidPlane] }));
    const edgeMat = M(new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.9, clippingPlanes: [wirePlane] }));

    const BT = 0.04;
    const spec = [
      { w: 3, h: 0.3, r: 0.2, mat: baseMat },
      { w: 2.8, h: 0.08, r: 0.18, mat: dataMat },
      { w: 2.8, h: 0.06, r: 0.18, mat: glassMat },
      { w: 3, h: 0.22, r: 0.22, mat: capMat },
    ];
    const stack = new THREE.Group();
    const layers: THREE.Group[] = [];
    const home: number[] = [];
    let yAcc = 0;
    spec.forEach((sp) => {
      const g = G(roundedSlab(sp.w, sp.w, sp.h, sp.r, BT));
      const L = new THREE.Group();
      L.add(new THREE.Mesh(g, sp.mat));
      L.add(new THREE.LineSegments(G(new THREE.EdgesGeometry(g, 30)), edgeMat));
      home.push(yAcc + BT);
      L.position.y = yAcc + BT;
      yAcc += sp.h + BT * 2 + 0.012;
      stack.add(L);
      layers.push(L);
    });
    stack.position.y = -yAcc / 2;
    const top = (i: number) => spec[i].h + BT; // local y of a layer's top face

    // base: chips and circuit traces
    const chipGeo = G(new THREE.BoxGeometry(0.42, 0.1, 0.42));
    [[-0.8, -0.7], [0.75, -0.75], [-0.75, 0.8], [0.8, 0.7], [0, 0]].forEach(([x, z], i) => {
      const c = new THREE.Mesh(chipGeo, chipMat);
      c.position.set(x, top(0) + 0.05, z);
      if (i === 4) c.scale.set(1.5, 1, 1.5);
      layers[0].add(c);
    });
    const traceA = M(new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    const traceB = M(traceA.clone());
    const segs: number[][] = [[], []];
    const snap = (v: number) => Math.round(v * 5) / 5;
    for (let i = 0; i < 40; i++) {
      let x = snap(Math.random() * 2.4 - 1.2), z = snap(Math.random() * 2.4 - 1.2);
      for (let k = 0; k < 3; k++) {
        const nx = k % 2 ? x : snap(Math.min(1.25, Math.max(-1.25, x + (Math.random() - 0.5) * 1.6)));
        const nz = k % 2 ? snap(Math.min(1.25, Math.max(-1.25, z + (Math.random() - 0.5) * 1.6))) : z;
        segs[i % 2].push(x, top(0) + 0.004, z, nx, top(0) + 0.004, nz);
        x = nx; z = nz;
      }
    }
    [traceA, traceB].forEach((m, i) => {
      const g = G(new THREE.BufferGeometry());
      g.setAttribute("position", new THREE.Float32BufferAttribute(segs[i], 3));
      layers[0].add(new THREE.LineSegments(g, m));
    });

    // UI layer: glowing interface tiles
    const tileMats: THREE.MeshBasicMaterial[] = [];
    const tiles: [number, number, number, number, number][] = [
      [2.3, 0.22, 0, -1.05, 0x60a5fa], [0.5, 1.6, -0.9, 0.2, 0x818cf8],
      [0.55, 0.5, -0.15, -0.4, 0x38bdf8], [0.55, 0.5, 0.55, -0.4, 0x38bdf8],
      [1.25, 0.75, 0.2, 0.55, 0xa78bfa],
    ];
    tiles.forEach(([w, d, x, z, c]) => {
      const m = M(new THREE.MeshBasicMaterial({ color: c, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      tileMats.push(m);
      const t = new THREE.Mesh(G(new THREE.PlaneGeometry(w, d)), m);
      t.rotation.x = -Math.PI / 2;
      t.position.set(x, top(2) + 0.006, z);
      layers[2].add(t);
    });

    // cap: inlaid accent ring
    const ringInlayMat = M(new THREE.MeshBasicMaterial({ color: 0x60a5fa, clippingPlanes: [solidPlane] }));
    const inlay = new THREE.Mesh(G(new THREE.TorusGeometry(0.75, 0.018, 8, 96)), ringInlayMat);
    inlay.rotation.x = -Math.PI / 2;
    inlay.position.y = top(3) + 0.002;
    layers[3].add(inlay);

    // data streams flowing between the layers
    const SN = 260;
    const sPos = new Float32Array(SN * 3);
    const seed = Array.from({ length: SN }, () => [Math.random() * 2.2 - 1.1, Math.random() * 2.2 - 1.1, 0.25 + Math.random() * 0.6, Math.random()]);
    const streamGeo = G(new THREE.BufferGeometry());
    streamGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    const streamMat = M(new THREE.PointsMaterial({ color: 0x93c5fd, size: 0.05, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    stack.add(new THREE.Points(streamGeo, streamMat));

    const rig = new THREE.Group();
    rig.add(stack);
    scene.add(rig);

    // hero dust ring
    const RN = 1200;
    const rPos = new Float32Array(RN * 3);
    for (let i = 0; i < RN; i++) {
      const a = Math.random() * Math.PI * 2, r = 2.9 + Math.random() * 1.2;
      rPos.set([Math.cos(a) * r, (Math.random() - 0.5) * 0.25, Math.sin(a) * r], i * 3);
    }
    const ringGeo = G(new THREE.BufferGeometry());
    ringGeo.setAttribute("position", new THREE.BufferAttribute(rPos, 3));
    const ringMat = M(new THREE.PointsMaterial({ color: 0x60a5fa, size: 0.03, transparent: true, depthWrite: false }));
    const ring = new THREE.Points(ringGeo, ringMat);
    ring.rotation.set(1.25, 0, 0.3);
    rig.add(ring);

    // scan line for the wireframe step
    const scanMat = M(new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    const scan = new THREE.Mesh(G(new THREE.PlaneGeometry(0.03, 4.6)), scanMat);
    scene.add(scan);

    const grid = new THREE.GridHelper(60, 60, 0x1d4ed8, 0x1e293b);
    grid.position.y = -2.8;
    const gridMat = M(grid.material as THREE.Material);
    gridMat.transparent = true;
    gridMat.opacity = 0.4;
    geos.push(grid.geometry);
    scene.add(grid);

    // layout + scroll stops
    let narrow = false;
    let stops: number[] = [];
    const measure = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (w && h) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        narrow = camera.aspect < 1.1;
      }
      stops = Array.from(root.querySelectorAll<HTMLElement>("[data-stop]")).map(
        (s) => s.getBoundingClientRect().top + window.scrollY, // pose i is exact when step i fills the screen
      );
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(root);
    measure();

    const progress = () => {
      const y = window.scrollY;
      for (let i = stops.length - 2; i >= 0; i--) {
        if (y >= stops[i]) return Math.min(i + (y - stops[i]) / (stops[i + 1] - stops[i]), stops.length - 1);
      }
      return 0;
    };

    const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth - 0.5;
      target.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(root);

    const pose = { ...P[0], o: [...Z] };
    const clock = new THREE.Clock();
    let tCur = progress(), raf = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      const raw = clock.getDelta();
      const dt = Math.min(raw, 0.05);
      const time = clock.elapsedTime;
      const k = reduce ? 1 : 1 - Math.pow(0.004, Math.min(raw, 0.25)); // slow devices still catch up
      tCur += (progress() - tCur) * k;
      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;

      P[0].ry = reduce ? -0.5 : -0.5 + Math.sin(time * 0.3) * 0.5; // gentle sway in the hero
      const i = Math.min(Math.floor(tCur), P.length - 2);
      const f = smooth(clamp01((tCur - i - 0.25) / 0.7)); // hold each pose, then ease to the next
      const A = P[i], B = P[i + 1];
      (Object.keys(pose) as (keyof Pose)[]).forEach((key) => {
        if (key === "o") pose.o = A.o.map((v, j) => mix(v, B.o[j], f));
        else (pose[key] as number) = mix(A[key] as number, B[key] as number, f);
      });

      const sx = narrow ? 0 : pose.x * 0.9;
      const sy = narrow ? (i === 0 && f < 0.5 ? 2.15 : 1.75) + pose.y * 0.25 : pose.y;
      const ss = narrow ? pose.s * 0.55 : pose.s * 0.8;
      const bob = reduce ? 0 : Math.sin(time * 0.8) * 0.06;
      rig.position.set(sx, sy + bob, 0);
      rig.scale.setScalar(ss);
      rig.rotation.set(pose.rx + cur.y * 0.2, pose.ry + cur.x * 0.35, 0);

      layers.forEach((L, j) => { L.position.y = home[j] + pose.o[j]; });
      layers[3].rotation.x = -pose.tilt * 0.5;
      layers[2].rotation.x = -pose.tilt * 0.2;

      // wireframe scan: X sweeps from beyond the model to its middle
      const X = mix(3.5, 0, pose.wire) * ss + sx;
      solidPlane.constant = X;
      wirePlane.constant = -X;
      scan.position.set(X, sy, 1);
      scan.scale.y = ss;
      scanMat.opacity = clamp01(pose.wire * 4) * clamp01((1 - pose.wire) * 8 + 0.6);

      const fade = 1 - pose.dim * 0.85;
      dataMat.opacity = 0.9 * fade;
      glassMat.opacity = 0.22 * fade;
      capMat.opacity = fade;
      tileMats.forEach((m, j) => { m.opacity = pose.ui * (0.35 + 0.25 * Math.sin(time * 1.5 + j)) * fade + pose.ui * 0.15; });
      traceA.opacity = pose.trace * (0.55 + 0.45 * Math.sin(time * 2.2));
      traceB.opacity = pose.trace * (0.55 + 0.45 * Math.sin(time * 2.2 + Math.PI));
      ringMat.opacity = 0.7 * pose.ring;
      ring.rotation.z += dt * 0.04;
      streamMat.opacity = pose.flow;

      if (pose.flow > 0.01) {
        const lo = layers[0].position.y + top(0), hi = layers[3].position.y;
        for (let n = 0; n < SN; n++) {
          const [px, pz, sp, ph] = seed[n];
          const u = (ph + time * sp * (n % 2 ? 1 : -1) + 10) % 1; // half flow up, half down
          sPos[n * 3] = px; sPos[n * 3 + 1] = lo + u * (hi - lo); sPos[n * 3 + 2] = pz;
        }
        streamGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div ref={wrap} className="relative">
      <div aria-hidden className="pointer-events-none sticky top-0 -mb-[100svh] h-[100svh] overflow-hidden">
        <div className="stack-glow absolute inset-0" />
        <div ref={host} className="stack-canvas absolute inset-0" />
      </div>
      {children}
    </div>
  );
}

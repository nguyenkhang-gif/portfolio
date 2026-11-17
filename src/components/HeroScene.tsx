"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL: the CSS glow behind the hero still shows
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    el.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b0f1a, 9, 26);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.4, 10);

    const rig = new THREE.Group();
    scene.add(rig);
    const shape = new THREE.Group();
    rig.add(shape);

    // wireframe shell + vertex dots
    const ico = new THREE.IcosahedronGeometry(2.3, 1);
    const wireGeo = new THREE.WireframeGeometry(ico);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.5 });
    shape.add(new THREE.LineSegments(wireGeo, wireMat));
    const dotMat = new THREE.PointsMaterial({ color: 0xbfdbfe, size: 0.08 });
    shape.add(new THREE.Points(ico, dotMat));

    // faceted core
    const coreGeo = new THREE.IcosahedronGeometry(1.35, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      // low metalness: without an env map a metal reads flat
      color: 0x2563eb, metalness: 0.15, roughness: 0.35,
      emissive: 0x0e78f9, emissiveIntensity: 0.08, flatShading: true,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    shape.add(core);

    scene.add(new THREE.AmbientLight(0xffffff, 0.15));
    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(3, 4, 5);
    const fill = new THREE.DirectionalLight(0x60a5fa, 1.2);
    fill.position.set(-5, 1, 3);
    const rim = new THREE.DirectionalLight(0xa78bfa, 3);
    rim.position.set(-4, -3, -3);
    scene.add(key, fill, rim);

    // orbiting particle ring
    const N = 1400;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 3.3 + Math.random() * 1.1 + (Math.random() < 0.15 ? Math.random() * 1.5 : 0);
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.25;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const ringMat = new THREE.PointsMaterial({ color: 0x60a5fa, size: 0.03, transparent: true, opacity: 0.75, depthWrite: false });
    const ring = new THREE.Points(ringGeo, ringMat);
    ring.rotation.set(1.2, 0, 0.35);
    rig.add(ring);

    // blueprint floor
    const grid = new THREE.GridHelper(60, 60, 0x1d4ed8, 0x1e293b);
    grid.position.y = -3.4;
    const gridMat = grid.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.45;
    scene.add(grid);

    let baseY = 0;
    const fit = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const wide = camera.aspect > 1.1;
      baseY = wide ? 0 : 1.3;
      rig.position.set(wide ? 2.6 : 0, baseY, 0);
      rig.scale.setScalar(wide ? 1 : 0.7);
      if (reduce) renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    fit();

    const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth - 0.5;
      target.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const k = 1 - Math.pow(0.002, dt);
      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;
      shape.rotation.y += dt * 0.18;
      shape.rotation.x = Math.sin(t * 0.3) * 0.15;
      core.rotation.y -= dt * 0.35;
      core.rotation.z += dt * 0.12;
      ring.rotation.z += dt * 0.04;
      rig.rotation.x = cur.y * 0.35;
      rig.rotation.y = cur.x * 0.5;
      rig.position.y = baseY + Math.sin(t * 0.8) * 0.08;
      camera.position.z = 10 + Math.min(window.scrollY / window.innerHeight, 1) * 3;
      renderer.render(scene, camera);
    };
    if (!reduce) frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      [ico, wireGeo, coreGeo, ringGeo, grid.geometry].forEach((g) => g.dispose());
      [wireMat, dotMat, coreMat, ringMat, gridMat].forEach((m) => m.dispose());
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={host} aria-hidden className="hero-canvas absolute inset-0" />;
}

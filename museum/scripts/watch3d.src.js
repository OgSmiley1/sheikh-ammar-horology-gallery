// The anatomy watch, in three dimensions. A generic round automatic — no maison's
// design, no logo — built from primitives so every part named on the Watchmaking page
// is a real object that can turn to face the reader, lift away, and glow.
// Bundled by scripts/build-watch3d.mjs into dist/watch3d.js; loaded by app.js only on
// the Watchmaking page, only when the stage nears the viewport, only with WebGL.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial,
  LatheGeometry, Vector2, Vector3, CylinderGeometry, BoxGeometry, TorusGeometry, CircleGeometry,
  ExtrudeGeometry, Shape, Path, CanvasTexture, SRGBColorSpace, PMREMGenerator, ACESFilmicToneMapping,
  Color, TubeGeometry, CatmullRomCurve3, DirectionalLight, HemisphereLight, Raycaster, Vector2 as V2,
  RepeatWrapping
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const TAU = Math.PI * 2;
const GOLD = 0xd8b46a;

// ————— materials —————
const steel = (rough = .2) => new MeshPhysicalMaterial({ color: 0xdedbd5, metalness: 1, roughness: rough, clearcoat: .25 });
const gold = (rough = .26) => new MeshPhysicalMaterial({ color: GOLD, metalness: 1, roughness: rough });
const blued = () => new MeshPhysicalMaterial({ color: 0x1d3a8a, metalness: 1, roughness: .28 });
const ruby = () => new MeshPhysicalMaterial({ color: 0xa3122a, metalness: 0, roughness: .08, clearcoat: 1, sheen: .4 });
// sapphire: a clear, faintly reflective glass; no transmission pass, so phones keep up
const sapphire = () => new MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0, clearcoat: 1, transparent: true, opacity: .14, depthWrite: false, envMapIntensity: 1.4 });

function canvasTex(size, draw, repeat) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(repeat, repeat); }
  return t;
}
const dialTexture = () => canvasTex(1024, (g, s) => {
  const c = s / 2;
  const bg = g.createRadialGradient(c * .8, c * .7, 10, c, c, c);
  bg.addColorStop(0, '#1a2b44'); bg.addColorStop(.7, '#0d1828'); bg.addColorStop(1, '#070d17');
  g.fillStyle = bg; g.fillRect(0, 0, s, s);
  g.translate(c, c);
  for (let i = 0; i < 360; i++) { // sunburst
    g.rotate(TAU / 360);
    g.strokeStyle = `rgba(255,255,255,${i % 2 ? .035 : .06})`;
    g.beginPath(); g.moveTo(0, 20); g.lineTo(0, c); g.stroke();
  }
  g.setTransform(1, 0, 0, 1, 0, 0); g.translate(c, c);
  for (let i = 0; i < 60; i++) { // minute track
    const a = i * TAU / 60, r1 = c * .955, r2 = i % 5 ? c * .925 : c * .9;
    g.strokeStyle = i % 5 ? 'rgba(232,220,196,.55)' : 'rgba(232,220,196,.9)';
    g.lineWidth = i % 5 ? 2 : 4;
    g.beginPath(); g.moveTo(Math.sin(a) * r1, -Math.cos(a) * r1); g.lineTo(Math.sin(a) * r2, -Math.cos(a) * r2); g.stroke();
  }
  g.fillStyle = '#d8bd8a'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '400 92px Amiri, serif'; g.fillText('ع', 0, -c * .45);
  g.font = '500 30px Jost, sans-serif'; g.fillStyle = 'rgba(232,220,196,.85)';
  g.fillText('A J M A N', 0, c * .42);
  g.font = '400 22px Jost, sans-serif'; g.fillStyle = 'rgba(232,220,196,.6)';
  g.fillText('AUTOMATIC', 0, c * .52);
});
const perlage = () => canvasTex(256, (g, s) => {
  g.fillStyle = '#b9b9b6'; g.fillRect(0, 0, s, s);
  for (let y = 0; y < s + 32; y += 22) for (let x = 0; x < s + 32; x += 22) {
    const gr = g.createRadialGradient(x, y, 1, x, y, 16);
    gr.addColorStop(0, 'rgba(255,255,255,.55)'); gr.addColorStop(.6, 'rgba(160,160,158,.25)'); gr.addColorStop(1, 'rgba(90,90,90,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, 16, 0, TAU); g.fill();
  }
}, 4);
const cotes = (tint = '#c9c9c6') => canvasTex(256, (g, s) => {
  g.fillStyle = tint; g.fillRect(0, 0, s, s);
  for (let i = -s; i < s * 2; i += 32) {
    const gr = g.createLinearGradient(i, 0, i + 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,.0)'); gr.addColorStop(.5, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(0,0,0,.18)');
    g.save(); g.translate(i, 0); g.rotate(-Math.PI / 5); g.fillStyle = gr; g.fillRect(0, -s, 32, s * 3); g.restore();
  }
}, 2);

// ————— shapes —————
function gearShape(teeth, r, tooth = .5, hole = .5, club = false) {
  const sh = new Shape();
  for (let i = 0; i < teeth; i++) {
    const a0 = i * TAU / teeth, a1 = a0 + TAU / teeth * .25, a2 = a0 + TAU / teeth * .5, a3 = a0 + TAU / teeth * .75;
    const pt = (rr, a) => [Math.cos(a) * rr, Math.sin(a) * rr];
    const p0 = pt(r - tooth, a0), p1 = pt(r, a1), p2 = pt(r, club ? a1 + .02 : a2), p3 = pt(r - tooth, a3);
    if (i === 0) sh.moveTo(...p0); else sh.lineTo(...p0);
    sh.lineTo(...p1); sh.lineTo(...p2); sh.lineTo(...p3);
  }
  sh.closePath();
  const h = new Path(); h.absarc(0, 0, hole, 0, TAU, true); sh.holes.push(h);
  if (r > 2.4) for (let k = 0; k < 4; k++) { // lightening holes: the wheel's spokes
    const a = k * TAU / 4 + .4, rr = r * .55, w = new Path();
    w.absarc(Math.cos(a) * rr, Math.sin(a) * rr, r * .22, 0, TAU, true); sh.holes.push(w);
  }
  return sh;
}
const extrude = (shape, depth, bevel = .08) => new ExtrudeGeometry(shape, { depth, bevelEnabled: bevel > 0, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 2, curveSegments: 24 });
const lathe = (pts, seg = 128) => { const g = new LatheGeometry(pts.map(([r, z]) => new Vector2(r, z)), seg); g.rotateX(Math.PI / 2); return g; };
function handShape(len, w, tail = 0) {
  const s = new Shape();
  s.moveTo(0, -tail); s.lineTo(w, len * .08); s.lineTo(w * .55, len * .82); s.lineTo(0, len); s.lineTo(-w * .55, len * .82); s.lineTo(-w, len * .08); s.closePath();
  return s;
}

export function mount(stage, { reduced = false, onPick } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'stage3d';
  canvas.setAttribute('aria-hidden', 'true');
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
  scene.add(new HemisphereLight(0xfff6e8, 0x2a2420, .6));
  const key = new DirectionalLight(0xffffff, 1.6); key.position.set(30, 40, 60); scene.add(key);
  const rim = new DirectionalLight(0xd8bd8a, .8); rim.position.set(-40, -10, -50); scene.add(rim);
  const camera = new PerspectiveCamera(28, 1, .1, 1000);
  camera.position.set(0, 0, 120);

  const watch = new Group(); scene.add(watch);
  const parts = {}; // part name → [meshes]
  const add = (part, mesh, parent = watch) => { mesh.userData.part = part; (parts[part] ||= []).push(mesh); parent.add(mesh); return mesh; };

  // case: middle case, lugs, caseback ring
  add('case', new Mesh(lathe([[15.4, -4.6], [18.4, -4.6], [19.5, -3.9], [20.1, -3], [20.1, 1.5], [19.7, 2.3], [16.4, 2.3]]), steel(.18)));
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const lugShape = new Shape(); lugShape.moveTo(-1.3, 0); lugShape.lineTo(1.3, 0); lugShape.lineTo(1.05, 6); lugShape.absarc(0, 6, 1.05, 0, Math.PI); lugShape.closePath();
    const lug = add('case', new Mesh(extrude(lugShape, 3, .6), steel(.16)));
    lug.position.set(sx * 9.4, sy * 17.6, -2.4); lug.rotation.z = sy < 0 ? Math.PI : 0; lug.rotateX(-.28);
  }
  // bezel, with its engraved minute scale
  const bezel = add('bezel', new Mesh(lathe([[16.2, 2.3], [19.7, 2.3], [19.4, 3.3], [17.1, 3.95], [16.2, 3.95]]), steel(.14)));
  for (let i = 0; i < 60; i++) {
    const a = i * TAU / 60, big = i % 5 === 0;
    const m = new Mesh(new BoxGeometry(big ? .5 : .25, big ? 1.5 : .8, .12), gold(.3));
    m.position.set(Math.sin(a) * 18.3, Math.cos(a) * 18.3, 3.62); m.rotation.set(-.28 * Math.cos(a), .28 * Math.sin(a), -a);
    bezel.add(m); m.userData.part = 'bezel';
  }
  // crystal: domed sapphire
  const crystal = add('crystal', new Mesh(lathe([[0, 4.55], [8, 4.45], [13.5, 4.2], [16.3, 3.95], [16.3, 3.2], [0, 3.2]]), sapphire()));
  // dial with applied gold indices
  const dial = add('dial', new Mesh(new CircleGeometry(16.25, 128), new MeshStandardMaterial({ map: dialTexture(), roughness: .45, metalness: .25 })));
  dial.position.z = 1;
  add('dial', new Mesh(lathe([[16.25, 1], [16.4, 2.3], [16.2, 2.3]]), new MeshStandardMaterial({ color: 0x0d1828, roughness: .5 })));
  for (let i = 0; i < 12; i++) {
    const a = i * TAU / 12;
    for (const off of i === 0 ? [-.9, .9] : [0]) {
      const ix = new Mesh(new BoxGeometry(.9, i % 3 ? 2.6 : 3.4, .45), gold(.2));
      const r = 12.6;
      ix.position.set(Math.sin(a) * r + Math.cos(a) * off, Math.cos(a) * r - Math.sin(a) * off, 1.3); ix.rotation.z = -a;
      dial.add(ix); ix.userData.part = 'dial';
    }
  }
  // hands
  const hour = add('hands', new Mesh(extrude(handShape(8.6, .85), .14, .04), gold(.18))); hour.position.z = 1.55;
  const minute = add('hands', new Mesh(extrude(handShape(13, .6), .14, .04), gold(.18))); minute.position.z = 1.8;
  const second = add('hands', new Mesh(extrude(handShape(14.2, .18, 3.4), .08, 0), new MeshPhysicalMaterial({ color: 0xb5493f, metalness: .6, roughness: .3 }))); second.position.z = 2.05;
  add('hands', new Mesh(new CylinderGeometry(.75, .75, .5, 32).rotateX(Math.PI / 2), gold(.2))).position.z = 2.2;
  // crown (knurled) and two pushers
  const crownG = new Group(); crownG.position.set(20.1, 0, -.6); watch.add(crownG);
  const knurl = new CylinderGeometry(2.9, 2.9, 3.4, 48, 1);
  const p = knurl.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), a = Math.atan2(z, x), r = Math.hypot(x, z); if (r > 2) { const k = Math.round(a / (TAU / 48)) % 2 ? 2.62 : 2.9; p.setX(i, Math.cos(a) * k); p.setZ(i, Math.sin(a) * k); } }
  knurl.computeVertexNormals();
  add('crown', new Mesh(new CylinderGeometry(1, 1, 1.8, 24).rotateZ(Math.PI / 2), steel(.2)), crownG).position.x = .8;
  add('crown', new Mesh(knurl.rotateZ(Math.PI / 2), steel(.22)), crownG).position.x = 3.2;
  add('crown', new Mesh(new CylinderGeometry(2.3, 2.3, .4, 48).rotateZ(Math.PI / 2), gold(.2)), crownG).position.x = 4.95;
  for (const a of [.78, -.78]) {
    const pg = new Group(); pg.position.set(Math.cos(a) * 19.7, Math.sin(a) * 19.7, -.6); pg.rotation.z = a; watch.add(pg);
    add('crown', new Mesh(new CylinderGeometry(.7, .7, 1.6, 20).rotateZ(Math.PI / 2), steel(.2)), pg).position.x = .8;
    add('crown', new Mesh(new CylinderGeometry(1.35, 1.35, 1.6, 32).rotateZ(Math.PI / 2), steel(.18)), pg).position.x = 2.2;
  }

  // ————— the movement, seen through the exhibition caseback —————
  const mvt = new Group(); mvt.rotation.y = Math.PI; watch.add(mvt); // its +z faces the caseback
  add('calibre', new Mesh(new CylinderGeometry(15.6, 15.6, 1.2, 96).rotateX(Math.PI / 2), new MeshStandardMaterial({ map: perlage(), color: 0xd0d0cc, metalness: .9, roughness: .38 })), mvt).position.z = -.2;
  const backRing = add('case', new Mesh(lathe([[13.4, -4.4], [15.5, -4.4], [15.5, -5.1], [13.4, -5.1]]), steel(.25)));
  backRing.position.z = 0;
  add('crystal', new Mesh(new CylinderGeometry(13.5, 13.5, .5, 96).rotateX(Math.PI / 2), sapphire())).position.z = -4.85;
  const POS = { barrel: [-5.6, 6.4], center: [0, 0], third: [4.6, 3.8], fourth: [5.8, -2.4], escape: [3.6, -6.6], pallet: [.6, -7.6], balance: [-4.4, -7.8] };
  const at = (m, [x, y], z) => { m.position.set(x, y, z); return m; };
  const barrel = at(add('barrel', new Mesh(extrude(gearShape(64, 5.4, .35, 1), .9, .05), gold(.24)), mvt), POS.barrel, .5);
  add('barrel', new Mesh(new CylinderGeometry(1.4, 1.4, 1.2, 6).rotateX(Math.PI / 2), steel(.25)), barrel).position.z = .9;
  const wheels = [
    at(add('calibre', new Mesh(extrude(gearShape(56, 4.2, .3, .4), .4, .03), gold(.24)), mvt), POS.center, .55),
    at(add('calibre', new Mesh(extrude(gearShape(48, 3.2, .26, .35), .4, .03), gold(.24)), mvt), POS.third, .6),
    at(add('calibre', new Mesh(extrude(gearShape(40, 2.6, .24, .3), .4, .03), gold(.24)), mvt), POS.fourth, .65)
  ];
  const escape = at(add('escapement', new Mesh(extrude(gearShape(15, 1.9, .55, .25, true), .3, .02), blued()), mvt), POS.escape, .7);
  const pallet = new Group(); at(pallet, POS.pallet, .8); mvt.add(pallet);
  const forkShape = new Shape(); forkShape.moveTo(-2.6, .35); forkShape.lineTo(2.2, .35); forkShape.lineTo(2.6, 1.3); forkShape.lineTo(2.9, -.5); forkShape.lineTo(-2.4, -.35); forkShape.lineTo(-2.9, -1.4); forkShape.lineTo(-3.2, .4); forkShape.closePath();
  add('escapement', new Mesh(extrude(forkShape, .25, .02), steel(.18)), pallet);
  for (const x of [2.7, -3]) add('escapement', new Mesh(new BoxGeometry(.35, .9, .35), ruby()), pallet).position.set(x, x > 0 ? .9 : -1, .2);
  const balance = new Group(); at(balance, POS.balance, 1.1); mvt.add(balance);
  add('balance', new Mesh(new TorusGeometry(3.3, .32, 16, 96), gold(.18)), balance);
  for (const a of [0, Math.PI / 2]) add('balance', new Mesh(new BoxGeometry(6.6, .3, .2), gold(.2)), balance).rotation.z = a;
  for (let i = 0; i < 8; i++) { const a = i * TAU / 8; add('balance', new Mesh(new CylinderGeometry(.22, .22, .5, 12).rotateX(Math.PI / 2), gold(.15)), balance).position.set(Math.cos(a) * 3.3, Math.sin(a) * 3.3, 0); }
  const spiral = []; for (let i = 0; i <= 420; i++) { const t = i / 420, a = t * TAU * 8, r = .55 + t * 2.1; spiral.push(new Vector3(Math.cos(a) * r, Math.sin(a) * r, .35)); }
  add('balance', new Mesh(new TubeGeometry(new CatmullRomCurve3(spiral), 840, .045, 5), blued()), balance);
  // bridges with Côtes de Genève, and their jewels
  const bridgeMat = new MeshStandardMaterial({ map: cotes(), color: 0xd6d6d2, metalness: .9, roughness: .3 });
  // skeleton bridges: narrow arms, so the barrel, train and balance stay in view
  const bar = (x1, y1, x2, y2, w) => {
    const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a) * w, ny = Math.cos(a) * w, sh = new Shape();
    sh.moveTo(x1 + nx, y1 + ny); sh.lineTo(x2 + nx, y2 + ny); sh.absarc(x2, y2, w, a + Math.PI / 2, a - Math.PI / 2, true);
    sh.lineTo(x1 - nx, y1 - ny); sh.absarc(x1, y1, w, a - Math.PI / 2, a + Math.PI / 2, true);
    return sh;
  };
  for (const [x1, y1, x2, y2, w, z] of [[-13.4, 9.6, -5.6, 6.4, 1.3, 1.3], [-5.6, 6.4, 1.6, 9.8, 1.1, 1.3], [-2, 13, 6.8, -4.2, 1.2, 1.3], [0, 0, 9.4, 6, 1, 1.3], [12.6, -3, 3.6, -6.6, 1, 1.3], [-12.2, -10.2, -4.4, -7.8, 1.05, 2.2]])
    add('bridges', new Mesh(extrude(bar(x1, y1, x2, y2, w), .6, .12), bridgeMat), mvt).position.z = z;
  for (const [x, y, z] of [[-5.6, 6.4, 2.1], [0, 0, 2.1], [4.6, 3.8, 2.1], [5.8, -2.4, 2.1], [3.6, -6.6, 2.1], [-4.4, -7.8, 2.9], [.6, -7.6, 2.1]])
    add('bridges', new Mesh(new CylinderGeometry(.42, .42, .3, 20).rotateX(Math.PI / 2), ruby()), mvt).position.set(x, y, z);
  for (const [x, y] of [[-9, 9], [7.4, 6.4], [-11, 2], [7, -5], [-9.6, -10]]) add('bridges', new Mesh(new CylinderGeometry(.55, .55, .3, 20).rotateX(Math.PI / 2), blued()), mvt).position.set(x, y, 2.15);
  // rotor
  const rotorShape = new Shape(); rotorShape.absarc(0, 0, 14.6, 0, Math.PI); rotorShape.lineTo(-1.8, 0); rotorShape.absarc(0, 0, 1.8, Math.PI, 0, true); rotorShape.closePath();
  const rotor = add('rotor', new Mesh(extrude(rotorShape, .6, .1), new MeshStandardMaterial({ map: cotes('#d9b56c'), color: 0xe8c47c, metalness: 1, roughness: .25 })), mvt);
  rotor.position.z = 3.1;
  add('rotor', new Mesh(new TorusGeometry(13.9, .7, 12, 64, Math.PI), gold(.2)), rotor).position.z = .3;

  // ————— views: where the watch turns for each part —————
  const B = Math.PI;
  // the rotor's half-disc covers [angle, angle + π]; park it a quarter-turn past the part
  const park = ([x, y]) => Math.atan2(y, x) + Math.PI / 2;
  const VIEWS = {
    overview: { yaw: -.55, pitch: .35, zoom: 1, at: [0, 0, 0] },
    case: { yaw: -.75, pitch: .45, zoom: 1, at: [0, 0, 0] },
    bezel: { yaw: -.25, pitch: .55, zoom: 1.35, at: [0, 4, 3], lift: [bezel, 4] },
    crystal: { yaw: -.3, pitch: .5, zoom: 1.25, at: [0, 0, 3], lift: [crystal, 7] },
    dial: { yaw: 0, pitch: .08, zoom: 1.4, at: [0, 0, 1], lift: [crystal, 7] },
    hands: { yaw: -.08, pitch: .12, zoom: 1.75, at: [0, 2, 1.5], lift: [crystal, 7] },
    crown: { yaw: -1.2, pitch: .22, zoom: 1.9, at: [21, 0, 0] },
    calibre: { yaw: B, pitch: .12, zoom: 1.25, at: [0, 0, -3], rotorPark: park(POS.fourth) },
    escapement: { yaw: B + .15, pitch: .2, zoom: 2.3, at: [-2.2, -7, -3], rotorPark: park(POS.escape) },
    balance: { yaw: B - .15, pitch: .2, zoom: 2.2, at: [4.4, -7.8, -3], rotorPark: park(POS.balance) },
    barrel: { yaw: B, pitch: .2, zoom: 2.4, at: [5.6, 6.4, -3], rotorPark: park(POS.barrel) },
    rotor: { yaw: B + .25, pitch: .35, zoom: 1.2, at: [0, 0, -3], spin: true },
    bridges: { yaw: B - .2, pitch: .3, zoom: 1.5, at: [0, 0, -3], rotorPark: park(POS.third) }
  };
  const view = { yaw: VIEWS.overview.yaw, pitch: VIEWS.overview.pitch, zoom: 1, at: new Vector3() };
  let goal = { ...VIEWS.overview }, picked = null, rotorAngle = .4, rotorGoal = null, last = performance.now(), dragging = false;
  const lifts = new Map([[bezel, 0], [crystal, 0]]);
  const glow = new Color(0x9a7430);

  function select(part) {
    picked = VIEWS[part] ? part : null;
    goal = { ...(VIEWS[part] || VIEWS.overview) };
    rotorGoal = goal.rotorPark == null ? null : rotorAngle + (((goal.rotorPark - rotorAngle) % TAU) + TAU * 1.5) % TAU - Math.PI;
    for (const [name, meshes] of Object.entries(parts)) for (const m of meshes) {
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      for (const mat of mats) if (mat?.emissive) { if (!mat.userData.cloned) { m.material = mat.clone(); m.material.userData.cloned = true; } }
      if (m.material?.emissive) m.material.emissive.copy(name === part ? glow : new Color(0));
    }
    if (reduced) snap();
    wake();
  }
  function snap() { Object.assign(view, { yaw: goal.yaw, pitch: goal.pitch, zoom: goal.zoom }); view.at.set(...goal.at); for (const k of lifts.keys()) lifts.set(k, goal.lift?.[0] === k ? goal.lift[1] : 0); if (rotorGoal != null) rotorAngle = rotorGoal; }

  // ————— time: the hands keep Ajman time (UTC+4) —————
  function setHands(now) {
    const d = new Date(now + 4 * 3600e3), s = d.getUTCSeconds() + (reduced ? 0 : Math.floor(d.getUTCMilliseconds() / 125) / 8), m = d.getUTCMinutes() + s / 60, h = (d.getUTCHours() % 12) + m / 60;
    second.rotation.z = -s * TAU / 60; minute.rotation.z = -m * TAU / 60; hour.rotation.z = -h * TAU / 12;
  }

  // ————— drag to turn; a tap picks the part under the finger —————
  let px = 0, py = 0, moved = 0, vx = 0, vy = 0;
  canvas.addEventListener('pointerdown', e => { dragging = true; moved = 0; px = e.clientX; py = e.clientY; canvas.setPointerCapture(e.pointerId); wake(); });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
    vx = dx * .01; vy = dy * .01; goal.yaw += vx; goal.pitch = Math.max(-1.3, Math.min(1.3, goal.pitch + vy)); view.yaw = goal.yaw; view.pitch = goal.pitch; wake();
  });
  const ray = new Raycaster(), ndc = new V2();
  canvas.addEventListener('pointerup', e => {
    dragging = false;
    if (moved > 6) return;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObject(watch, true).find(h => h.object.userData.part && h.object.material && !(h.object.userData.part === 'crystal'));
    if (hit && onPick) onPick(hit.object.userData.part);
  });
  canvas.addEventListener('pointercancel', () => { dragging = false; });

  // ————— the loop runs only while the stage is on screen —————
  let raf = 0, visible = true;
  function size() {
    const w = stage.clientWidth, h = stage.clientHeight || w;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.position.z = 118 * Math.max(1, .9 / camera.aspect); camera.updateProjectionMatrix(); wake();
  }
  function frame(now) {
    raf = 0;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const k = reduced ? 1 : 1 - Math.pow(.0012, dt);
    if (!dragging) { view.yaw += (goal.yaw - view.yaw) * k; view.pitch += (goal.pitch - view.pitch) * k; }
    view.zoom += (goal.zoom - view.zoom) * k; view.at.lerp(new Vector3(...goal.at), k);
    for (const [m, v] of lifts) { const target = goal.lift?.[0] === m ? goal.lift[1] : 0; const nv = v + (target - v) * k; lifts.set(m, nv); m.position.z = (m === crystal ? 0 : 0) + nv; }
    if (!picked && !dragging && !reduced) goal.yaw = VIEWS.overview.yaw + Math.sin(now / 4200) * .35;
    // the movement runs: 28,800 vph balance, stepping escape wheel, turning train
    if (!reduced) {
      const t = now / 1000;
      balance.rotation.z = Math.sin(t * TAU * 2.5) * 3.6;
      pallet.rotation.z = Math.sign(Math.sin(t * TAU * 2.5)) * .12;
      escape.rotation.z = -Math.floor(t * 5) * TAU / 30;
      wheels[2].rotation.z = t * TAU / 60; wheels[1].rotation.z = -t * TAU / 450; wheels[0].rotation.z = t * TAU / 3600; barrel.rotation.z = -t * TAU / 28800;
      if (goal.spin) rotorAngle += dt * 2.4;
      else if (rotorGoal != null) rotorAngle += (rotorGoal - rotorAngle) * k;
      else rotorAngle += dt * .35;
    }
    rotor.rotation.z = rotorAngle;
    setHands(Date.now());
    watch.rotation.set(view.pitch, view.yaw, 0, 'YXZ');
    const off = view.at.clone().applyEuler(watch.rotation);
    watch.position.copy(off.multiplyScalar(-1));
    camera.zoom = view.zoom * (stage.clientWidth < 600 ? .82 : 1); camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    const settled = Math.abs(goal.yaw - view.yaw) + Math.abs(goal.pitch - view.pitch) + Math.abs(goal.zoom - view.zoom) < .001;
    if (visible && !document.hidden && (!reduced || !settled)) raf = requestAnimationFrame(frame);
  }
  function wake() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  new ResizeObserver(size).observe(stage);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake(); }).observe(stage);
  document.addEventListener('visibilitychange', wake);
  if (reduced) setInterval(() => { if (visible) wake(); }, 1000);

  stage.prepend(canvas);
  stage.classList.add('has-3d');
  size();
  return { select };
}

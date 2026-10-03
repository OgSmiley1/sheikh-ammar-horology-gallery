'use strict';
// Sheikh Ammar bin Humaid Al Nuaimi — the motion layer.
// app.js is the museum; this file is only its light and its breath. If this file, a
// library or WebGL fails, nothing is lost but motion. Under prefers-reduced-motion it
// paints one still frame of the paper and does nothing else.
//
// Motion language — three curves, nothing else (mirrors the CSS tokens):
//   entry   'expo.out'    things arriving
//   ambient 'sine.inOut'  things breathing
//   hover   'power2.out'  things answering a hand (150 ms)
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const small = matchMedia('(max-width: 768px)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const EASE = { entry: 'expo.out', ambient: 'sine.inOut', hover: 'power2.out' };

  // ————— the paper: a marbled ground that follows the light over Ajman —————
  // One fullscreen triangle, drawn at half resolution; colours held inside a narrow
  // ivory band so every text colour keeps its AAA contrast on it.
  function paper() {
    const canvas = document.createElement('canvas');
    canvas.className = 'paper'; canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'low-power' });
    if (!gl) return null;
    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `precision mediump float;
uniform float uT,uMood;uniform vec2 uR;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<${small ? 3 : 5};i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}
vec3 mood(float m){
  vec3 dawn=vec3(.972,.948,.925);   /* dawn over Ajman: ivory with a rose-bronze breath */
  vec3 sand=vec3(.968,.952,.912);   /* midday: warm sand */
  vec3 pearl=vec3(.952,.955,.950);  /* evening: nacre, for the pearl divers of the coast */
  return m<1.?mix(dawn,sand,m):mix(sand,pearl,m-1.);}
void main(){
  vec2 uv=gl_FragCoord.xy/uR;uv.x*=uR.x/uR.y;
  float t=uT*.035;
  vec2 q=vec2(fbm(uv*2.2+t),fbm(uv*2.2+vec2(5.2,1.3)-t));
  float f=fbm(uv*2.4+3.2*q);
  vec3 base=mood(uMood);
  vec3 vein=base*vec3(.978,.966,.945);  /* shallow on purpose: bronze keeps 7:1 on the darkest vein, grain included (gated) */
  vec3 col=mix(base,vein,smoothstep(.45,.85,f));
  col+=vec3(.012,.008,.002)*smoothstep(.7,.95,fbm(uv*5.-t*.6));
  gl_FragColor=vec4(col,1.);}`;
    const sh = (type, src) => { const o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null; };
    const v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return null;
    const prog = gl.createProgram(); gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uT = gl.getUniformLocation(prog, 'uT'), uR = gl.getUniformLocation(prog, 'uR'), uMood = gl.getUniformLocation(prog, 'uMood');
    const scale = .5 * Math.min(devicePixelRatio || 1, small ? 1 : 1.5);
    const size = () => { canvas.width = Math.max(1, Math.round(innerWidth * scale)); canvas.height = Math.max(1, Math.round(innerHeight * scale)); gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform2f(uR, canvas.width, canvas.height); };
    // the mood follows Ajman's hour: dawn → sand → pearl, and breathes a little around it
    const ajmanHour = () => { const d = new Date(Date.now() + 4 * 3600e3); return d.getUTCHours() + d.getUTCMinutes() / 60; };
    const baseMood = hr => hr < 5 || hr >= 19 ? 2 : hr < 10 ? (hr - 5) / 5 : hr < 16 ? 1 : 1 + (hr - 16) / 3;
    const state = { mood: baseMood(ajmanHour()), t: 0 };
    const draw = () => { gl.uniform1f(uT, state.t); gl.uniform1f(uMood, state.mood); gl.drawArrays(gl.TRIANGLES, 0, 3); };
    document.body.prepend(canvas);
    size(); draw();
    root.classList.add('has-paper');
    addEventListener('resize', () => { size(); draw(); });
    return { state, draw, baseMood, ajmanHour };
  }

  // ————— gold dust: slow motes in the dark rooms —————
  function dust(canvas, count, tint) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    let W = 0, H = 0, dpr = Math.min(devicePixelRatio || 1, small ? 1 : 1.5);
    const size = () => { const r = canvas.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    // the room grows as its pieces arrive: keep the canvas at its real size, never stretched
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(canvas); else addEventListener('resize', size);
    const motes = Array.from({ length: count }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + .35, p: Math.random() * 6.3, s: .15 + Math.random() * .45 }));
    return { tick(t) {
      ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
      const [r, g, b] = tint();
      for (const d of motes) {
        d.x += Math.sin(t * .0004 * d.s + d.p) * .22; d.y -= d.s * .2;
        if (d.y < -4) { d.y = H + 4; d.x = Math.random() * W; }
        const a = (.32 + .68 * Math.abs(Math.sin(t * .001 * d.s + d.p))) * .42;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.2832); ctx.fillStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`; ctx.fill();
      }
    } };
  }

  // ————— words: Arabic splits by word only, never by letter, so letters stay joined —————
  function splitWords(el) {
    if (el.dataset.split) return $$('.w > span', el);
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = []; for (let n; (n = walker.nextNode());) if (n.textContent.trim()) nodes.push(n);
    for (const node of nodes) {
      const frag = document.createDocumentFragment();
      for (const part of node.textContent.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) { frag.append(part); continue; }
        const w = document.createElement('span'); w.className = 'w';
        const inner = document.createElement('span'); inner.textContent = part;
        w.append(inner); frag.append(w);
      }
      node.replaceWith(frag);
    }
    el.dataset.split = '1';
    return $$('.w > span', el);
  }

  function reduced() {
    const p = paper();
    if (p) p.draw();
  }

  function load(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.async = false;
      s.onload = resolve; s.onerror = reject;
      document.head.append(s);
    });
  }

  async function motion() {
    const p = paper();
    try { await Promise.all([load('/vendor/gsap.min.js'), load('/vendor/lenis.min.js')]); } catch { return; }
    const gsap = window.gsap;
    if (!gsap) return;
    root.classList.add('motion');

    // one loop for everything: Lenis, the paper, the dust
    let lenis = null;
    if (window.Lenis) {
      const chapters = $('.chapters');
      const offset = -(72 + (chapters ? chapters.offsetHeight : 0) + 16);
      lenis = new window.Lenis({ duration: 1.2, smoothWheel: true, syncTouch: false, autoRaf: false, anchors: { offset } });
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      const hold = () => (document.body.classList.contains('menu-open') || $('dialog[open]')) ? lenis.stop() : lenis.start();
      new MutationObserver(hold).observe(document.body, { attributes: true, attributeFilter: ['class'] });
      $$('dialog').forEach(d => { new MutationObserver(hold).observe(d, { attributes: true, attributeFilter: ['open'] }); d.addEventListener('close', hold); });
    }

    if (p) {
      let last = 0;
      gsap.ticker.add(time => {
        if (document.hidden || time - last < 1 / 24) return; // marbling moves slowly; 24 fps is plenty
        last = time; p.state.t = time; p.draw();
      });
      // breathe a little either side of the hour's mood, and follow the hour as it turns
      const breathe = () => {
        const base = p.baseMood(p.ajmanHour());
        gsap.to(p.state, { mood: Math.max(0, Math.min(2, base + (Math.random() - .5) * .5)), duration: 14, ease: EASE.ambient, onComplete: breathe });
      };
      breathe();
    }

    // gold dust in the dark rooms, only while they are on screen
    const rooms = [];
    const tm = $('#tm');
    const tmTint = () => { const e = tm ? Number(getComputedStyle(tm).getPropertyValue('--era')) || 1 : 1; return [Math.round(216 + (232 - 216) * (1 - e)), Math.round(189 - 20 * (1 - e) + 10 * e), Math.round(138 - 50 * (1 - e) + 40 * e)]; };
    const hero = $('#tmDust');
    if (hero) rooms.push([hero, dust(hero, small ? 45 : 140, tmTint)]);
    const crownRoom = $('.crown-room');
    if (crownRoom) {
      const c = document.createElement('canvas'); c.className = 'dust'; c.setAttribute('aria-hidden', 'true');
      crownRoom.prepend(c); rooms.push([c, dust(c, small ? 40 : 110, () => [216, 189, 138])]);
    }
    for (const [el, d] of rooms) {
      if (!d) continue;
      let on = false;
      new IntersectionObserver(([e]) => { on = e.isIntersecting; }).observe(el);
      gsap.ticker.add(time => { if (on && !document.hidden) d.tick(time * 1000); });
    }

    // headlines rise word by word as they arrive; anything already on screen is left alone
    const heads = $$('main h2.title, main .crown-words h3, .films h2');
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const words = splitWords(en.target);
      en.target.classList.add('splitting');
      gsap.fromTo(words, { yPercent: 105, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, ease: EASE.entry, stagger: .055,
        onComplete: () => { en.target.classList.remove('splitting'); gsap.set(words, { clearProps: 'all' }); } });
    }), { rootMargin: '0px 0px -12% 0px' });
    heads.forEach(h => { if (h.getBoundingClientRect().top > innerHeight) { splitWords(h); gsap.set($$('.w > span', h), { yPercent: 105, opacity: 0 }); io.observe(h); } });

    // the overture's finale: the veil lifts, then the hero arrives as one motion
    const heroTitle = $('.hero h1'), ring = $('.hero-ring circle');
    const finale = () => {
      if (!heroTitle || root.dataset.heroDone) return;
      root.dataset.heroDone = '1';
      const words = splitWords(heroTitle);
      heroTitle.classList.add('splitting');
      const tl = gsap.timeline({ defaults: { ease: EASE.entry } });
      if (ring) tl.fromTo(ring, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.6 }, 0);
      tl.fromTo(words, { yPercent: 105, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.3, stagger: .08 }, .15)
        .fromTo($$('.hero-copy .label, .hero-copy .standfirst, .hero-copy .button'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: .12 }, .55)
        .add(() => { heroTitle.classList.remove('splitting'); gsap.set(words, { clearProps: 'all' }); });
    };
    if ($('#veil') && !$('#veil').hidden && root.dataset.veil !== 'lifted') {
      // the hero waits under the veil, already in its opening pose
      if (heroTitle) { gsap.set(splitWords(heroTitle), { yPercent: 105, opacity: 0 }); heroTitle.classList.add('splitting'); }
      if (ring) gsap.set(ring, { strokeDashoffset: 1 });
      gsap.set($$('.hero-copy .label, .hero-copy .standfirst, .hero-copy .button'), { opacity: 0, y: 18 });
      document.addEventListener('museum:veil', finale, { once: true });
      setTimeout(finale, 7000); // never later than seven seconds, whatever happens
    }

    // the crown pieces: a liquid-gold ripple over the watch half on approach; it settles on leave
    const svgNS = 'http://www.w3.org/2000/svg';
    const defs = document.createElementNS(svgNS, 'svg');
    defs.setAttribute('aria-hidden', 'true'); defs.setAttribute('width', '0'); defs.setAttribute('height', '0'); defs.style.position = 'absolute';
    defs.innerHTML = '<filter id="liquid" x="0" y="0" width="100%" height="100%"><feTurbulence id="liquidTurb" type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="7"/><feDisplacementMap id="liquidMap" in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter>';
    document.body.append(defs);
    const map = $('#liquidMap'), turb = $('#liquidTurb');
    const fx = { scale: 0, f: .012 };
    const apply = () => { map.setAttribute('scale', fx.scale.toFixed(2)); turb.setAttribute('baseFrequency', `${fx.f.toFixed(4)} ${(fx.f * 1.6).toFixed(4)}`); };
    const bindCrowns = () => $$('.crown-stage:not([data-liquid])').forEach(stage => {
      stage.dataset.liquid = '1';
      const layer = $('.crown-liquid', stage);
      if (!layer || !fine) return;
      stage.addEventListener('pointerenter', () => {
        gsap.to(layer, { opacity: 1, duration: .15, ease: EASE.hover });
        gsap.fromTo(fx, { scale: 0, f: .012 }, { scale: 16, f: .02, duration: .9, ease: EASE.entry, onUpdate: apply, onComplete: () => gsap.to(fx, { scale: 5, duration: 1.6, ease: EASE.ambient, onUpdate: apply }) });
      });
      stage.addEventListener('pointerleave', () => {
        gsap.to(fx, { scale: 0, duration: .8, ease: EASE.entry, onUpdate: apply });
        gsap.to(layer, { opacity: 0, duration: .8, ease: EASE.entry });
      });
    });
    bindCrowns();
    new MutationObserver(bindCrowns).observe($('#crownPieces') || document.createElement('i'), { childList: true });

    // a jeweller's cursor on fine pointers only: a ring that follows with a little weight
    if (fine) {
      const ringEl = document.createElement('div'); ringEl.className = 'cursor'; ringEl.setAttribute('aria-hidden', 'true');
      const dot = document.createElement('div'); dot.className = 'cursor-dot'; dot.setAttribute('aria-hidden', 'true');
      document.body.append(ringEl, dot);
      const rx = gsap.quickTo(ringEl, 'x', { duration: .45, ease: EASE.entry }), ry = gsap.quickTo(ringEl, 'y', { duration: .45, ease: EASE.entry });
      const dx = gsap.quickTo(dot, 'x', { duration: .08, ease: EASE.hover }), dy = gsap.quickTo(dot, 'y', { duration: .08, ease: EASE.hover });
      // hidden until the hand first moves, so it never waits in the corner at 0,0
      let met = false;
      addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        if (!met) { met = true; gsap.set([ringEl, dot], { x: e.clientX, y: e.clientY }); ringEl.classList.add('on'); dot.classList.add('on'); root.classList.add('has-cursor'); }
        rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY);
        const hot = e.target.closest?.('a,button,[data-watch],[role="slider"],.hotspot,input,label');
        ringEl.classList.toggle('hot', !!hot);
        ringEl.classList.toggle('grab', !!e.target.closest?.('#timeMachine'));
      }, { passive: true });
      document.addEventListener('pointerleave', () => { ringEl.style.opacity = '0'; dot.style.opacity = '0'; });
      document.addEventListener('pointerenter', () => { ringEl.style.opacity = ''; dot.style.opacity = ''; });

      // magnetic controls: they lean toward the hand, and settle back when it leaves
      $$('.button, .film-play, .tm-now, .screen-trigger').forEach(el => {
        const mx = gsap.quickTo(el, 'x', { duration: .4, ease: EASE.hover }), my = gsap.quickTo(el, 'y', { duration: .4, ease: EASE.hover });
        el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * .22); my((e.clientY - r.top - r.height / 2) * .3); });
        el.addEventListener('pointerleave', () => { mx(0); my(0); });
      });
    }
  }

  if (reduce) reduced(); else motion();
})();

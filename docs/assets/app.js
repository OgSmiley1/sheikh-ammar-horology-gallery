(function(){
"use strict";
/* language: persisted through ?lang= on every internal link */
var qs=new URLSearchParams(location.search);
var lang=(qs.get('lang')==='en')?'en':'ar'; /* Arabic-first: the Sheikh is greeted in his language */
document.documentElement.lang=lang;
document.documentElement.dir=(lang==='ar'?'rtl':'ltr');

function applyText(){
  Array.prototype.forEach.call(document.querySelectorAll('[data-en]'),function(el){
    var v=el.getAttribute(lang==='ar'?'data-ar':'data-en');
    if(v!=null) el.textContent=v;
  });
  var lb=document.getElementById('langBtn');
  if(lb) lb.textContent=(lang==='ar'?'English':'العربية');
  document.title=document.documentElement.getAttribute(lang==='ar'?'data-title-ar':'data-title-en')||document.title;
}
function decorateLinks(){
  if(lang!=='en') return; /* Arabic is default; persist English when chosen */
  Array.prototype.forEach.call(document.querySelectorAll('a[href]'),function(a){
    var h=a.getAttribute('href');
    if(!h||/^(https?:|#|mailto:)/.test(h)||/\.pdf$/i.test(h)) return;
    a.setAttribute('href',h+(h.indexOf('?')>-1?'&':'?')+'lang=en');
  });
}
var lb=document.getElementById('langBtn');
if(lb) lb.addEventListener('click',function(){
  var u=new URL(location.href);
  if(lang==='ar') u.searchParams.set('lang','en'); else u.searchParams.delete('lang');
  location.href=u.toString();
});

/* mobile nav */
var bg=document.getElementById('burger');
var om=document.getElementById('omenu');
if(bg&&om){
  bg.addEventListener('click',function(){om.classList.add('open')});
  om.addEventListener('click',function(e){if(e.target.tagName==='A'||e.target.classList.contains('oclose')||e.target===om)om.classList.remove('open')});
}
/* cinematic veil lift */
window.addEventListener('load',function(){setTimeout(function(){document.body.classList.add('loaded')},700)});
setTimeout(function(){document.body.classList.add('loaded')},2600);

/* live Ajman time (GST, UTC+4) */
function gulfNow(){var d=new Date();return new Date(d.getTime()+(d.getTimezoneOffset()+240)*60000)}
function pad(n){return String(n).padStart(2,'0')}
function tick(){
  var d=gulfNow(),h=d.getHours(),m=d.getMinutes(),s=d.getSeconds();
  var t=document.getElementById('hdTime');
  if(t) t.textContent=(lang==='ar'?'عجمان ':'AJMAN ')+pad(h)+':'+pad(m)+' GST';
  rot('hH',((h%12)+m/60)*30);rot('hM',(m+s/60)*6);rot('hS',s*6);
}
function rot(id,deg){var e=document.getElementById(id);if(e)e.setAttribute('transform','rotate('+deg+' 100 100)')}
function buildDial(){
  var g=document.getElementById('guill');if(!g)return;
  var s='';for(var r=10;r<=84;r+=6.5)s+='<circle cx="100" cy="100" r="'+r+'"/>';g.innerHTML=s;
  var tk=document.getElementById('ticks'),th='';
  for(var i=0;i<60;i++){var a=i*6*Math.PI/180,maj=i%5===0,r1=maj?80:85,r2=90;
    th+='<line x1="'+(100+r1*Math.sin(a)).toFixed(2)+'" y1="'+(100-r1*Math.cos(a)).toFixed(2)+'" x2="'+(100+r2*Math.sin(a)).toFixed(2)+'" y2="'+(100-r2*Math.cos(a)).toFixed(2)+'" stroke="'+(maj?'#C9A45C':'rgba(201,164,92,.4)')+'" stroke-width="'+(maj?1.6:.6)+'"/>';}
  tk.innerHTML=th;
}

/* cinema hero (home): crossfading films with chapter captions */
function cinema(){
  var wrap=document.getElementById('cinema');if(!wrap)return;
  var slides=Array.prototype.slice.call(wrap.querySelectorAll('.cine'));
  if(!slides.length)return;
  var caps=Array.prototype.slice.call(document.querySelectorAll('.hero-cap .capsule'));
  var marks=Array.prototype.slice.call(document.querySelectorAll('.chapters .chap'));
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var save=navigator.connection&&navigator.connection.saveData;
  var useVideo=!reduce&&!save;
  var DUR=9500,i=-1,timer=null;
  function show(n){
    if(i>-1){slides[i].classList.remove('on');if(caps[i])caps[i].classList.remove('on');if(marks[i])marks[i].classList.remove('on');}
    i=((n%slides.length)+slides.length)%slides.length;
    slides[i].classList.add('on');if(caps[i])caps[i].classList.add('on');if(marks[i])marks[i].classList.add('on');
    if(useVideo){
      var v=slides[i].querySelector('video');
      if(v){try{v.currentTime=0}catch(e){}
        var p=v.play();if(p&&p.catch)p.catch(function(){useVideo=false});}
      var nx=slides[(i+1)%slides.length].querySelector('video');
      if(nx&&nx.getAttribute('preload')!=='auto'){nx.setAttribute('preload','auto');nx.load();}
    }
  }
  function arm(){if(reduce)return;clearInterval(timer);timer=setInterval(function(){show(i+1)},DUR);}
  marks.forEach(function(m,idx){m.addEventListener('click',function(){show(idx);arm();});});
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){clearInterval(timer);}else{show(i);arm();}
  });
  show(0);arm();
}

/* gallery banner: live crossfading stills for pages with no dedicated film */
function gallery(){
  var wraps=document.querySelectorAll('[data-gallery]');if(!wraps.length)return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  Array.prototype.forEach.call(wraps,function(host){
    var slides=Array.prototype.slice.call(host.querySelectorAll('.gslide'));
    var ticks=Array.prototype.slice.call(host.querySelectorAll('.gticks i'));
    if(!slides.length)return;
    slides[0].classList.add('on');if(ticks[0])ticks[0].classList.add('on');
    if(reduce||slides.length<2)return;
    var DUR=5500,i=0,timer=null;
    function show(n){
      slides[i].classList.remove('on');if(ticks[i])ticks[i].classList.remove('on');
      i=((n%slides.length)+slides.length)%slides.length;
      slides[i].classList.add('on');if(ticks[i])ticks[i].classList.add('on');
    }
    function arm(){clearInterval(timer);timer=setInterval(function(){show(i+1)},DUR);}
    document.addEventListener('visibilitychange',function(){
      if(document.hidden){clearInterval(timer);}else{arm();}
    });
    arm();
  });
}

/* Arabic-Indic digits for the Arabic reading of counters */
function arDigits(s){return lang==='ar'?String(s).replace(/\d/g,function(d){return '٠١٢٣٤٥٦٧٨٩'[d]}):String(s)}

/* The Exhibition Hall: one vitrine per screen, walked by arrow, key, rail, or curator's tour */
function exhibition(){
  var track=document.getElementById('track');if(!track)return;
  var vs=Array.prototype.slice.call(track.querySelectorAll('.vitrine'));if(!vs.length)return;
  var rail=document.getElementById('rail'),ticks=[];
  var now=document.getElementById('hcNow'),all=document.getElementById('hcAll');
  var prev=document.getElementById('hPrev'),next=document.getElementById('hNext'),tourBtn=document.getElementById('tourBtn');
  var chips=Array.prototype.slice.call(document.querySelectorAll('.hall-map .chip'));
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var i=0,tour=false,timer=null,DUR=7200;
  if(all)all.textContent=arDigits(pad(vs.length));
  if(rail){vs.forEach(function(v,idx){var t=document.createElement('i');t.setAttribute('role','button');t.setAttribute('tabindex','-1');t.setAttribute('aria-label',(lang==='ar'?'المعروض ':'Exhibit ')+arDigits(idx+1));t.addEventListener('click',function(){go(idx);stopTour()});rail.appendChild(t);ticks.push(t)});}
  function paint(){
    vs.forEach(function(v,idx){v.classList.toggle('on',idx===i)});
    ticks.forEach(function(t,idx){t.classList.toggle('on',idx===i);t.classList.toggle('fill',tour&&idx===i)});
    if(now)now.textContent=arDigits(pad(i+1));
    var m=vs[i].getAttribute('data-maison');
    chips.forEach(function(c){c.classList.toggle('on',c.getAttribute('data-m')===m)});
    if(prev)prev.disabled=(i===0);if(next)next.disabled=(i===vs.length-1);
  }
  function go(n){
    n=Math.max(0,Math.min(vs.length-1,n));
    var target=vs[n];
    /* scroll along the inline axis only — works identically in LTR and RTL */
    track.scrollTo({left:target.offsetLeft-track.offsetLeft,behavior:reduce?'auto':'smooth'});
    i=n;paint();
  }
  function step(d){go(i+d)}
  function arm(){clearInterval(timer);timer=setInterval(function(){if(i>=vs.length-1){stopTour();return}go(i+1);paint()},DUR)}
  function startTour(){if(reduce)return;tour=true;tourBtn&&tourBtn.classList.add('on');if(tourBtn)tourBtn.textContent=(lang==='ar'?'إيقاف الجولة':'Pause the tour');paint();arm()}
  function stopTour(){tour=false;clearInterval(timer);tourBtn&&tourBtn.classList.remove('on');if(tourBtn)tourBtn.textContent=(lang==='ar'?'ابدأ جولة القيّم':"Begin the curator's tour");paint()}
  /* follow the user's own scrolling (trackpad, swipe) */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting&&en.intersectionRatio>=.6){var k=vs.indexOf(en.target);if(k>-1&&k!==i){i=k;paint()}}})},{root:track,threshold:.6});
    vs.forEach(function(v){io.observe(v)});
  }
  if(prev)prev.addEventListener('click',function(){step(-1);stopTour()});
  if(next)next.addEventListener('click',function(){step(1);stopTour()});
  if(tourBtn){tourBtn.addEventListener('click',function(){tour?stopTour():startTour()});if(reduce)tourBtn.style.display='none';}
  chips.forEach(function(c){c.addEventListener('click',function(){var m=c.getAttribute('data-m');for(var k=0;k<vs.length;k++){if(vs[k].getAttribute('data-maison')===m){go(k);break}}stopTour()})});
  var rtl=document.documentElement.dir==='rtl';
  document.addEventListener('keydown',function(e){
    if(document.getElementById('vlb')&&document.getElementById('vlb').classList.contains('open'))return;
    if(e.target&&/INPUT|TEXTAREA/.test(e.target.tagName))return;
    var fwd=rtl?'ArrowLeft':'ArrowRight',back=rtl?'ArrowRight':'ArrowLeft';
    if(e.key===fwd){step(1);stopTour();e.preventDefault()}
    else if(e.key===back){step(-1);stopTour();e.preventDefault()}
    else if(e.key==='Home'){go(0);stopTour();e.preventDefault()}
    else if(e.key==='End'){go(vs.length-1);stopTour();e.preventDefault()}
    else if(e.key===' '&&tourBtn&&document.activeElement!==tourBtn){tour?stopTour():startTour();e.preventDefault()}
  });
  document.addEventListener('visibilitychange',function(){if(document.hidden){clearInterval(timer)}else if(tour){arm()}});
  /* localised arrow labels */
  if(prev)prev.setAttribute('aria-label',lang==='ar'?'المعروض السابق':'Previous exhibit');
  if(next)next.setAttribute('aria-label',lang==='ar'?'المعروض التالي':'Next exhibit');
  if(tourBtn)tourBtn.textContent=(lang==='ar'?'ابدأ جولة القيّم':"Begin the curator's tour");
  paint();
}

/* The vitrine: any watch image steps into a spotlit glass case */
function vitrine(){
  var hosts=[];
  var w=document.querySelector('.wimg');
  if(w){var im=w.querySelector('img');var h1=document.querySelector('.wbd h1');var ln=document.querySelector('.wbd .lot-no');
    if(im)hosts.push({el:w,img:im,name:h1?h1.textContent:im.alt,lot:ln?ln.textContent:''});}
  Array.prototype.forEach.call(document.querySelectorAll('.case'),function(c){
    var im=c.querySelector('img'),p=c.closest('.vitrine');var h2=p&&p.querySelector('.placard h2'),ln=p&&p.querySelector('.placard .lot-no');
    if(im)hosts.push({el:c,img:im,name:h2?h2.textContent:im.alt,lot:ln?ln.textContent:''});
  });
  if(!hosts.length)return;
  var hint=lang==='ar'?'افتح الواجهة':'Open the vitrine';
  var box=document.createElement('div');box.id='vlb';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label',lang==='ar'?'الواجهة الزجاجية':'The vitrine');
  box.innerHTML='<button class="vlb-x" type="button" aria-label="'+(lang==='ar'?'إغلاق':'Close')+'">✕</button><div class="vlb-stage"><div class="vlb-case"><span class="beam" aria-hidden="true"></span><img alt=""></div><div class="vlb-plate"><span class="lot-no"></span><h3></h3></div></div><span class="vlb-k">'+(lang==='ar'?'اضغط ESC للخروج':'Press ESC to step back')+'</span>';
  document.body.appendChild(box);
  var bimg=box.querySelector('img'),bname=box.querySelector('h3'),blot=box.querySelector('.lot-no'),bx=box.querySelector('.vlb-x'),last=null;
  function open(h){bimg.src=h.img.currentSrc||h.img.src;bimg.alt=h.name;bname.textContent=h.name;blot.textContent=h.lot;last=document.activeElement;box.classList.add('open');document.body.classList.add('vlb-open');setTimeout(function(){bx.focus()},60)}
  function close(){box.classList.remove('open');document.body.classList.remove('vlb-open');if(last&&last.focus)last.focus()}
  hosts.forEach(function(h){
    var s=document.createElement('span');s.className='vhint';s.textContent=hint;h.el.appendChild(s);
    h.el.setAttribute('tabindex','0');h.el.setAttribute('role','button');h.el.setAttribute('aria-label',hint+' — '+h.name);
    h.el.addEventListener('click',function(e){e.preventDefault();open(h)});
    h.el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open(h)}});
  });
  bx.addEventListener('click',close);
  box.addEventListener('click',function(e){if(e.target===box||e.target.classList.contains('vlb-stage'))close()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&box.classList.contains('open'))close()});
}

/* ambient films: play when visible, settle when done */
function ambientFilms(){
  var hosts=document.querySelectorAll('[data-ambient]');if(!hosts.length)return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var save=navigator.connection&&navigator.connection.saveData;
  Array.prototype.forEach.call(hosts,function(h){
    var v=h.querySelector('video');if(!v)return;
    if(reduce||save){v.removeAttribute('autoplay');return;}
    if(!('IntersectionObserver' in window)){var p0=v.play();if(p0&&p0.catch)p0.catch(function(){});return;}
    var io=new IntersectionObserver(function(es){es.forEach(function(en){
      if(en.isIntersecting){try{v.currentTime=0}catch(e){} var p=v.play();if(p&&p.catch)p.catch(function(){});}
      else{v.pause();}
    })},{threshold:.25});
    io.observe(h);
  });
}

/* scroll reveals */
function reveals(){
  var all=document.querySelectorAll('.rev');
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){
    Array.prototype.forEach.call(all,function(e){e.classList.add('in')});return;
  }
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.1});
  Array.prototype.forEach.call(all,function(e){io.observe(e)});
}

/* His Highness's Piece of the Day — rotates once per Gulf day through the RRR series */
var RRR_PIECES=[{"slug":"artisans-de-geneve-la-montoya-custom","en":"Artisans de Geneve 'La Montoya' Custom Rolex","ar":"حرفيو جنيف 'لا مونتويا' رولكس مخصص","img":"assets/artisans-de-geneve-la-montoya-custom.webp"},{"slug":"fp-journe-chronom-tre-r-sonance","en":"F.P. Journe Chronomètre à Résonance","ar":"إف بي جورن كرونومتر ريزونانس","img":"assets/fp-journe-chronom-tre-r-sonance.webp"},{"slug":"fp-journe-tourbillon-souverain-mint","en":"F.P. Journe Tourbillon Souverain","ar":"إف بي جورن توربيون سوفرين","img":"assets/fp-journe-tourbillon-souverain-mint.jpeg"},{"slug":"patek-nautilus-5711-olive-green-diamond","en":"Patek Philippe Nautilus 5711/1300A Olive Green Diamond","ar":"باتيك فيليب ناوتيلوس 5711/1300A أخضر زيتوني ماسي","img":"assets/patek-nautilus-5711-olive-green-diamond.webp"},{"slug":"patek-philippe-5470p","en":"Patek Philippe 5470P Chronograph","ar":"باتيك فيليب 5470P كرونوغراف","img":"assets/patek-philippe-5470p.webp"},{"slug":"richard-mille-rm-26-02-evil-eye","en":"Richard Mille RM 26-02 Tourbillon Evil Eye","ar":"ريتشارد ميل RM 26-02 توربيون عين الشر","img":"assets/richard-mille-rm-26-02-evil-eye.webp"},{"slug":"richard-mille-rm-65-01","en":"Richard Mille RM 65-01 Automatic Winding Split-Seconds Chronograph","ar":"ريتشارد ميل RM 65-01 كرونوغراف مقسم الثواني","img":"assets/richard-mille-rm-65-01.jpeg"},{"slug":"richard-mille-rm-68-01-cyril-kongo","en":"Richard Mille RM 68-01 Cyril Kongo","ar":"ريتشارد ميل RM 68-01 سيريل كونغو","img":"assets/richard-mille-rm-68-01-cyril-kongo.webp"},{"slug":"rolex-daytona-6239-paul-newman","en":"Rolex Daytona 6239 Paul Newman","ar":"رولكس دايتونا 6239 بول نيومان","img":"assets/rolex-daytona-6239-paul-newman.webp"},{"slug":"rolex-daytona-6241-john-player-special","en":"Rolex Daytona 6241 'John Player Special'","ar":"رولكس دايتونا 6241 'جون بلاير سبيشيال'","img":"assets/rolex-daytona-6241-john-player-special.webp"},{"slug":"rolex-daytona-6263-quraysh","en":"Rolex Daytona 6263 'Quraysh'","ar":"رولكس دايتونا 6263 'قريش'","img":"assets/rolex-daytona-6263-quraysh.webp"},{"slug":"rolex-daytona-6264","en":"Rolex Daytona Reference 6264","ar":"رولكس دايتونا المرجع 6264","img":"assets/rolex-daytona-6264.webp"},{"slug":"rolex-daytona-aet-remould","en":"Rolex Daytona AET Remould Custom","ar":"رولكس دايتونا AET ريمولد مخصص","img":"assets/rolex-daytona-aet-remould.webp"},{"slug":"rolex-daytona-paul-newman-6265","en":"Rolex Daytona 'Paul Newman' Reference 6265","ar":"رولكس دايتونا 'بول نيومان' المرجع 6265","img":"assets/rolex-daytona-paul-newman-6265.webp"},{"slug":"rolex-gmt-master-ii-pepsi-meteorite","en":"Rolex GMT-Master II 'Pepsi' Meteorite Dial","ar":"رولكس GMT-ماستر II 'بيبسي' ميناء نيزكي","img":"assets/rolex-gmt-master-ii-pepsi-meteorite.webp"},{"slug":"rolex-daytona-diw-motley-carbon","en":"Rolex Daytona DiW 'Motley 3S' Carbon","ar":"رولكس دايتونا DiW 'موتلي 3S' كربون","img":"assets/rolex-daytona-diw-motley-carbon.webp"}];
function pieceOfDay(){
  var link=document.getElementById('potdLink');if(!link)return;
  var d=gulfNow();
  var start=new Date(d.getFullYear(),0,0);
  var doy=Math.floor((d-start)/86400000);
  var w=RRR_PIECES[doy%RRR_PIECES.length];
  var name=(lang==='ar'?w.ar:w.en);
  var img=document.getElementById('potdImg');
  if(img){img.src=w.img;img.alt=name;}
  var nm=document.getElementById('potdName');if(nm)nm.textContent=name;
  link.setAttribute('href','watch/'+w.slug+'.html'+(lang==='en'?'?lang=en':''));
}

/* collection filters */
function filters(){
  var bar=document.getElementById('filterBar');if(!bar)return;
  var brand='all',q='';
  var input=document.getElementById('fSearch');
  function apply(){
    var shown=0;
    Array.prototype.forEach.call(document.querySelectorAll('[data-w]'),function(c){
      var okB=(brand==='all'||c.getAttribute('data-brand')===brand);
      var okQ=!q||c.getAttribute('data-q').indexOf(q)>-1;
      var on=okB&&okQ; c.style.display=on?'':'none'; if(on)shown++;
    });
    Array.prototype.forEach.call(document.querySelectorAll('.house'),function(h){
      var any=Array.prototype.some.call(h.querySelectorAll('[data-w]'),function(c){return c.style.display!=='none'});
      h.style.display=any?'':'none';
    });
    var cn=document.getElementById('countNote');
    if(cn)cn.textContent=(lang==='ar'?(shown+' قطعة'):(shown+(shown===1?' piece':' pieces')));
  }
  Array.prototype.forEach.call(bar.querySelectorAll('.chip'),function(ch){
    ch.addEventListener('click',function(){
      bar.querySelector('.chip.on').classList.remove('on');ch.classList.add('on');
      brand=ch.getAttribute('data-f');apply();
    });
  });
  if(input)input.addEventListener('input',function(){q=input.value.trim().toLowerCase();apply()});
  apply();
}

/* youtube facade */
var yt=document.getElementById('yt');
if(yt){var go=function(){var id=yt.getAttribute('data-id');yt.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="Film" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>'};
  yt.addEventListener('click',go);yt.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')go()});}
/* copy link */
Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'),function(btn){
  btn.addEventListener('click',function(){
    var t=btn.getAttribute('data-copy');
    (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){
      var o=btn.textContent;btn.textContent='\u2713';setTimeout(function(){btn.textContent=o},1400);
    }).catch(function(){prompt('',t)});
  });
});
/* count-up ledger */
(function(){
  var ns=document.querySelectorAll('.stamp .n');if(!ns.length)return;
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var io2=new IntersectionObserver(function(es){es.forEach(function(en){
    if(!en.isIntersecting)return;var el=en.target,txt=el.textContent.trim();io2.unobserve(el);
    var m=txt.match(/^(\d+)$/);if(!m)return;var N=+m[1],t0=null;
    function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/1200,1);el.textContent=Math.round(N*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step)}
    requestAnimationFrame(step);
  })},{threshold:.6});
  Array.prototype.forEach.call(ns,function(n){io2.observe(n)});
})();
/* back to top */
var tt=document.getElementById('toTop');
if(tt){window.addEventListener('scroll',function(){tt.classList.toggle('show',window.scrollY>800)},{passive:true});
  tt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});}

applyText();decorateLinks();buildDial();cinema();ambientFilms();gallery();exhibition();vitrine();reveals();filters();pieceOfDay();
tick();setInterval(tick,1000);
})();

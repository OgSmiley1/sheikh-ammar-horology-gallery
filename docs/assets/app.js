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
    if(!h||/^(https?:|#|mailto:)/.test(h)) return;
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

/* hero slideshow (home) */
function slideshow(){
  var bgEl=document.getElementById('heroBg');if(!bgEl)return;
  var els=bgEl.children;if(!els.length)return;
  els[0].classList.add('on');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var i=0;setInterval(function(){els[i].classList.remove('on');i=(i+1)%els.length;els[i].classList.add('on')},7500);
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

applyText();decorateLinks();buildDial();slideshow();reveals();filters();
tick();setInterval(tick,1000);
})();

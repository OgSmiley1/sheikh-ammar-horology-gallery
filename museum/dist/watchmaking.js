'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let ar=true;
try{ar=localStorage.getItem('museum-language')!=='en'}catch{}
function apply(){
  document.documentElement.lang=ar?'ar':'en';
  document.documentElement.dir=ar?'rtl':'ltr';
  document.title=ar?'فن صناعة الساعات | متحف الشيخ عمار':'Watchmaking | Sheikh Ammar Horology Museum';
  $$('[data-ar][data-en]').forEach(el=>{el.textContent=el.getAttribute(ar?'data-ar':'data-en')||''});
  const lang=$('#lang');lang.textContent=ar?'EN':'عربي';lang.lang=ar?'en':'ar';
  lang.setAttribute('aria-label',ar?'Switch to English':'التبديل إلى العربية');
  $('#navigation').setAttribute('aria-label',ar?'التنقل الرئيسي':'Main navigation');
  $('#menu').setAttribute('aria-label',ar?'فتح القائمة':'Open menu');
}
function menu(open){
  $('#navigation').classList.toggle('open',open);
  $('#menu').setAttribute('aria-expanded',String(open));
}
$('#lang').addEventListener('click',()=>{ar=!ar;try{localStorage.setItem('museum-language',ar?'ar':'en')}catch{};apply()});
$('#menu').addEventListener('click',()=>menu($('#menu').getAttribute('aria-expanded')!=='true'));
$('#navigation').addEventListener('click',e=>{if(e.target.closest('a'))menu(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')menu(false)});
document.addEventListener('click',e=>{if(!e.target.closest('.nav'))menu(false)});
apply();

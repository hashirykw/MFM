(function(){
  var d=document,h=d.documentElement;h.classList.add('js');
  var nav=d.getElementById('nav'),solidAt=+(nav&&nav.dataset.solid||60);
  function onS(){if(nav)nav.classList.toggle('solid',scrollY>solidAt)}
  addEventListener('scroll',onS,{passive:true});onS();
  var bg=d.querySelector('.burger');
  if(bg)bg.addEventListener('click',function(){var o=!d.body.classList.contains('menu-open');d.body.classList.toggle('menu-open',o);bg.setAttribute('aria-expanded',o)});
  d.querySelectorAll('.sheet a').forEach(function(a){a.addEventListener('click',function(){d.body.classList.remove('menu-open')})});
  addEventListener('keydown',function(e){if(e.key==='Escape')d.body.classList.remove('menu-open')});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
  d.querySelectorAll('[data-rv]').forEach(function(el){io.observe(el)});
  d.querySelectorAll('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear()});
  /* counters */
  var co=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;co.unobserve(e.target);var el=e.target,to=+el.dataset.count,t0=performance.now(),dur=1400;
    (function f(t){var p=Math.min(1,(t-t0)/dur),v=Math.round(to*(1-Math.pow(1-p,3)));el.textContent=v.toLocaleString('en-US');if(p<1)requestAnimationFrame(f)})(t0)})},{threshold:.6});
  d.querySelectorAll('[data-count]').forEach(function(el){co.observe(el)});
  try{localStorage.setItem('mfm-compare','1')}catch(e){}
})();

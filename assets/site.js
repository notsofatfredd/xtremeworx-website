/* ===== HEADER SCROLL STATE + SCROLL CUE FADE ===== */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.getElementById('siteHeader');
  var scrollCue = document.getElementById('scrollCue');

  if(reduce){
    header.classList.add('is-active');
    return;
  }

  var ACTIVATE_AT = 80; // px scrolled before header background + mark appear
  var ticking = false;

  function update(){
    ticking = false;
    var y = window.scrollY;
    header.classList.toggle('is-active', y > ACTIVATE_AT);
    if(scrollCue){
      var fade = Math.max(0, 1 - y / 200);
      scrollCue.style.opacity = fade;
    }
  }

  function onScroll(){
    if(!ticking){
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* ===== MOBILE NAV TOGGLE ===== */
(function(){
  var btn = document.getElementById('hamburgerBtn');
  var panel = document.getElementById('mobileNav');
  if(!btn || !panel) return;

  function closeNav(){
    btn.classList.remove('is-open');
    panel.classList.remove('is-open');
    btn.setAttribute('aria-expanded','false');
  }
  btn.addEventListener('click', function(){
    var open = btn.classList.toggle('is-open');
    panel.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  panel.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeNav);
  });
})();

/* ===== SCROLL REVEAL + REFLECT-SWEEP-ON-ENTRY (mobile/touch friendly) ===== */
(function(){
  var reveals = document.querySelectorAll('.reveal');
  if(!reveals.length || !('IntersectionObserver' in window)){
    reveals.forEach(function(el){ el.classList.add('is-visible'); });
    return;
  }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry, i){
      if(entry.isIntersecting){
        var el = entry.target;
        setTimeout(function(){
          el.classList.add('is-visible');
          /* auto-play the reflection sweep once, since hover doesn't exist on touch */
          if(!reduce && el.classList.contains('reflect')){
            el.classList.add('reflect-play');
            setTimeout(function(){ el.classList.remove('reflect-play'); }, 750);
          }
        }, i * 60);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(function(el){ io.observe(el); });
})();

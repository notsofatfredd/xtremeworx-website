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

/* ===== GALLERY SLIDESHOW ===== */
(function(){
  var root = document.getElementById('slideshow');
  var track = document.getElementById('slideshowTrack');
  if(!root || !track) return;
  var slides = Array.prototype.slice.call(track.children);
  var dots = Array.prototype.slice.call(document.querySelectorAll('#slideDots .slide-dot'));
  var prevBtn = document.getElementById('slidePrev');
  var nextBtn = document.getElementById('slideNext');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var count = slides.length;
  var index = 0;
  var timer = null;
  var AUTOPLAY_MS = 5000;

  function goTo(i){
    index = (i + count) % count;
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
    dots.forEach(function(d, di){
      d.classList.toggle('is-active', di === index);
      d.setAttribute('aria-selected', di === index ? 'true' : 'false');
    });
  }

  function next(){ goTo(index + 1); }
  function prev(){ goTo(index - 1); }

  function startAutoplay(){
    if(reduce) return;
    stopAutoplay();
    timer = window.setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay(){
    if(timer){ window.clearInterval(timer); timer = null; }
  }

  nextBtn.addEventListener('click', function(){ next(); startAutoplay(); });
  prevBtn.addEventListener('click', function(){ prev(); startAutoplay(); });
  dots.forEach(function(d, di){
    d.addEventListener('click', function(){ goTo(di); startAutoplay(); });
  });

  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  root.addEventListener('focusin', stopAutoplay);
  root.addEventListener('focusout', startAutoplay);

  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', function(e){
    if(e.key === 'ArrowRight'){ next(); startAutoplay(); }
    if(e.key === 'ArrowLeft'){ prev(); startAutoplay(); }
  });

  var touchStartX = null;
  root.addEventListener('touchstart', function(e){
    touchStartX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });
  root.addEventListener('touchend', function(e){
    if(touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(dx) > 40){ dx < 0 ? next() : prev(); }
    touchStartX = null;
    startAutoplay();
  });

  goTo(0);
  startAutoplay();
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

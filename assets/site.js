/* ===== BOOT / SCROLL ACTIVATION SEQUENCE ===== */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.getElementById('siteHeader');
  var headerMark = document.getElementById('headerMark');
  var wrap = document.getElementById('heroWrap');
  var stage = document.getElementById('bootStage');
  var realLogo = document.querySelector('.boot-real-logo');
  var beam = document.getElementById('igBeam');
  var spark = document.getElementById('igSpark');
  var tagline = document.getElementById('heroTagline');
  var cta = document.getElementById('heroCta');
  var scrollCue = document.getElementById('scrollCue');

  if(reduce){
    header.classList.add('is-active');
    headerMark.style.opacity = 1;
    realLogo.classList.add('is-lit');
    tagline.style.opacity = 1;
    return;
  }

  var beamLen = beam.getTotalLength ? beam.getTotalLength() : 100;
  beam.style.strokeDasharray = beamLen;
  beam.style.strokeDashoffset = beamLen;

  var ticking = false;
  function clamp(v){ return Math.max(0, Math.min(1, v)); }

  function update(){
    ticking = false;
    var rect = wrap.getBoundingClientRect();
    var wrapTop = window.scrollY + rect.top;
    var runway = wrap.offsetHeight - window.innerHeight;
    var p = clamp((window.scrollY - wrapTop) / Math.max(runway, 1));

    /* Phase 1 (0 – 0.12): beam travels toward the mark, spark bursts on impact */
    var draw = clamp(p / 0.12);
    beam.style.strokeDashoffset = beamLen * (1 - draw);
    var sparkT = clamp((p - 0.1) / 0.05);
    var sparkFade = 1 - clamp((p - 0.2) / 0.05);
    spark.style.opacity = Math.max(0, Math.min(sparkT, sparkFade));
    spark.style.transform = 'scale(' + (0.4 + sparkT * 1.1) + ')';

    /* Phase 2 (0.12 – 0.42): a diagonal polish sweep reveals the real logo,
       left-dark to right-lit — same reflection-sweep language used elsewhere on the site */
    var sweep = clamp((p - 0.12) / 0.3);
    var pct = sweep * 130 - 15; // runs from -15% to 115% so the soft edge clears both sides
    realLogo.style.webkitMaskImage = 'linear-gradient(100deg, black 0%, black ' + pct + '%, transparent ' + (pct + 22) + '%, transparent 100%)';
    realLogo.style.maskImage = realLogo.style.webkitMaskImage;
    realLogo.classList.toggle('is-lit', sweep > 0.02);
    // brightness/saturation ramps with the sweep too, via a CSS var-driven filter
    var litAmount = sweep;
    realLogo.style.filter = 'brightness(' + (0.15 + litAmount*0.85) + ') saturate(' + (0.3 + litAmount*0.7) + ') drop-shadow(0 0 ' + (litAmount*30) + 'px rgba(21,101,255,' + (litAmount*0.3) + '))';

    /* Phase 3 (0.42 – 0.55): tagline appears once fully revealed */
    tagline.style.opacity = clamp((p - 0.42) / 0.1);

    /* Phase 4 (0.6 – 1): hold, then dock the real logo into the header */
    scrollCue.style.opacity = 1 - clamp(p / 0.08);
    var dock = clamp((p - 0.6) / 0.4);
    stage.style.transform = 'translateY(-' + (dock * 30) + 'vh) scale(' + (1 - dock * 0.72) + ')';
    stage.style.opacity = 1 - clamp((dock - 0.75) / 0.25);
    cta.style.opacity = 1 - clamp(dock / 0.4);

    header.classList.toggle('is-active', dock > 0.05);
    headerMark.style.opacity = dock > 0.85 ? 1 : (dock > 0.4 ? (dock - 0.4) / 0.45 : 0);
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

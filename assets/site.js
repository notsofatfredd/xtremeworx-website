(function () {
  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");
  var yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  window.addEventListener("scroll", function () {
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  });

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.textContent = isOpen ? "✕" : "☰";
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.textContent = "☰";
      });
    });
  }

  // Reel videos are large, so each one loads and plays only when it is about to scroll into view,
  // and pauses when it leaves. Visitors who prefer reduced motion see the still poster only.
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lazyVideos = document.querySelectorAll("video[data-lazy-video]");

  if (reducedMotion) {
    lazyVideos.forEach(function (video) {
      video.removeAttribute("loop");
    });
  } else if ("IntersectionObserver" in window) {
    var videoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting) {
          var started = video.play();
          if (started && started.catch) {
            started.catch(function () {});
          }
        } else {
          video.pause();
        }
      });
    }, { rootMargin: "200px 0px" });
    lazyVideos.forEach(function (video) {
      videoObserver.observe(video);
    });
  } else {
    lazyVideos.forEach(function (video) {
      var started = video.play();
      if (started && started.catch) {
        started.catch(function () {});
      }
    });
  }
})();

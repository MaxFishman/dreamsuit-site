/* ============================================================
   DreamSleeve — scroll experience
   Vanilla JS. No dependencies. Reduced-motion aware.
   ============================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* GSAP cinematic scroll is a progressive enhancement: only when the vendored
     libs loaded AND the visitor hasn't asked for reduced motion. Otherwise the
     site falls back to the IntersectionObserver reveals below. */
  var gsapReady = !reduce && !!window.gsap && !!window.ScrollTrigger;
  if (gsapReady) document.documentElement.classList.add("gsap");

  /* current year in footer */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- sticky header state ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (window.scrollY > 24) header.classList.add("is-stuck");
    else header.classList.remove("is-stuck");
  }

  /* ---------- progress rail ---------- */
  var railCharge = document.getElementById("railCharge");
  function onScrollRail() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop || window.scrollY) / max : 0;
    railCharge.style.height = (pct * 100).toFixed(2) + "%";
  }

  /* ---------- reveal on scroll (fallback when GSAP is not driving) ---------- */
  if (!gsapReady) {
    var reveals = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    if (reduce || !("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var revObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-in"); revObs.unobserve(e.target); }
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
      reveals.forEach(function (el) { revObs.observe(el); });
    }
  }

  /* ---------- count-up numbers ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = (String(target).split(".")[1] || "").length;
    if (reduce) { el.textContent = prefix + target.toFixed(decimals) + suffix; return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  if (!("IntersectionObserver" in window)) {
    counters.forEach(animateCount);
  } else {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cObs.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cObs.observe(el); });
  }

  /* ---------- mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primaryNav");
  if (navToggle && primaryNav) {
    var setNav = function (open) {
      primaryNav.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    navToggle.addEventListener("click", function () {
      setNav(navToggle.getAttribute("aria-expanded") !== "true");
    });
    primaryNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setNav(false); navToggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 920) setNav(false);
    }, { passive: true });
  }

  /* ---------- active-nav scroll-spy ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  if (navLinks.length && "IntersectionObserver" in window) {
    var linkFor = {}, spyTargets = [];
    navLinks.forEach(function (a) {
      var el = document.getElementById(a.getAttribute("href").slice(1));
      if (el) { linkFor[el.id] = a; spyTargets.push(el); }
    });
    var spyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove("is-active"); a.removeAttribute("aria-current"); });
        var a = linkFor[e.target.id];
        if (a) { a.classList.add("is-active"); a.setAttribute("aria-current", "true"); }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    spyTargets.forEach(function (el) { spyObs.observe(el); });
  }

  /* ---------- rAF-throttled scroll loop ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      onScrollHeader();
      onScrollRail();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScrollRail, { passive: true });
  onScroll();

  /* ---------- cinematic scroll (GSAP ScrollTrigger) ---------- */
  if (gsapReady) {
    gsap.registerPlugin(ScrollTrigger);
    var ease = "power3.out";

    /* 1. Hero: cascade the copy in on load, then a scrub-pinned parallax exit —
       the arm photo pushes in while the copy drifts up and dissolves. */
    gsap.fromTo(".hero [data-reveal]",
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: ease, delay: 0.15 });

    gsap.timeline({
      scrollTrigger: {
        trigger: ".hero", start: "top top", end: "+=70%",
        scrub: 0.6, pin: true, pinSpacing: true, anticipatePin: 1
      }
    })
      .to(".hero__inner", { yPercent: -14, opacity: 0, ease: "none" }, 0)
      .to(".hero__photo img", { yPercent: 10, scale: 1.14, ease: "none" }, 0)
      .to(".scroll-cue", { opacity: 0, ease: "none", duration: 0.25 }, 0);

    /* 2. Parallax layers: the background grid and each headline drift at their
       own rate as they pass, adding depth. */
    gsap.to(".grid-canvas", {
      yPercent: 12, ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true }
    });
    gsap.utils.toArray(".section__title").forEach(function (t) {
      gsap.fromTo(t, { yPercent: 9 }, {
        yPercent: -9, ease: "none",
        scrollTrigger: { trigger: t, start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    /* 3. Section content: a staggered cascade that plays in and reverses out,
       so each section re-animates every time it re-enters the viewport. */
    gsap.utils.toArray("main > section:not(.hero)").forEach(function (sec) {
      var items = sec.querySelectorAll("[data-reveal]");
      if (!items.length) return;
      gsap.set(items, { opacity: 0, y: 36, scale: 0.985 });
      ScrollTrigger.create({
        trigger: sec, start: "top 78%",
        onEnter: show, onEnterBack: show, onLeave: hide, onLeaveBack: hide
      });
      function show() { gsap.to(items, { opacity: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.09, ease: ease, overwrite: true }); }
      function hide() { gsap.to(items, { opacity: 0, y: 36, scale: 0.985, duration: 0.3, overwrite: true }); }
    });

    /* re-measure once fonts/images settle so pins + triggers line up */
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }
})();

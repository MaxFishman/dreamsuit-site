/* ============================================================
   DreamSleeve — scroll experience
   Vanilla JS. No dependencies. Reduced-motion aware.
   ============================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  /* ---------- reveal on scroll ---------- */
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

  /* ---------- mission sticky sequence ---------- */
  var mission = document.getElementById("mission");
  var stageItems = Array.prototype.slice.call(document.querySelectorAll(".mission__list li"));
  var panels = Array.prototype.slice.call(document.querySelectorAll("[data-stage-panel]"));
  var activeStage = -1;

  function setStage(i) {
    if (i === activeStage) return;
    activeStage = i;
    stageItems.forEach(function (li, idx) { li.classList.toggle("is-active", idx === i); });
    panels.forEach(function (p, idx) { p.classList.toggle("is-active", idx === i); });
  }

  function onScrollMission() {
    if (!mission || reduce) return;
    var rect = mission.getBoundingClientRect();
    var total = mission.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    var progressed = Math.min(Math.max(-rect.top / total, 0), 0.9999);
    setStage(Math.floor(progressed * panels.length));
  }

  /* On reduced motion / mobile static layout, show all panels + mark all active items */
  function missionStaticFallback() {
    var sticky = document.querySelector(".mission__sticky");
    if (!sticky) return;
    var staticLayout = window.getComputedStyle(sticky).position !== "sticky";
    if (reduce || staticLayout) {
      panels.forEach(function (p) { p.classList.add("is-active"); });
      stageItems.forEach(function (li) { li.classList.add("is-active"); });
    }
  }

  /* initialise first stage for desktop sticky */
  if (!reduce) setStage(0);
  missionStaticFallback();

  /* ---------- pipeline tabs (Device console) ---------- */
  Array.prototype.slice.call(document.querySelectorAll("[data-tabs]")).forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.classList.toggle("is-active", on);
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (e) {
        var k = e.key, n = tabs.length, j = -1;
        if (k === "ArrowRight" || k === "ArrowDown") j = (i + 1) % n;
        else if (k === "ArrowLeft" || k === "ArrowUp") j = (i - 1 + n) % n;
        else if (k === "Home") j = 0;
        else if (k === "End") j = n - 1;
        if (j > -1) { e.preventDefault(); select(tabs[j], true); }
      });
    });
  });

  /* ---------- lead-capture form (Formspree AJAX) ---------- */
  var leadForm = document.querySelector(".lead-form");
  if (leadForm) {
    var leadStatus = leadForm.querySelector(".lead-form__status");
    var setStatus = function (msg, cls) { leadStatus.textContent = msg; leadStatus.className = "lead-form__status" + (cls ? " " + cls : ""); };
    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var action = leadForm.getAttribute("action") || "";
      if (/YOUR_FORM_ID|INFO[_ ]?NEEDED/i.test(action)) {
        setStatus("Form isn't connected yet: add your Formspree ID.", "is-error");
        return;
      }
      if (!leadForm.checkValidity()) { leadForm.reportValidity(); return; }
      var btn = leadForm.querySelector('button[type="submit"]');
      btn.disabled = true; setStatus("Sending…");
      fetch(action, { method: "POST", body: new FormData(leadForm), headers: { Accept: "application/json" } })
        .then(function (res) {
          if (res.ok) { leadForm.reset(); setStatus("Thanks, we'll be in touch shortly.", "is-ok"); return; }
          return res.json().then(function (data) {
            var m = data && data.errors ? data.errors.map(function (x) { return x.message; }).join(", ") : "Something went wrong. Please email us.";
            setStatus(m, "is-error");
          });
        })
        .catch(function () { setStatus("Network error. Try again, or email us directly.", "is-error"); })
        .then(function () { btn.disabled = false; });
    });
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
      onScrollMission();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { missionStaticFallback(); onScrollRail(); }, { passive: true });
  onScroll();
})();

/* ==========================================================================
   Nandaram Salman — Portfolio
   Vanilla JS. No dependencies. Progressive enhancement.
   ========================================================================== */
(function () {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  /* ------------------------------------------------------------------ */
  /* Year                                                               */
  /* ------------------------------------------------------------------ */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* Theme                                                              */
  /* ------------------------------------------------------------------ */
  const THEME_KEY = "ns-theme";
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f4f5fa" : "#07070d");
  }
  let stored = null;
  try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }
  applyTheme(stored === "light" ? "light" : "dark");

  const themeBtn = $("#themeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
      toast(next === "light" ? "Light theme on" : "Dark theme on");
    });
  }

  /* ------------------------------------------------------------------ */
  /* Toast                                                              */
  /* ------------------------------------------------------------------ */
  const toastEl = $("#toast");
  let toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-show"), 2200);
  }

  /* ------------------------------------------------------------------ */
  /* Preloader                                                          */
  /* ------------------------------------------------------------------ */
  const preloader = $("#preloader");
  const preBar = $("#preloaderBar");
  const prePct = $("#preloaderPercent");
  let done = false;
  function finishPreloader() {
    if (done || !preloader) return;
    done = true;
    if (preBar) preBar.style.width = "100%";
    if (prePct) prePct.textContent = "100%";
    setTimeout(() => {
      preloader.classList.add("is-done");
      document.body.classList.remove("is-locked");
      startReveal();
    }, 260);
  }
  if (preloader) {
    let p = 0;
    const tick = setInterval(() => {
      p += Math.random() * 18 + 6;
      if (p >= 100) p = 100;
      if (preBar) preBar.style.width = p + "%";
      if (prePct) prePct.textContent = Math.round(p) + "%";
      if (p >= 100) { clearInterval(tick); finishPreloader(); }
    }, 130);
    window.addEventListener("load", () => setTimeout(finishPreloader, 500));
    setTimeout(finishPreloader, 2600); // hard safety
  } else {
    startReveal();
  }

  /* ------------------------------------------------------------------ */
  /* Custom cursor                                                      */
  /* ------------------------------------------------------------------ */
  const cursor = $("#cursor");
  if (cursor && window.matchMedia("(hover: hover)").matches && !prefersReduced) {
    const dot = $(".cursor__dot", cursor);
    const ring = $(".cursor__ring", cursor);
    let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.classList.remove("is-hidden");
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
    const hoverSel = "a, button, input, textarea, .project-card, .cert, .filter";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverSel)) cursor.classList.add("is-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverSel)) cursor.classList.remove("is-hover");
    });
  }

  /* ------------------------------------------------------------------ */
  /* Scroll: nav, progress, active section                              */
  /* ------------------------------------------------------------------ */
  const nav = $("#nav");
  const progress = $("#scrollProgress");
  const sections = $$("main section[id]");
  const navLinks = $$(".nav__link");

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("is-scrolled", y > 20);
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + "%";

    let current = "";
    for (const sec of sections) {
      if (y >= sec.offsetTop - 150) current = sec.id;
    }
    navLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("is-active", href === "#" + current);
    });
  }
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(() => { onScroll(); ticking = false; }); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------ */
  /* Mobile nav                                                         */
  /* ------------------------------------------------------------------ */
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  function closeNav() {
    if (!toggle || !links) return;
    toggle.classList.remove("is-open");
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", (e) => { if (e.target.closest("a")) closeNav(); });
  }

  /* ------------------------------------------------------------------ */
  /* Reveal on scroll                                                   */
  /* ------------------------------------------------------------------ */
  let revealIO = null;
  const revealSeen = new WeakSet();
  function observeReveal(el) {
    if (revealSeen.has(el)) return;
    revealSeen.add(el);
    if (revealIO) revealIO.observe(el);
    else el.classList.add("is-visible");
  }
  // Called by data.js after it re-renders content.
  window.__nsRefreshReveals = function () {
    if (!("IntersectionObserver" in window) || prefersReduced) {
      $$(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    $$(".reveal").forEach(observeReveal);
  };
  function startReveal() {
    if (!("IntersectionObserver" in window) || prefersReduced) {
      $$(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    revealIO = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = Math.min(i * 70, 350) + "ms";
          entry.target.classList.add("is-visible");
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    window.__nsRefreshReveals();
  }

  /* ------------------------------------------------------------------ */
  /* Counters                                                           */
  /* ------------------------------------------------------------------ */
  const counters = $$("[data-count]");
  function animateCount(el) {
    const target = Number(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";
    if (prefersReduced) { el.textContent = target + suffix; return; }
    const dur = 1500;
    const start = performance.now();
    (function frame(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    })(performance.now());
  }
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  /* ------------------------------------------------------------------ */
  /* Rotating hero word                                                 */
  /* ------------------------------------------------------------------ */
  const rotator = $("#rotator");
  if (rotator && !prefersReduced) {
    const words = ["practical software.", "useful products.", "real solutions.", "clean code."];
    let wi = 0, ci = words[0].length, deleting = true;
    (function tick() {
      const word = words[wi];
      if (deleting) {
        ci--; rotator.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      } else {
        ci++; rotator.textContent = words[wi].slice(0, ci);
        if (ci === words[wi].length) deleting = true;
      }
      const delay = deleting ? 45 : (ci === words[wi].length ? 1700 : 85);
      setTimeout(tick, delay);
    })();
  }

  /* ------------------------------------------------------------------ */
  /* Hero avatar parallax                                              */
  /* ------------------------------------------------------------------ */
  const avatarEl = document.getElementById("avatar");
  if (avatarEl && !prefersReduced) {
    let raf = null;
    window.addEventListener("scroll", () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY * 0.05, 46);
        avatarEl.style.transform = `translateY(${y}px)`;
        raf = null;
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------------------ */
  /* 3D tilt on cards                                                   */
  /* ------------------------------------------------------------------ */
  if (!prefersReduced && window.matchMedia("(hover: hover)").matches) {
    let tiltEl = null;
    const reset = (el) => { if (el) { el.style.transition = ""; el.style.transform = ""; } };
    document.addEventListener("mousemove", (e) => {
      const card = e.target.closest(".project-card, .highlight, .skill-card");
      if (card !== tiltEl) {
        reset(tiltEl);
        tiltEl = card;
        if (tiltEl) tiltEl.style.transition = "transform 0.14s var(--ease), border-color 0.4s var(--ease)";
      }
      if (!tiltEl) return;
      const r = tiltEl.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tiltEl.style.transform = `perspective(760px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    document.addEventListener("mouseleave", () => { reset(tiltEl); tiltEl = null; });
  }

  /* ------------------------------------------------------------------ */
  /* Project filters                                                    */
  /* ------------------------------------------------------------------ */
  const emptyMsg = $("#projectsEmpty");
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#projectFilters .filter");
    if (!btn) return;
    const f = btn.dataset.filter;
    $$("#projectFilters .filter").forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-selected", String(b === btn));
    });
    let visible = 0;
    $$("#projects-grid .project-card").forEach((card) => {
      const match = f === "all" || card.dataset.category === f;
      card.classList.toggle("is-hidden", !match);
      if (match) visible++;
    });
    if (emptyMsg) emptyMsg.hidden = visible !== 0;
  });

  /* ------------------------------------------------------------------ */
  /* Project modal                                                      */
  /* ------------------------------------------------------------------ */
  const modal = $("#modal");
  const modalTag = $("#modalTag");
  const modalTitle = $("#modalTitle");
  const modalDesc = $("#modalDesc");
  const modalStack = $("#modalStack");
  const modalLinks = $("#modalLinks");
  let lastFocus = null;

  function getProject(key) {
    return window.PortfolioData ? window.PortfolioData.getProject(key) : null;
  }

  function openModal(key) {
    const data = getProject(key);
    if (!data || !modal) return;
    lastFocus = document.activeElement;
    modalTag.textContent = data.tag || "";
    modalTitle.textContent = data.title || "";
    modalDesc.textContent = data.desc || "";
    modalStack.innerHTML = (data.stack || []).map((s) => `<span class="chip"></span>`).join("");
    $$(".chip", modalStack).forEach((el, i) => { el.textContent = data.stack[i]; });
    if (modalLinks) {
      modalLinks.innerHTML = data.link
        ? `<a class="btn btn--primary btn--sm" href="${data.link}" target="_blank" rel="noopener noreferrer">Open project ↗</a>`
        : "";
    }
    modal.hidden = false;
    document.body.classList.add("is-locked");
    $(".modal__close").focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("is-locked");
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener("click", (e) => {
    const more = e.target.closest("[data-project]");
    if (more) { openModal(more.dataset.project); return; }
    if (e.target.closest("[data-close]")) {
      if (e.target.closest(".modal")) closeModal();
      if (e.target.closest(".palette")) closePalette();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const card = e.target.closest && e.target.closest(".project-card");
    if (!card || !card.contains(e.target)) return;
    const b = card.querySelector("[data-project]");
    if (b) openModal(b.dataset.project);
  });

  /* ------------------------------------------------------------------ */
  /* Copy email                                                         */
  /* ------------------------------------------------------------------ */
  const copyBtn = $("#copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        toast("Email copied to clipboard");
      } catch (e) {
        window.location.href = "mailto:" + email;
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Contact form                                                       */
  /* ------------------------------------------------------------------ */
  const form = $("#contactForm");
  const status = $("#formStatus");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#name"), email = $("#email"), message = $("#message");
      [name, email, message].forEach((f) => f.classList.remove("is-invalid"));
      let ok = true;
      if (!name.value.trim()) { name.classList.add("is-invalid"); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.classList.add("is-invalid"); ok = false; }
      if (message.value.trim().length < 10) { message.classList.add("is-invalid"); ok = false; }
      if (!ok) { status.style.color = "#ff5c7a"; status.textContent = "Please fill in all fields correctly."; return; }
      const subject = encodeURIComponent("Portfolio enquiry from " + name.value.trim());
      const body = encodeURIComponent(message.value.trim() + "\n\n— " + name.value.trim() + " (" + email.value.trim() + ")");
      const to = (window.PortfolioData && window.PortfolioData.getEmail()) || "salmannandaram2@gmail.com";
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
      status.style.color = "#34d399";
      status.textContent = "Opening your email client…";
      toast("Opening your email client");
      form.reset();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Back to top                                                        */
  /* ------------------------------------------------------------------ */
  const toTop = $("#toTop");
  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" }));

  /* ------------------------------------------------------------------ */
  /* Command palette                                                    */
  /* ------------------------------------------------------------------ */
  const palette = $("#palette");
  const paletteInput = $("#paletteInput");
  const paletteList = $("#paletteList");
  const paletteBtn = $("#paletteBtn");

  const ICONS = {
    section: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
    link: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
    action: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></svg>'
  };

  const COMMANDS = [
    { label: "About", hint: "Section", icon: "section", run: () => go("#about") },
    { label: "Skills", hint: "Section", icon: "section", run: () => go("#skills") },
    { label: "Experience", hint: "Section", icon: "section", run: () => go("#experience") },
    { label: "Projects", hint: "Section", icon: "section", run: () => go("#projects") },
    { label: "Education", hint: "Section", icon: "section", run: () => go("#education") },
    { label: "Contact", hint: "Section", icon: "section", run: () => go("#contact") },
    { label: "Download résumé", hint: "PDF", icon: "link", run: () => { window.location.href = (window.PortfolioData && window.PortfolioData.getResume()) || "assets/Nandaram-Salman-Resume.pdf"; } },
    { label: "GitHub profile", hint: "External", icon: "link", run: () => window.open("https://github.com/salmannandaram3", "_blank", "noopener") },
    { label: "LinkedIn profile", hint: "External", icon: "link", run: () => window.open("https://www.linkedin.com/in/nandaram-salman-2177b43a4", "_blank", "noopener") },
    { label: "Send an email", hint: "Mail", icon: "link", run: () => { window.location.href = "mailto:salmannandaram2@gmail.com"; } },
    { label: "Toggle theme", hint: "Action", icon: "action", run: () => themeBtn && themeBtn.click() },
    { label: "Copy email address", hint: "Action", icon: "action", run: () => copyBtn && copyBtn.click() },
    { label: "Back to top", hint: "Action", icon: "action", run: () => window.scrollTo({ top: 0, behavior: "smooth" }) }
  ];

  function go(hash) {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
  }

  let filtered = COMMANDS.slice();
  let activeIndex = 0;

  function renderPalette() {
    if (!paletteList) return;
    if (!filtered.length) { paletteList.innerHTML = '<div class="palette__empty">No matching commands</div>'; return; }
    paletteList.innerHTML = filtered.map((c, i) => `
      <li class="palette__item${i === activeIndex ? " is-active" : ""}" data-index="${i}">
        <span class="p-ico">${ICONS[c.icon]}</span>
        <span class="p-label">${c.label}</span>
        <span class="p-hint">${c.hint}</span>
      </li>`).join("");
  }
  function runCommand(i) {
    const cmd = filtered[i];
    if (!cmd) return;
    closePalette();
    setTimeout(cmd.run, 60);
  }
  function openPalette() {
    if (!palette) return;
    palette.hidden = false;
    document.body.classList.add("is-locked");
    filtered = COMMANDS.slice();
    activeIndex = 0;
    if (paletteInput) { paletteInput.value = ""; }
    renderPalette();
    setTimeout(() => paletteInput && paletteInput.focus(), 40);
  }
  function closePalette() {
    if (!palette) return;
    palette.hidden = true;
    document.body.classList.remove("is-locked");
  }

  if (paletteBtn) paletteBtn.addEventListener("click", openPalette);
  if (paletteInput) {
    paletteInput.addEventListener("input", () => {
      const q = paletteInput.value.trim().toLowerCase();
      filtered = COMMANDS.filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q));
      activeIndex = 0;
      renderPalette();
    });
  }
  if (paletteList) {
    paletteList.addEventListener("click", (e) => {
      const item = e.target.closest(".palette__item");
      if (item) runCommand(Number(item.dataset.index));
    });
    paletteList.addEventListener("mousemove", (e) => {
      const item = e.target.closest(".palette__item");
      if (item) { activeIndex = Number(item.dataset.index); renderPalette(); }
    });
  }

  document.addEventListener("keydown", (e) => {
    const palOpen = palette && !palette.hidden;
    const modOpen = modal && !modal.hidden;

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      palOpen ? closePalette() : openPalette();
      return;
    }
    if (e.key === "Escape") {
      if (palOpen) closePalette();
      if (modOpen) closeModal();
      closeNav();
      return;
    }
    if (palOpen) {
      if (e.key === "ArrowDown") { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, filtered.length - 1); renderPalette(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); renderPalette(); }
      else if (e.key === "Enter") { e.preventDefault(); runCommand(activeIndex); }
    }
  });
})();

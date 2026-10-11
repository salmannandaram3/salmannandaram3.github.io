/* ==========================================================================
   Nandaram Salman — Portfolio content engine + built-in editor
   All sections are data-driven. Changes save to localStorage and can be
   exported / imported as JSON so you can add anything you want.
   ========================================================================== */
(function () {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const STORAGE_KEY = "ns-portfolio-content-v1";
  const uid = () => "id" + Math.random().toString(36).slice(2, 9);

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const splitComma = (s) => String(s || "").split(",").map((x) => x.trim()).filter(Boolean);
  const splitLines = (s) => String(s || "").split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

  const LABELS = { ai: "AI / ML", web: "Web Apps", tools: "Tools", data: "Data", design: "Design", other: "Other" };
  const catLabel = (c) => LABELS[c] || (c ? c.charAt(0).toUpperCase() + c.slice(1) : "Other");

  const ICON_PATHS = {
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    list: '<path d="M4 6h16M4 12h16M4 18h10"/>',
    building: '<path d="M3 21h18M5 21V10l7-5 7 5v11M10 21v-6h4v6"/>',
    code: '<path d="m8 9-3 3 3 3M16 9l3 3-3 3M13 6l-2 12"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 14 3-3 3 3 4-6"/>',
    shield: '<path d="M12 2 3 7v6c0 5 3.8 8.4 9 9 5.2-.6 9-4 9-9V7l-9-5Z"/><path d="m9 12 2 2 4-4"/>',
    star: '<path d="m12 3 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9 6.8 19l1-5.8-4.2-4.1 5.8-.8L12 3Z"/>'
  };
  const iconSvg = (name) =>
    `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8">${ICON_PATHS[name] || ICON_PATHS.code}</svg>`;

  /* ------------------------------------------------------------------ */
  /* Default content (everything from the résumé)                       */
  /* ------------------------------------------------------------------ */
  function defaults() {
    return {
      profile: {
        name: "Nandaram Salman",
        headline: "a developer who builds",
        status: "Open to internships & entry-level software roles",
        summary: "Computer Science undergraduate passionate about software development, AI/ML and building websites and applications that solve real problems. Hands-on experience through internships with SmartBridge and Brain O Vision.",
        aboutLead: "I'm a Computer Science and Engineering undergraduate with hands-on exposure to Java, Python and web application development. I enjoy turning ideas into working software and learning the fundamentals properly along the way.",
        aboutBody: "Through internships with SmartBridge and Brain O Vision I gained practical experience in software development, databases, data processing and AI/ML concepts. I'm driven by problem solving, emerging technologies and building solutions people find genuinely useful.",
        facts: [
          { label: "Location", value: "Tirupati, Andhra Pradesh, India" },
          { label: "Focus", value: "Software Development, AI/ML, Web Apps" },
          { label: "Languages", value: "Java, Python, C" },
          { label: "Status", value: "B.Tech CSE · 2023–2027" }
        ],
        email: "salmannandaram2@gmail.com",
        phone: "+91 86882 72598",
        linkedin: "https://www.linkedin.com/in/nandaram-salman-2177b43a4",
        github: "https://github.com/salmannandaram3"
      },
      skills: [
        { id: uid(), title: "Programming Languages", items: ["Java", "Python", "C"] },
        { id: uid(), title: "Web Technologies", items: ["HTML", "CSS"] },
        { id: uid(), title: "Databases & Tools", items: ["MongoDB"] }
      ],
      experience: [
        { id: uid(), role: "Python Full Stack / AI Intern", org: "Brain O Vision", period: "", desc: "Focused on Python programming, data science, machine learning and web application development. Built an AI-Based Email Classification System using Python, NLP and machine learning.", tags: ["Python", "NLP", "Machine Learning", "Web Dev"] },
        { id: uid(), role: "Virtual Intern", org: "SmartBridge", period: "", desc: "Completed a technical internship focused on software development, databases and emerging technologies. Gained practical experience with development tools, application development fundamentals and problem solving.", tags: ["Software Development", "Databases", "Problem Solving"] }
      ],
      projects: [
        { id: "email", category: "ai", tag: "AI / ML", icon: "mail", title: "AI-Based Email Classification System", desc: "A web app that analyses and classifies email messages using machine learning and NLP, flagging spam and important emails via preprocessing.", stack: ["Python", "NLP", "Machine Learning"], link: "" },
        { id: "tickets", category: "web", tag: "Web App", icon: "list", title: "Support Ticket System", desc: "A ticket management system where users raise support requests and staff manage, update and resolve them, with role-based workflows and status tracking.", stack: ["HTML", "JavaScript", "MongoDB"], link: "" },
        { id: "darshanease", category: "web", tag: "Web App", icon: "building", title: "Darshanease — Temple Booking System", desc: "A temple booking platform letting devotees view services, pick dates and time slots, and book online with a simple, friendly workflow.", stack: ["Web App", "Booking Workflow", "UI/UX"], link: "" }
      ],
      highlights: [
        { id: uid(), title: "Communication & teamwork", desc: "Strong communication and collaboration skills built through academic and internship work." },
        { id: uid(), title: "Quick learner", desc: "Fast to pick up new tools and technologies, with a genuine interest in emerging tech." },
        { id: uid(), title: "Problem-solving mindset", desc: "Approach challenges methodically and enjoy finding practical, working solutions." },
        { id: uid(), title: "Adaptable", desc: "Able to adapt to new technologies and environments quickly and confidently." }
      ],
      education: [
        { id: uid(), role: "B.Tech, Computer Science & Engineering", org: "Annamacharya Institute of Technology and Sciences, Tirupati", period: "2023 — 2027", score: "CGPA 7.52 / 10" },
        { id: uid(), role: "Intermediate Education", org: "Rayalaseema Junior College", period: "2021 — 2023", score: "8.3 / 10" },
        { id: uid(), role: "Secondary School Education", org: "Z.P. Babu Agraharam", period: "2021", score: "9.7 / 10" }
      ],
      certifications: [
        { id: uid(), title: "Virtual Internship", issuer: "SmartBridge", link: "" },
        { id: uid(), title: "Internship Certification", issuer: "Brain O Vision", link: "" },
        { id: uid(), title: "Generative AI Workshop", issuer: "with Hackathon", link: "" }
      ]
    };
  }

  /* ------------------------------------------------------------------ */
  /* Load / save                                                        */
  /* ------------------------------------------------------------------ */
  let state;
  function load() {
    let stored = null;
    try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { /* ignore */ }
    const base = defaults();
    if (!stored || typeof stored !== "object") return base;
    Object.keys(base).forEach((k) => { if (stored[k] !== undefined) base[k] = stored[k]; });
    base.profile = Object.assign(defaults().profile, stored.profile || {});
    if (!Array.isArray(base.profile.facts)) base.profile.facts = defaults().profile.facts;
    return base;
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; }
    catch (e) { return false; }
  }

  /* ------------------------------------------------------------------ */
  /* Small toast helper                                                 */
  /* ------------------------------------------------------------------ */
  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-show"), 2400);
  }

  /* ------------------------------------------------------------------ */
  /* Renderers                                                          */
  /* ------------------------------------------------------------------ */
  const editing = () => document.body.classList.contains("editing");

  function controls(type, id) {
    if (!editing()) return "";
    return `<span class="ed-ctl">
      <button type="button" class="ed-btn" data-edit="${type}:${id}" title="Edit" aria-label="Edit">✎</button>
      <button type="button" class="ed-btn ed-btn--danger" data-del="${type}:${id}" title="Delete" aria-label="Delete">✕</button>
    </span>`;
  }
  function addBtn(type, label, wrapLi) {
    if (!editing()) return "";
    const b = `<button type="button" class="ed-add" data-add="${type}">＋ ${label}</button>`;
    return wrapLi ? `<li class="ed-add-item">${b}</li>` : b;
  }

  function renderProfile() {
    const p = state.profile;
    const set = (sel, text) => { const el = $(sel); if (el) el.textContent = text; };
    set("#heroName", p.name);
    set("#heroHeadline", p.headline);
    set("#heroStatus", p.status);
    set("#heroSummary", p.summary);
    set("#aboutLead", p.aboutLead);
    set("#aboutBody", p.aboutBody);

    const facts = $("#aboutFacts");
    if (facts) facts.innerHTML = (p.facts || []).map((f) => `<li><span>${esc(f.label)}</span>${esc(f.value)}</li>`).join("");

    const stats = $$(".hero__stats .stat [data-count]");
    if (stats.length >= 4) {
      const vals = [
        state.projects.length,
        state.experience.length,
        state.certifications.length,
        state.skills.reduce((n, s) => n + (s.items || []).length, 0)
      ];
      stats.forEach((el, i) => {
        el.dataset.count = vals[i];
        el.dataset.suffix = (i === 0 || i === 3) ? "+" : "";
        el.textContent = vals[i] + el.dataset.suffix;
      });
    }

    const ce = $("#copyEmail");
    if (ce) ce.dataset.email = p.email;
    const railEmail = $(".rail__email");
    if (railEmail) { railEmail.textContent = p.email; railEmail.href = "mailto:" + p.email; }
    const railLinks = $$(".rail a[href^='mailto']");
    railLinks.forEach((a) => { a.href = "mailto:" + p.email; });

    const list = $("#contactList");
    if (list) {
      const rows = [
        { ico: "✉", label: p.email, href: "mailto:" + p.email },
        { ico: "☎", label: p.phone, href: "tel:" + String(p.phone).replace(/[^+\d]/g, "") },
        { ico: "in", label: String(p.linkedin).replace(/^https?:\/\//, ""), href: p.linkedin },
        { ico: "⌥", label: String(p.github).replace(/^https?:\/\//, ""), href: p.github }
      ].filter((r) => r.label);
      list.innerHTML = rows.map((r) =>
        `<li><span class="contact__ico">${esc(r.ico)}</span><a href="${esc(r.href)}" target="_blank" rel="noopener noreferrer">${esc(r.label)}</a></li>`
      ).join("");
    }
  }

  function renderSkills() {
    const wrap = $("#skillsGrid");
    if (!wrap) return;
    wrap.innerHTML = state.skills.map((s, i) => `
      <article class="skill-card reveal">
        ${controls("skill", s.id)}
        <div class="skill-card__head"><span class="skill-card__num">${String(i + 1).padStart(2, "0")}</span><h3>${esc(s.title)}</h3></div>
        <div class="chips">${(s.items || []).map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>
      </article>`).join("") + addBtn("skill", "Add category");
  }

  function renderExperience() {
    const wrap = $("#experienceList");
    if (!wrap) return;
    wrap.innerHTML = state.experience.map((e) => `
      <li class="timeline__item reveal">
        <span class="timeline__marker" aria-hidden="true"></span>
        <div class="timeline__card">
          ${controls("experience", e.id)}
          <div class="timeline__top">
            <span class="timeline__role">${esc(e.role)}</span>
            ${e.period ? `<span class="timeline__period">${esc(e.period)}</span>` : ""}
          </div>
          ${e.org ? `<h3 class="timeline__company">${esc(e.org)}</h3>` : ""}
          ${e.desc ? `<p>${esc(e.desc)}</p>` : ""}
          ${(e.tags || []).length ? `<div class="chips chips--sm">${e.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>` : ""}
        </div>
      </li>`).join("") + addBtn("experience", "Add internship / role", true);
  }

  function renderHighlights() {
    const wrap = $("#highlightsGrid");
    if (!wrap) return;
    wrap.innerHTML = state.highlights.map((h) => `
      <article class="highlight reveal">
        ${controls("highlight", h.id)}
        <span class="highlight__icon">◆</span>
        <h3>${esc(h.title)}</h3>
        <p>${esc(h.desc)}</p>
      </article>`).join("") + addBtn("highlight", "Add highlight");
  }

  function renderProjects() {
    const grid = $("#projects-grid");
    const filters = $("#projectFilters");
    if (!grid) return;

    if (filters) {
      const cats = ["all"];
      state.projects.forEach((p) => { if (p.category && !cats.includes(p.category)) cats.push(p.category); });
      filters.innerHTML = cats.map((c) =>
        `<button class="filter${c === "all" ? " is-active" : ""}" data-filter="${esc(c)}" role="tab" aria-selected="${c === "all"}">${c === "all" ? "All" : esc(catLabel(c))}</button>`
      ).join("");
    }

    grid.innerHTML = state.projects.map((p) => `
      <article class="project-card reveal" data-category="${esc(p.category)}" tabindex="0">
        <div class="project-card__glow"></div>
        ${controls("project", p.id)}
        <div class="project-card__top">
          <span class="project-card__icon">${iconSvg(p.icon)}</span>
          <span class="project-card__tag">${esc(p.tag || catLabel(p.category))}</span>
        </div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.desc)}</p>
        <div class="chips chips--sm">${(p.stack || []).map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
        <button class="project-card__more" data-project="${esc(p.id)}">Details →</button>
      </article>`).join("") + addBtn("project", "Add project");
  }

  function renderEducation() {
    const wrap = $("#educationList");
    if (!wrap) return;
    wrap.innerHTML = state.education.map((e) => `
      <li class="timeline__item">
        <span class="timeline__marker" aria-hidden="true"></span>
        <div class="timeline__card">
          ${controls("education", e.id)}
          <div class="timeline__top">
            <span class="timeline__role">${esc(e.role)}</span>
            ${e.period ? `<span class="timeline__period">${esc(e.period)}</span>` : ""}
          </div>
          ${e.org ? `<h3 class="timeline__company">${esc(e.org)}</h3>` : ""}
          ${e.score ? `<span class="score">${esc(e.score)}</span>` : ""}
        </div>
      </li>`).join("") + addBtn("education", "Add education", true);
  }

  function renderCertifications() {
    const wrap = $("#certList");
    if (!wrap) return;
    wrap.innerHTML = state.certifications.map((c, i) => {
      const inner = `
        <span class="cert__badge">${String(i + 1).padStart(2, "0")}</span>
        <span class="cert__body"><strong>${esc(c.title)}</strong><em>${esc(c.issuer)}</em></span>
        <span class="cert__arrow">↗</span>
        ${controls("certification", c.id)}`;
      return c.link
        ? `<a class="cert" href="${esc(c.link)}" target="_blank" rel="noopener noreferrer">${inner}</a>`
        : `<div class="cert">${inner}</div>`;
    }).join("") + addBtn("certification", "Add certification");
  }

  function renderAll() {
    renderProfile();
    renderSkills();
    renderExperience();
    renderHighlights();
    renderProjects();
    renderEducation();
    renderCertifications();
    if (window.__nsRefreshReveals) window.__nsRefreshReveals();
  }

  /* ------------------------------------------------------------------ */
  /* Editor UI                                                          */
  /* ------------------------------------------------------------------ */
  const FORMS = {
    profile: [
      { key: "name", label: "Name", type: "text" },
      { key: "headline", label: "Headline (line under your name)", type: "text" },
      { key: "status", label: "Availability / status pill", type: "text" },
      { key: "summary", label: "Hero summary", type: "textarea" },
      { key: "aboutLead", label: "About — first paragraph", type: "textarea" },
      { key: "aboutBody", label: "About — second paragraph", type: "textarea" },
      { key: "facts", label: "About facts (one per line as: Label | Value)", type: "textarea" },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "linkedin", label: "LinkedIn URL", type: "text" },
      { key: "github", label: "GitHub URL", type: "text" }
    ],
    skill: [
      { key: "title", label: "Category name", type: "text" },
      { key: "items", label: "Skills (comma separated)", type: "textarea" }
    ],
    experience: [
      { key: "role", label: "Role / title", type: "text" },
      { key: "org", label: "Company / organisation", type: "text" },
      { key: "period", label: "Period (optional)", type: "text" },
      { key: "desc", label: "Description", type: "textarea" },
      { key: "tags", label: "Tags (comma separated)", type: "textarea" }
    ],
    project: [
      { key: "title", label: "Project title", type: "text" },
      { key: "category", label: "Category", type: "select", options: [{ v: "ai", t: "AI / ML" }, { v: "web", t: "Web Apps" }, { v: "tools", t: "Tools" }, { v: "data", t: "Data" }, { v: "design", t: "Design" }, { v: "other", t: "Other" }] },
      { key: "tag", label: "Badge label (optional)", type: "text" },
      { key: "icon", label: "Icon", type: "select", options: [{ v: "code", t: "Code" }, { v: "mail", t: "Mail" }, { v: "list", t: "List" }, { v: "building", t: "Building" }, { v: "chart", t: "Chart" }, { v: "shield", t: "Shield" }, { v: "star", t: "Star" }] },
      { key: "desc", label: "Description", type: "textarea" },
      { key: "stack", label: "Tech stack (comma separated)", type: "textarea" },
      { key: "link", label: "Link (optional)", type: "text" }
    ],
    highlight: [
      { key: "title", label: "Title", type: "text" },
      { key: "desc", label: "Description", type: "textarea" }
    ],
    education: [
      { key: "role", label: "Qualification", type: "text" },
      { key: "org", label: "Institution", type: "text" },
      { key: "period", label: "Period", type: "text" },
      { key: "score", label: "Score / grade (optional)", type: "text" }
    ],
    certification: [
      { key: "title", label: "Certificate title", type: "text" },
      { key: "issuer", label: "Issuer", type: "text" },
      { key: "link", label: "Link (optional)", type: "text" }
    ]
  };
  const COLLECTION = { skill: "skills", experience: "experience", project: "projects", highlight: "highlights", education: "education", certification: "certifications" };
  const TITLES = { profile: "Edit profile", skill: "skill category", experience: "internship / role", project: "project", highlight: "highlight", education: "education entry", certification: "certification" };

  let editor, editorForm, editorTitle, current = null;

  function buildEditor() {
    editor = document.createElement("div");
    editor.className = "editor";
    editor.id = "editor";
    editor.hidden = true;
    editor.setAttribute("role", "dialog");
    editor.setAttribute("aria-modal", "true");
    editor.innerHTML = `
      <div class="editor__backdrop" data-edclose></div>
      <form class="editor__panel" id="editorForm" novalidate>
        <div class="editor__head">
          <h3 id="editorTitle">Edit</h3>
          <button type="button" class="modal__close" data-edclose aria-label="Close">✕</button>
        </div>
        <div class="editor__fields" id="editorFields"></div>
        <div class="editor__foot">
          <button type="button" class="btn btn--ghost btn--sm" data-edclose>Cancel</button>
          <button type="submit" class="btn btn--primary btn--sm">Save</button>
        </div>
      </form>`;
    document.body.appendChild(editor);
    editorForm = $("#editorForm");
    editorTitle = $("#editorTitle");

    editor.addEventListener("click", (e) => { if (e.target.closest("[data-edclose]")) closeEditor(); });
    editorForm.addEventListener("submit", (e) => { e.preventDefault(); saveEditor(); });
  }

  function valueFor(type, key, item) {
    if (type === "profile") {
      if (key === "facts") return (state.profile.facts || []).map((f) => `${f.label} | ${f.value}`).join("\n");
      return state.profile[key] || "";
    }
    const v = item ? item[key] : "";
    return Array.isArray(v) ? v.join(", ") : (v || "");
  }

  function openEditor(type, id) {
    if (!editor) buildEditor();
    let item = null;
    if (type === "profile") item = state.profile;
    else {
      const coll = COLLECTION[type];
      item = (state[coll] || []).find((x) => x.id === id) || null;
    }
    current = { type, id: item ? id : null };
    editorTitle.textContent = (id || type === "profile" ? "Edit " : "Add ") + (TITLES[type] || "item");

    const fields = FORMS[type] || [];
    $("#editorFields").innerHTML = fields.map((f) => {
      const val = valueFor(type, f.key, item);
      if (f.type === "textarea") return `<div class="field"><label>${esc(f.label)}</label><textarea data-field="${f.key}" rows="3">${esc(val)}</textarea></div>`;
      if (f.type === "select") return `<div class="field"><label>${esc(f.label)}</label><select data-field="${f.key}">${f.options.map((o) => `<option value="${esc(o.v)}"${o.v === val ? " selected" : ""}>${esc(o.t)}</option>`).join("")}</select></div>`;
      return `<div class="field"><label>${esc(f.label)}</label><input type="text" data-field="${f.key}" value="${esc(val)}" /></div>`;
    }).join("");

    editor.hidden = false;
    document.body.classList.add("is-locked");
    const first = editor.querySelector("[data-field]");
    if (first) first.focus();
  }

  function closeEditor() {
    if (!editor) return;
    editor.hidden = true;
    document.body.classList.remove("is-locked");
    current = null;
  }

  function saveEditor() {
    if (!current) return;
    const data = {};
    $$("[data-field]", editorForm).forEach((el) => { data[el.dataset.field] = el.value; });
    const { type, id } = current;

    if (type === "profile") {
      ["name", "headline", "status", "summary", "aboutLead", "aboutBody", "email", "phone", "linkedin", "github"].forEach((k) => {
        if (data[k] !== undefined) state.profile[k] = data[k].trim();
      });
      state.profile.facts = splitLines(data.facts).map((line) => {
        const i = line.indexOf("|");
        return i === -1 ? { label: line, value: "" } : { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
      });
    } else {
      const coll = COLLECTION[type];
      const arr = state[coll];
      let item = id ? arr.find((x) => x.id === id) : null;
      if (!item) { item = { id: uid() }; arr.push(item); }
      if (type === "skill") { item.title = data.title.trim(); item.items = splitComma(data.items); }
      else if (type === "experience") { item.role = data.role.trim(); item.org = data.org.trim(); item.period = data.period.trim(); item.desc = data.desc.trim(); item.tags = splitComma(data.tags); }
      else if (type === "project") { item.title = data.title.trim(); item.category = data.category; item.tag = data.tag.trim(); item.icon = data.icon; item.desc = data.desc.trim(); item.stack = splitComma(data.stack); item.link = data.link.trim(); }
      else if (type === "highlight") { item.title = data.title.trim(); item.desc = data.desc.trim(); }
      else if (type === "education") { item.role = data.role.trim(); item.org = data.org.trim(); item.period = data.period.trim(); item.score = data.score.trim(); }
      else if (type === "certification") { item.title = data.title.trim(); item.issuer = data.issuer.trim(); item.link = data.link.trim(); }
    }

    save();
    renderAll();
    closeEditor();
    toast("Saved");
  }

  function deleteItem(type, id) {
    const coll = COLLECTION[type];
    if (!coll) return;
    if (!window.confirm("Delete this item?")) return;
    state[coll] = state[coll].filter((x) => x.id !== id);
    save();
    renderAll();
    toast("Deleted");
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "portfolio-content.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    toast("Exported portfolio-content.json");
  }

  function importJSON() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          state = Object.assign(defaults(), parsed);
          state.profile = Object.assign(defaults().profile, parsed.profile || {});
          if (!Array.isArray(state.profile.facts)) state.profile.facts = defaults().profile.facts;
          save();
          renderAll();
          toast("Imported successfully");
        } catch (e) {
          toast("Could not read that JSON file");
        }
      };
      reader.readAsText(file);
    });
    input.click();
  }

  function resetAll() {
    if (!window.confirm("Reset all content back to the résumé defaults? This cannot be undone.")) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    state = defaults();
    save();
    renderAll();
    toast("Reset to defaults");
  }

  /* ------------------------------------------------------------------ */
  /* Edit-mode chrome                                                   */
  /* ------------------------------------------------------------------ */
  function buildChrome() {
    const fab = document.createElement("button");
    fab.className = "edit-fab";
    fab.id = "editFab";
    fab.type = "button";
    fab.title = "Edit portfolio content";
    fab.setAttribute("aria-label", "Edit portfolio content");
    fab.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>';
    document.body.appendChild(fab);

    const bar = document.createElement("div");
    bar.className = "edit-bar";
    bar.id = "editBar";
    bar.hidden = true;
    bar.innerHTML = `
      <span class="edit-bar__dot"></span>
      <span class="edit-bar__label">Edit mode — changes save automatically</span>
      <button type="button" data-action="profile">Profile</button>
      <button type="button" data-action="export">Export</button>
      <button type="button" data-action="import">Import</button>
      <button type="button" data-action="reset">Reset</button>
      <button type="button" data-action="done" class="edit-bar__done">Done</button>`;
    document.body.appendChild(bar);

    fab.addEventListener("click", () => toggleEdit());
    bar.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const a = btn.dataset.action;
      if (a === "done") toggleEdit();
      else if (a === "profile") openEditor("profile");
      else if (a === "export") exportJSON();
      else if (a === "import") importJSON();
      else if (a === "reset") resetAll();
    });
  }

  function toggleEdit() {
    const on = document.body.classList.toggle("editing");
    const bar = $("#editBar");
    if (bar) bar.hidden = !on;
    if (editor && !editor.hidden) closeEditor();
    renderAll();
    toast(on ? "Edit mode on" : "Edit mode off");
  }

  /* ------------------------------------------------------------------ */
  /* Global click handling for edit/delete/add                         */
  /* ------------------------------------------------------------------ */
  document.addEventListener("click", (e) => {
    const edit = e.target.closest("[data-edit]");
    if (edit) {
      const [type, id] = edit.dataset.edit.split(":");
      // stop the project "Details" handler from firing
      e.preventDefault();
      openEditor(type, id);
      return;
    }
    const del = e.target.closest("[data-del]");
    if (del) {
      const [type, id] = del.dataset.del.split(":");
      e.preventDefault();
      deleteItem(type, id);
      return;
    }
    const add = e.target.closest("[data-add]");
    if (add) { e.preventDefault(); openEditor(add.dataset.add, null); }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && editor && !editor.hidden) closeEditor();
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "e") { e.preventDefault(); toggleEdit(); }
  });

  /* ------------------------------------------------------------------ */
  /* Boot                                                               */
  /* ------------------------------------------------------------------ */
  state = load();
  renderAll();
  buildChrome();

  window.PortfolioData = {
    get state() { return state; },
    getProject: (id) => (state.projects || []).find((p) => p.id === id) || null,
    getEmail: () => state.profile.email,
    render: renderAll
  };
})();

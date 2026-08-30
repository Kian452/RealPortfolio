(function () {
  const LANG_KEY = "kg-portfolio-lang";

  function getLang() {
    const stored = localStorage.getItem(LANG_KEY);
    return stored === "en" || stored === "de" ? stored : "de";
  }

  function resolve(path, dict) {
    return path
      .split(".")
      .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), dict);
  }

  function applyTranslations(lang) {
    const dict = translations[lang];
    if (!dict) return;

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = resolve(el.getAttribute("data-i18n"), dict);
      if (value === null) return;
      el.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const spec = el.getAttribute("data-i18n-attr");
      spec.split(";").forEach((pair) => {
        const [attr, path] = pair.split(":").map((s) => s.trim());
        if (!attr || !path) return;
        const value = resolve(path, dict);
        if (value !== null) el.setAttribute(attr, value);
      });
    });

    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.lang === lang ? "true" : "false");
    });
  }

  function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
    applyTranslations(lang);
  }

  function initLangToggle() {
    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });
  }

  function initMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyTranslations(getLang());
    initLangToggle();
    initMobileNav();
  });
})();

(function () {
  const CONTACT_EMAIL = "kiangray.business@gmail.com";

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    if (!form || !status) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.elements["name"].value.trim();
      const email = form.elements["email"].value.trim();
      const message = form.elements["message"].value.trim();

      const subject = `Portfolio-Kontakt von ${name}`;
      const body = `${message}\n\n---\n${name}\n${email}`;
      const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;

      const lang = document.documentElement.lang === "en" ? "en" : "de";
      status.textContent = translations[lang].contact.formSuccess;
      status.classList.add("visible", "success");
    });
  });
})();

/*
  Möchtest du das Formular ohne E-Mail-Programm senden (z. B. über Formspree
  oder EmailJS), ersetze den obigen Submit-Handler durch einen fetch()-Aufruf
  an deinen Formular-Endpoint, z. B.:

  fetch("https://formspree.io/f/DEIN_ENDPOINT", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: new FormData(form),
  });
*/

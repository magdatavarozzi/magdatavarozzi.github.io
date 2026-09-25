// LANGUAGE TOGGLE
const enBtn = document.getElementById("enBtn");
const frBtn = document.getElementById("frBtn");

function setLanguage(lang) {
    document.querySelectorAll("[data-en]").forEach(el => {
        const v = el.getAttribute(`data-${lang}`);
        if (v !== null) el.innerText = v;
    });

    document.querySelectorAll("[data-en-placeholder]").forEach(el => {
        const ph = el.getAttribute(`data-${lang}-placeholder`);
        if (ph) el.placeholder = ph;
    });

    enBtn.classList.toggle("active", lang === "en");
    frBtn.classList.toggle("active", lang === "fr");
    enBtn.setAttribute("aria-pressed", lang === "en");
    frBtn.setAttribute("aria-pressed", lang === "fr");

    document.documentElement.lang = lang;
    try { localStorage.setItem("mtwd-lang", lang); } catch (e) {}
}

// Shared with booking.html: remembered choice, else the browser's language
function initialLanguage() {
    try {
        const saved = localStorage.getItem("mtwd-lang");
        if (saved === "en" || saved === "fr") return saved;
    } catch (e) {}
    return (navigator.language || "").toLowerCase().startsWith("fr") ? "fr" : "en";
}

setLanguage(initialLanguage());
enBtn.onclick = () => setLanguage("en");
frBtn.onclick = () => setLanguage("fr");

// CONTACT FORM (Formspree, Vanilla JS Ajax)
// Works without JavaScript too: the form's action/method post straight to Formspree.
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const formMsgs = {
    en: { sending: "Sending…", success: "Thanks! Your message was sent. I'll reply soon.", error: "Your message didn't send.", network: "Your message didn't send. Check your connection and try again." },
    fr: { sending: "Envoi en cours…", success: "Merci! Votre message a été envoyé. Je vous répondrai bientôt.", error: "Votre message n'a pas été envoyé.", network: "Votre message n'a pas été envoyé. Vérifiez votre connexion et réessayez." }
};

function showStatus(key, state, detail) {
    const lang = document.documentElement.lang === "fr" ? "fr" : "en";
    formStatus.textContent = formMsgs[lang][key] + (detail ? ` (${detail})` : "");
    formStatus.className = state || "";
}

if (contactForm) {
    contactForm.addEventListener("submit", async e => {
        e.preventDefault();
        const button = contactForm.querySelector("button[type=submit]");
        button.disabled = true;
        showStatus("sending");
        let res;
        try {
            res = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: { Accept: "application/json" }
            });
        } catch (err) {
            showStatus("network", "err");
            button.disabled = false;
            return;
        }
        if (res.ok) {
            contactForm.reset();
            showStatus("success", "ok");
        } else {
            // Show Formspree's own reason (e.g. reCAPTCHA, unverified email, invalid field)
            let detail = `error ${res.status}`;
            try {
                const data = await res.json();
                if (data && Array.isArray(data.errors) && data.errors.length) {
                    detail = data.errors.map(x => x.message).filter(Boolean).join(", ") || detail;
                } else if (data && data.error) {
                    detail = data.error;
                }
            } catch (err) {}
            showStatus("error", "err", detail);
            console.error("Formspree:", res.status, detail);
        }
        button.disabled = false;
    });
}

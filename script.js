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

// FINANCE TRACKER — decimals + green/red full-line
const trackerForm = document.getElementById("trackerForm");
const transactionsList = document.getElementById("transactions");
const balanceDisplay = document.getElementById("balance");

let balance = 0;

function fmt(value) {
    return `$${value.toFixed(2)}`;
}

if (trackerForm) {
    trackerForm.addEventListener("submit", e => {
        e.preventDefault();

        const desc = document.getElementById("desc").value.trim();
        const amount = parseFloat(document.getElementById("amount").value);
        const type = document.getElementById("type").value;

        if (!desc || isNaN(amount)) return;

        const li = document.createElement("li");

        if (type === "income") li.classList.add("income-item");
        else li.classList.add("expense-item");

        li.innerHTML = `
            <div class="tx-left">
                <span class="tx-desc"></span>
                <span class="tx-amount"></span>
            </div>
            <button class="tx-delete" aria-label="Delete">×</button>
        `;
        li.querySelector(".tx-desc").textContent = desc;
        li.querySelector(".tx-amount").textContent = fmt(amount);

        li.dataset.amount = amount;
        li.dataset.type = type;

        transactionsList.appendChild(li);

        balance += type === "income" ? amount : -amount;
        balanceDisplay.textContent = fmt(balance);

        trackerForm.reset();
        document.getElementById("type").value = "income";
    });

    transactionsList.addEventListener("click", e => {
        if (!e.target.classList.contains("tx-delete")) return;

        const li = e.target.closest("li");
        const amount = parseFloat(li.dataset.amount);
        const type = li.dataset.type;

        balance += type === "income" ? -amount : amount;
        balanceDisplay.textContent = fmt(balance);

        li.remove();
    });
}

// CONTACT FORM (Formspree)
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const formMsgs = {
    en: { sending: "Sending…", success: "Thanks! Your message was sent. I'll reply soon.", error: "Your message didn't send. Check your connection and try again." },
    fr: { sending: "Envoi en cours…", success: "Merci! Votre message a été envoyé. Je vous répondrai bientôt.", error: "Votre message n'a pas été envoyé. Vérifiez votre connexion et réessayez." }
};

function showStatus(key, state) {
    const lang = document.documentElement.lang === "fr" ? "fr" : "en";
    formStatus.textContent = formMsgs[lang][key];
    formStatus.className = state || "";
}

if (contactForm) {
    contactForm.addEventListener("submit", async e => {
        e.preventDefault();
        const button = contactForm.querySelector("button[type=submit]");
        button.disabled = true;
        showStatus("sending");
        try {
            const res = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: { Accept: "application/json" }
            });
            if (!res.ok) throw new Error(res.status);
            contactForm.reset();
            showStatus("success", "ok");
        } catch (err) {
            showStatus("error", "err");
        } finally {
            button.disabled = false;
        }
    });
}

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

    document.documentElement.lang = lang;
}

setLanguage("en");
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
                <span class="tx-desc">${desc}</span>
                <span class="tx-amount">${fmt(amount)}</span>
            </div>
            <button class="tx-delete">×</button>
        `;

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

// CONTACT FORM
const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", e => {
        e.preventDefault();
        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const message = contactForm.message.value.trim();
        const mailto = `mailto:magdatavarozzi@hotmail.com?subject=${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0D%0AFrom:%20${encodeURIComponent(email)}`;
        window.location.href = mailto;
    });
}


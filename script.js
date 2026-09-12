// Configuration
const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxmJELRpugwDjDo_MOlppUq1VZrt1101d_E68XOTUTpUOkVVvlwmLOZA-zilNhRoxc3/exec";

const CONTACT_EMAIL = "nelli@example.com"; // centralised, change here
const CONTACT_PHONE = "+420 000 000 000"; // centralised, change here

// Translations (keys used in data-t / data-placeholder)
const TRANSLATIONS = {
    uk: {
        aboutNav: "Про мене",
        portfolioNav: "Портфоліо",
        servicesNav: "Послуги",
        contactNav: "Контакти",

        heroEyebrow: "ФОТОГРАФІЯ · ПРАГА · ЄВРОПА",
        hero1: "ТВОЯ",
        hero2: "ІСТОРІЯ",
        heroText: "Фотографія про людей, почуття та моменти, які хочеться залишити з собою назавжди.",
        heroButton: "Забронювати зйомку",

        aboutEyebrow: "ПРО МЕНЕ",
        aboutTitle1: "ПРИВІТ,",
        aboutTitle2: "Я НЕЛЛІ.",
        aboutText1: "Я фотографую людей такими, якими вони є — справжніми, живими та різними.",
        aboutText2: "Для мене фотографія — це не просто світло та композиція. Це почуття, яке повертає вас у конкретний момент.",
        aboutText3: "На моїх зйомках не потрібно вміти позувати. Я допоможу вам розслабитися і бути собою.",

        portfolioEyebrow: "ВИБРАНІ РОБОТИ",
        portfolioTitle1: "МОЇ",
        portfolioTitle2: "РОБОТИ",
        wedding: "Весілля",
        weddingWork: "Цей день",
        love: "Історія кохання",
        loveWork: "Тільки ми",
        portrait: "Портрет",
        portraitWork: "Її історія",
        couple: "Пара",
        coupleWork: "Разом",
        youWork: "Ти",

        servicesEyebrow: "ПОСЛУГИ",
        servicesTitle1: "ЩО Я",
        servicesTitle2: "РОБЛЮ",
        portraitTitle: "Портрет",
        portraitText: "Індивідуальні портрети, особистий бренд та зйомки для себе.",
        loveTitle: "Історія кохання",
        loveText: "Щирі історії двох людей — прогулянки, побачення та особливі моменти.",
        weddingTitle: "Весілля",
        weddingText: "Повний день або окремі частини весілля — від деталей до справжніх емоцій.",

        contactEyebrow: "КОНТАКТИ",
        contactTitle1: "ДАВАЙТЕ",
        contactTitle2: "СТВОРЮВАТИ",
        contactText: "Розкажіть мені про вашу ідею. Я особисто зв'яжуся з вами.",

        nameLabel: "Ім'я та прізвище",
        phoneLabel: "Телефон",
        emailLabel: "Електронна пошта",
        messageLabel: "Повідомлення",
        submit: "Надіслати заявку",

        footer: "© 2026 Nelli Photography",

        // placeholders
        name: "Ваше ім'я",
        phone: "+420...",
        email: "email@example.com",
        message: "Розкажіть про вашу зйомку..."
    },

    ru: {
        aboutNav: "Обо мне",
        portfolioNav: "Портфолио",
        servicesNav: "Услуги",
        contactNav: "Контакты",

        heroEyebrow: "ФОТОГРАФИЯ · ПРАГА · ЕВРОПА",
        hero1: "ТВОЯ",
        hero2: "ИСТОРИЯ",
        heroText: "Фотография о людях, чувствах и моментах, которые хочется сохранить навсегда.",
        heroButton: "Забронировать съемку",

        aboutEyebrow: "ОБО МНЕ",
        aboutTitle1: "ПРИВЕТ,",
        aboutTitle2: "Я НЕЛЛИ.",
        aboutText1: "Я фотографирую людей такими, какие они есть — настоящими, живыми и разными.",
        aboutText2: "Для меня фотография — это не просто свет и композиция. Это чувство, возвращающее вас в момент.",
        aboutText3: "На моих съемках не нужно уметь позировать. Я помогу расслабиться и быть собой.",

        portfolioEyebrow: "ИЗБРАННЫЕ РАБОТЫ",
        portfolioTitle1: "МОИ",
        portfolioTitle2: "РАБОТЫ",
        wedding: "Свадьба",
        weddingWork: "Этот день",
        love: "История любви",
        loveWork: "Только мы",
        portrait: "Портрет",
        portraitWork: "Её история",
        couple: "Пара",
        coupleWork: "Вместе",
        youWork: "Ты",

        servicesEyebrow: "УСЛУГИ",
        servicesTitle1: "ЧТО Я",
        servicesTitle2: "ДЕЛАЮ",
        portraitTitle: "Портрет",
        portraitText: "Индивидуальные портреты, личный бренд и съёмки для себя.",
        loveTitle: "История любви",
        loveText: "Искренние истории двух людей — прогулки, свидания и особенные моменты.",
        weddingTitle: "Свадьба",
        weddingText: "Полный день или отдельные части — от деталей до настоящих эмоций.",

        contactEyebrow: "КОНТАКТЫ",
        contactTitle1: "ДАВАЙТЕ",
        contactTitle2: "СОЗДАВАТЬ",
        contactText: "Расскажите мне о вашей идее. Я свяжусь с вами лично.",

        nameLabel: "Имя и фамилия",
        phoneLabel: "Телефон",
        emailLabel: "Электронная почта",
        messageLabel: "Сообщение",
        submit: "Отправить заявку",

        footer: "© 2026 Nelli Photography",

        name: "Ваше имя",
        phone: "+420...",
        email: "email@example.com",
        message: "Расскажите о вашей съёмке..."
    },

    en: {
        aboutNav: "About",
        portfolioNav: "Portfolio",
        servicesNav: "Services",
        contactNav: "Contact",

        heroEyebrow: "PHOTOGRAPHY · PRAGUE · EUROPE",
        hero1: "YOUR",
        hero2: "STORY",
        heroText: "Photography about people, feelings and moments you want to keep forever.",
        heroButton: "Book a session",

        aboutEyebrow: "ABOUT",
        aboutTitle1: "HELLO,",
        aboutTitle2: "I'M NELLI.",
        aboutText1: "I photograph people as they are — real, lively and unique.",
        aboutText2: "For me photography is not just light and composition. It's a feeling that brings you back to a moment.",
        aboutText3: "On my shoots you don't need to know how to pose. I help you relax and be yourself.",

        portfolioEyebrow: "SELECTED STORIES",
        portfolioTitle1: "MY",
        portfolioTitle2: "WORK",
        wedding: "Wedding",
        weddingWork: "This day",
        love: "Love story",
        loveWork: "Just us",
        portrait: "Portrait",
        portraitWork: "Her story",
        couple: "Couple",
        coupleWork: "Together",
        youWork: "You",

        servicesEyebrow: "SERVICES",
        servicesTitle1: "WHAT I",
        servicesTitle2: "DO",
        portraitTitle: "Portrait",
        portraitText: "Individual portraits, personal brand and self shoots.",
        loveTitle: "Love story",
        loveText: "Heartfelt stories of two people — walks, dates and special moments.",
        weddingTitle: "Wedding",
        weddingText: "Full day or parts of the wedding — from details to real emotions.",

        contactEyebrow: "CONTACT",
        contactTitle1: "LET'S",
        contactTitle2: "CREATE",
        contactText: "Tell me about your idea. I will contact you personally.",

        nameLabel: "Full name",
        phoneLabel: "Phone",
        emailLabel: "Email",
        messageLabel: "Message",
        submit: "Send request",

        footer: "© 2026 Nelli Photography",

        name: "Your name",
        phone: "+420...",
        email: "email@example.com",
        message: "Tell me about your session..."
    },

    cz: {
        aboutNav: "O mně",
        portfolioNav: "Portfolio",
        servicesNav: "Služby",
        contactNav: "Kontakt",

        heroEyebrow: "FOTOGRAFIE · PRAHA · EVROPA",
        hero1: "TVŮJ",
        hero2: "PŘÍBĚH",
        heroText: "Fotografie o lidech, pocitech a momentech, které si chcete ponechat navždy.",
        heroButton: "Rezervovat focení",

        aboutEyebrow: "O MNĚ",
        aboutTitle1: "AHOJ,",
        aboutTitle2: "JSEM NELLI.",
        aboutText1: "Fotím lidi takové, jací jsou — opravdové, živé a rozmanité.",
        aboutText2: "Pro mě není fotografie jen světlo a kompozice. Je to pocit, který vás vrátí do chvíle.",
        aboutText3: "Na mých foceních není třeba umět pózovat. Pomohu vám se uvolnit a být sami sebou.",

        portfolioEyebrow: "VYBRANÉ PRÁCE",
        portfolioTitle1: "MOJE",
        portfolioTitle2: "PRÁCE",
        wedding: "Svatební",
        weddingWork: "Ten den",
        love: "Příběh lásky",
        loveWork: "Jen my",
        portrait: "Portrét",
        portraitWork: "Její příběh",
        couple: "Pár",
        coupleWork: "Spolu",
        youWork: "Ty",

        servicesEyebrow: "SLUŽBY",
        servicesTitle1: "CO DĚLÁM",
        servicesTitle2: "PRO VÁS",
        portraitTitle: "Portrét",
        portraitText: "Individuální portréty, osobní brand a focení pro sebe.",
        loveTitle: "Příběh lásky",
        loveText: "Upřímné příběhy dvou lidí — procházky, rande a zvláštní okamžiky.",
        weddingTitle: "Svatební",
        weddingText: "Celý den nebo části svatby — od detailů po opravdové emoce.",

        contactEyebrow: "KONTAKT",
        contactTitle1: "Pojďme",
        contactTitle2: "VYTVOŘIT",
        contactText: "Řekněte mi o svém nápadu. Osobně vás kontaktuji.",

        nameLabel: "Jméno a příjmení",
        phoneLabel: "Telefon",
        emailLabel: "E-mail",
        messageLabel: "Zpráva",
        submit: "Odeslat žádost",

        footer: "© 2026 Nelli Photography",

        name: "Vaše jméno",
        phone: "+420...",
        email: "email@example.com",
        message: "Řekněte mi o svém focení..."
    }
};


// Utilities
function el(selector, ctx = document) {
    return ctx.querySelector(selector);
}

function els(selector, ctx = document) {
    return Array.from(ctx.querySelectorAll(selector));
}

function applyTranslations(lang) {
    const map = TRANSLATIONS[lang] || TRANSLATIONS.uk;

    // data-t
    els("[data-t]").forEach(function (node) {
        const key = node.getAttribute("data-t");
        if (!key) return;
        const text = map[key] ?? TRANSLATIONS.uk[key] ?? node.textContent;
        node.textContent = text;
    });

    // placeholders
    els("[data-placeholder]").forEach(function (node) {
        const key = node.getAttribute("data-placeholder");
        if (!key) return;
        const placeholder = map[key] ?? TRANSLATIONS.uk[key] ?? node.placeholder || "";
        node.placeholder = placeholder;
    });

    // update footer copy
    el('meta[name="description"]').setAttribute('content', map.heroText || TRANSLATIONS.uk.heroText);

    // update contact details
    const emailEl = el('#contactEmail');
    const phoneEl = el('#contactPhone');
    if (emailEl) {
        emailEl.href = 'mailto:' + CONTACT_EMAIL;
        emailEl.textContent = CONTACT_EMAIL;
    }
    if (phoneEl) {
        phoneEl.href = 'tel:' + CONTACT_PHONE.replace(/\s+/g, '');
        phoneEl.textContent = CONTACT_PHONE;
    }

    // update image alts from sibling portfolio-info (so alt reflects translated labels)
    els('.work').forEach(function (work) {
        const img = work.querySelector('img');
        const info = work.querySelector('.portfolio-info');
        if (img && info) {
            img.alt = info.innerText.trim();
        }
    });

    // set html lang
    const langAttr = (lang === 'cz') ? 'cs' : lang;
    document.documentElement.lang = langAttr;

    // update active language button
    els('.lang').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
}

function getInitialLang() {
    const saved = localStorage.getItem('nelli-lang');
    if (saved && TRANSLATIONS[saved]) return saved;

    const nav = (navigator.language || navigator.userLanguage || 'uk').slice(0,2).toLowerCase();
    if (nav === 'ru') return 'ru';
    if (nav === 'en') return 'en';
    if (nav === 'cs' || nav === 'cz') return 'cz';
    return 'uk';
}

function setLang(lang) {
    if (!TRANSLATIONS[lang]) return;
    localStorage.setItem('nelli-lang', lang);
    applyTranslations(lang);
}


// LIGHTBOX
function openLightbox(src, caption) {
    const box = el('#lightbox');
    const img = el('#lightboxImage');
    const cap = el('#lightboxCaption');
    if (!box || !img) return;
    img.src = src;
    img.alt = caption || '';
    if (cap) cap.textContent = caption || '';
    box.classList.remove('hidden');
    box.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
    const box = el('#lightbox');
    const img = el('#lightboxImage');
    if (!box) return;
    box.classList.add('hidden');
    box.setAttribute('aria-hidden', 'true');
    if (img) img.src = '';
}

function initLightbox() {
    els('.work').forEach(function (work) {
        const img = work.querySelector('img');
        const info = work.querySelector('.portfolio-info');
        if (img) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function () {
                openLightbox(img.src, info ? info.innerText.trim() : '');
            });
        }
    });

    const box = el('#lightbox');
    if (!box) return;
    box.addEventListener('click', function (e) {
        if (e.target.hasAttribute('data-close')) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
    });
}


// CONTACT FORM
let formSending = false;

function showFormMessage(text, isError = false) {
    const elMsg = el('#formMessage');
    if (!elMsg) return;
    elMsg.textContent = text;
    elMsg.style.color = isError ? '#f4b0a8' : '#c2e6c2';
}

async function submitForm(data) {
    // try to send JSON with CORS — require backend to allow CORS
    const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    // if response not ok, try to parse text
    if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || ('HTTP ' + res.status));
    }

    // expect JSON response with success flag
    const json = await res.json().catch(() => null);
    if (json && json.success === true) return json;
    if (json && json.error) throw new Error(json.error);

    return json || {};
}

function validateEmail(email) {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function initForm() {
    const form = el('#bookingForm');
    const submitBtn = el('#submitButton');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (formSending) return;

        const name = (el('#name') || {}).value?.trim() || '';
        const phone = (el('#phone') || {}).value?.trim() || '';
        const email = (el('#email') || {}).value?.trim() || '';
        const message = (el('#message') || {}).value?.trim() || '';

        if (!name) {
            showFormMessage(TRANSLATIONS[localStorage.getItem('nelli-lang') || 'uk'].name || 'Please enter name', true);
            return;
        }
        if (!phone) {
            showFormMessage(TRANSLATIONS[localStorage.getItem('nelli-lang') || 'uk'].phone || 'Please enter phone', true);
            return;
        }
        if (!validateEmail(email)) {
            showFormMessage('Неправильний формат email', true);
            return;
        }

        const payload = { full_name: name, phone, email, message };

        try {
            formSending = true;
            submitBtn.disabled = true;
            showFormMessage('Відправлення...', false);

            const result = await submitForm(payload);

            // if backend returned success
            if (result && result.success === true) {
                showFormMessage(result.message || 'Заявку отримано ✓', false);
                form.reset();
            } else {
                // backend may not return json — treat as success only if status 200
                showFormMessage('Заявку надіслано. Якщо ви не отримали підтвердження, перевірте налаштування backend.', false);
                form.reset();
            }

        } catch (err) {
            console.error('Form send error:', err);
            showFormMessage('Не вдалося відправити заявку. Потрібно налаштувати backend (CORS / endpoint).', true);
        } finally {
            formSending = false;
            submitBtn.disabled = false;
        }

    });
}


// INITIALIZE
document.addEventListener('DOMContentLoaded', function () {
    // language buttons
    els('.lang').forEach(function (btn) {
        btn.addEventListener('click', function () {
            setLang(btn.getAttribute('data-lang'));
        });
    });

    const initial = getInitialLang();
    setLang(initial);

    // setup contact details
    const emailEl = el('#contactEmail');
    const phoneEl = el('#contactPhone');
    if (emailEl) { emailEl.href = 'mailto:' + CONTACT_EMAIL; emailEl.textContent = CONTACT_EMAIL; }
    if (phoneEl) { phoneEl.href = 'tel:' + CONTACT_PHONE.replace(/\s+/g, ''); phoneEl.textContent = CONTACT_PHONE; }

    // init lightbox
    initLightbox();

    // init form
    initForm();

});

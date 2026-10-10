// Configuration
const GOOGLE_SCRIPT_URL = String(window.NELLI_API_URL || "").trim();

const PUBLIC_CONTENT_URL = GOOGLE_SCRIPT_URL;

let SITE_CONTENT = window.NelliContentModel
    ? window.NelliContentModel.emptyContent()
    : { translations: {}, media: {}, seo: {}, sections: {}, social: [], services: [], portfolio: [] };

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
        portfolioEmpty: "Нові фотосесії незабаром з’являться тут.",
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
        validationName: "Будь ласка, введіть ім'я.",
        validationPhone: "Будь ласка, введіть телефон.",
        validationEmail: "Неправильний формат email.",
        sending: "Відправлення...",
        sent: "Дякуємо! Заявку збережено. Я зв’яжуся з вами.",
        sentUnconfirmed: "Заявку не вдалося підтвердити. Не надсилайте її повторно — напишіть мені в Instagram нижче.",
        sendError: "Не вдалося надіслати заявку. Перевірте з’єднання або напишіть мені в Instagram.",
        privacyNote: "Дані форми зберігаються у вашій Google-таблиці, щоб відповісти на запит.",

        footer: "© 2026 Nelli Photography",

        // placeholders
        name: "Ваше ім'я",
        phone: "+420...",
        email: "email@example.com",
        message: "Розкажіть про вашу зйомку...",

        // Instagram
        instagramNelli: "Instagram Nelli",
        supportLabel: "Технічна підтримка",
        supportButton: "Написати в Instagram"
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
        portfolioEmpty: "Новые фотосессии скоро появятся здесь.",
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
        validationName: "Пожалуйста, введите имя.",
        validationPhone: "Пожалуйста, введите телефон.",
        validationEmail: "Неверный формат email.",
        sending: "Отправка...",
        sent: "Спасибо! Заявка сохранена. Я свяжусь с вами.",
        sentUnconfirmed: "Не удалось подтвердить заявку. Не отправляйте её повторно — напишите мне в Instagram ниже.",
        sendError: "Не удалось отправить заявку. Проверьте соединение или напишите мне в Instagram.",
        privacyNote: "Данные формы сохраняются в вашей таблице Google, чтобы ответить на запрос.",

        footer: "© 2026 Nelli Photography",

        name: "Ваше имя",
        phone: "+420...",
        email: "email@example.com",
        message: "Расскажите о вашей съёмке...",

        instagramNelli: "Instagram Nelli",
        supportLabel: "Техническая поддержка",
        supportButton: "Написать в Instagram"
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
        portfolioEmpty: "New photo stories will appear here soon.",
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
        validationName: "Please enter your name.",
        validationPhone: "Please enter your phone number.",
        validationEmail: "Please enter a valid email address.",
        sending: "Sending...",
        sent: "Thank you! Your request was saved. I will contact you soon.",
        sentUnconfirmed: "We couldn't confirm the request. Please don't send it again; message me on Instagram below.",
        sendError: "The request could not be sent. Check your connection or message me on Instagram.",
        privacyNote: "Form details are saved to your Google Sheet so I can reply to your request.",

        footer: "© 2026 Nelli Photography",

        name: "Your name",
        phone: "+420...",
        email: "email@example.com",
        message: "Tell me about your session...",

        instagramNelli: "Nelli on Instagram",
        supportLabel: "Technical Support",
        supportButton: "Contact support on Instagram"
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
        portfolioEmpty: "Nové fotografie se zde brzy objeví.",
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
        validationName: "Zadejte prosím své jméno.",
        validationPhone: "Zadejte prosím telefon.",
        validationEmail: "Zadejte prosím platný e-mail.",
        sending: "Odesílání...",
        sent: "Děkuji! Žádost byla uložena. Brzy se vám ozvu.",
        sentUnconfirmed: "Žádost se nepodařilo potvrdit. Neposílejte ji znovu — napište mi níže na Instagram.",
        sendError: "Žádost se nepodařilo odeslat. Zkontrolujte připojení nebo mi napište na Instagram.",
        privacyNote: "Údaje z formuláře se ukládají do vaší tabulky Google, abych mohla odpovědět.",

        footer: "© 2026 Nelli Photography",

        name: "Vaše jméno",
        phone: "+420...",
        email: "email@example.com",
        message: "Řekněte mi o svém focení...",

        instagramNelli: "Nelli na Instagramu",
        supportLabel: "Technická podpora",
        supportButton: "Napsat na Instagram"
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
        const placeholder = map[key] ?? TRANSLATIONS.uk[key] ?? node.placeholder ?? "";
        node.placeholder = placeholder;
    });

    // update footer copy
    const descriptionMeta = el('meta[name="description"]');
    if (descriptionMeta) {
        descriptionMeta.setAttribute('content', map.heroText || TRANSLATIONS.uk.heroText);
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

    renderServices();
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

function localizedValue(value, lang) {
    if (value && typeof value === 'object') {
        return value[lang] || value.uk || value.en || '';
    }
    return value || '';
}

function publicImageUrl(value) {
    if (!value) return '';
    if (String(value).startsWith('http') || String(value).startsWith('assets/')) return value;
    return 'https://drive.google.com/uc?export=view&id=' + encodeURIComponent(value);
}

function normalizePublicData(data) {
    const candidate = data && (data.siteContent || data.content);
    if (candidate && window.NelliContentModel) {
        return window.NelliContentModel.mergeContent(candidate);
    }

    const sessions = Array.isArray(data && data.sessions) ? data.sessions : [];
    const photos = Array.isArray(data && data.photos) ? data.photos : [];
    if (!sessions.length && !photos.length) {
        const empty = window.NelliContentModel
            ? window.NelliContentModel.emptyContent()
            : { portfolio: [] };
        empty.portfolio = [];
        return empty;
    }

    const portfolio = photos.map(function (photo, index) {
        const session = sessions.find(function (item) {
            return String(item.ID) === String(photo['Session ID']);
        }) || {};
        const title = {
            uk: session['Назва UA'] || photo['Назва'] || 'Portfolio',
            ru: session['Назва RU'] || session['Назва UA'] || photo['Назва'] || 'Portfolio',
            en: session['Назва EN'] || session['Назва UA'] || photo['Назва'] || 'Portfolio',
            cz: session['Назва CZ'] || session['Назва UA'] || photo['Назва'] || 'Portfolio'
        };
        const fileId = photo['File ID'] || photo.imageUrl || photo.url || '';
        const categoryKey = String(session['Категорія'] || 'other');
        const categoryLabels = {
            wedding: { uk: TRANSLATIONS.uk.wedding, ru: TRANSLATIONS.ru.wedding, en: TRANSLATIONS.en.wedding, cz: TRANSLATIONS.cz.wedding },
            love: { uk: TRANSLATIONS.uk.love, ru: TRANSLATIONS.ru.love, en: TRANSLATIONS.en.love, cz: TRANSLATIONS.cz.love },
            portrait: { uk: TRANSLATIONS.uk.portrait, ru: TRANSLATIONS.ru.portrait, en: TRANSLATIONS.en.portrait, cz: TRANSLATIONS.cz.portrait },
            couple: { uk: TRANSLATIONS.uk.couple, ru: TRANSLATIONS.ru.couple, en: TRANSLATIONS.en.couple, cz: TRANSLATIONS.cz.couple },
            other: { uk: 'Інше', ru: 'Другое', en: 'Other', cz: 'Ostatní' }
        };
        return {
            id: photo.ID || 'photo-' + index,
            imageUrl: publicImageUrl(fileId),
            title: title,
            category: categoryLabels[categoryKey] || categoryLabels.other,
            alt: title,
            order: Number(photo['Порядок'] || index + 1),
            published: String(session['Активна']).toLowerCase() !== 'false',
            cover: String(session['Обкладинка'] || '').includes(String(fileId))
        };
    });

    const content = window.NelliContentModel
        ? window.NelliContentModel.emptyContent()
        : { portfolio: [] };
    content.portfolio = portfolio;
    return content;
}

function renderServices() {
    const list = el('.services-list');
    if (!list || !Array.isArray(SITE_CONTENT.services) || !SITE_CONTENT.services.length) return;
    if (!SITE_CONTENT.services.some(function (service) {
        return service.title || (service.translations && Object.keys(service.translations).some(function (lang) {
            return service.translations[lang] && (service.translations[lang].title || service.translations[lang].description);
        }));
    })) return;
    const lang = localStorage.getItem('nelli-lang') || 'uk';
    const services = SITE_CONTENT.services.filter(function (service) {
        return service.visible !== false;
    }).sort(function (a, b) {
        return Number(a.order || a.number || 0) - Number(b.order || b.number || 0);
    });
    list.innerHTML = services.map(function (service, index) {
        const title = localizedValue(service.title || (service.translations && service.translations[lang] && service.translations[lang].title), lang);
        const description = localizedValue(service.description || (service.translations && service.translations[lang] && service.translations[lang].description), lang);
        return '<article class="service"><div class="service-number">' + escapePublic(service.number || String(index + 1).padStart(2, '0')) + '</div><div class="service-main"><h3>' + escapePublic(title) + '</h3><p>' + escapePublic(description) + '</p></div><span class="service-arrow">↗</span></article>';
    }).join('');
}

function renderPortfolio() {
    const grid = el('.portfolio-grid');
    if (!grid || !Array.isArray(SITE_CONTENT.portfolio)) return;
    const lang = localStorage.getItem('nelli-lang') || 'uk';
    const items = SITE_CONTENT.portfolio.filter(function (item) {
        return item.published !== false && publicImageUrl(item.imageUrl || item.url || item.fileId);
    }).sort(function (a, b) {
        return Number(a.order || 0) - Number(b.order || 0);
    });
    if (!items.length) {
        grid.innerHTML = '<p class="portfolio-empty">' + escapePublic((TRANSLATIONS[lang] || TRANSLATIONS.uk).portfolioEmpty || TRANSLATIONS.uk.portfolioEmpty) + '</p>';
        return;
    }

    grid.innerHTML = items.map(function (item, index) {
        const title = localizedValue(item.title, lang) || 'Portfolio';
        const category = localizedValue(item.category, lang) || '';
        const classes = index === 0 ? 'work big' : index === 1 ? 'work tall' : 'work';
        return '<div class="' + classes + '" data-index="' + (index + 1) + '"><img src="' + escapePublic(publicImageUrl(item.imageUrl || item.url || item.fileId)) + '" alt="' + escapePublic(localizedValue(item.alt || item.title, lang)) + '"><div class="portfolio-info"><span>' + escapePublic(category) + '</span><strong>' + escapePublic(title) + '</strong></div></div>';
    }).join('');
}

function escapePublic(value) {
    return String(value || '').replace(/[&<>'"]/g, function (character) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character];
    });
}

function applySiteContent(content) {
    SITE_CONTENT = window.NelliContentModel
        ? window.NelliContentModel.mergeContent(content)
        : content;

    Object.keys(SITE_CONTENT.translations || {}).forEach(function (lang) {
        if (TRANSLATIONS[lang]) {
            const overrides = Object.keys(SITE_CONTENT.translations[lang] || {}).reduce(function (result, key) {
                const value = SITE_CONTENT.translations[lang][key];
                if (value !== '') result[key] = value;
                return result;
            }, {});
            TRANSLATIONS[lang] = Object.assign({}, TRANSLATIONS[lang], overrides);
        }
    });

    const media = SITE_CONTENT.media || {};
    const hero = el('.hero');
    const aboutPhoto = el('#aboutPhoto');
    if (hero && media.heroUrl) hero.style.backgroundImage = 'url("' + escapePublic(media.heroUrl) + '")';
    if (aboutPhoto && media.aboutUrl) {
        aboutPhoto.hidden = false;
        aboutPhoto.src = media.aboutUrl;
    }
    const heroLink = el('.hero-button');
    if (heroLink && SITE_CONTENT.links && SITE_CONTENT.links.hero) heroLink.href = SITE_CONTENT.links.hero;

    Object.keys(SITE_CONTENT.sections || {}).forEach(function (section) {
        const node = el('[data-section="' + section + '"]');
        if (node) node.hidden = SITE_CONTENT.sections[section] === false;
    });

    (SITE_CONTENT.social || []).forEach(function (social) {
        els('[data-social="' + social.id + '"]').forEach(function (link) {
            link.hidden = social.visible === false;
            if (social.url) link.href = social.url;
            if (social.label) link.textContent = localizedValue(social.label, localStorage.getItem('nelli-lang') || 'uk');
        });
    });

    const seo = SITE_CONTENT.seo || {};
    if (seo.title) document.title = seo.title;
    const description = el('meta[name="description"]');
    const ogTitle = el('meta[property="og:title"]');
    const ogDescription = el('meta[property="og:description"]');
    const ogImage = el('meta[property="og:image"]');
    if (description && seo.description) description.content = seo.description;
    if (ogTitle && seo.ogTitle) ogTitle.content = seo.ogTitle;
    if (ogDescription && seo.ogDescription) ogDescription.content = seo.ogDescription;
    if (ogImage && seo.ogImage) ogImage.content = seo.ogImage;

    renderPortfolio();
    initImageFallbacks();
    applyTranslations(localStorage.getItem('nelli-lang') || 'uk');
}

function apiJsonp(action, params) {
    if (!PUBLIC_CONTENT_URL || PUBLIC_CONTENT_URL.indexOf('PASTE_YOUR_') >= 0) {
        return Promise.reject(new Error('Google Apps Script URL is not configured'));
    }
    return new Promise(function (resolve, reject) {
        const callback = '__nelliPublic_' + Date.now() + '_' + Math.random().toString(36).slice(2);
        const script = document.createElement('script');
        const query = new URLSearchParams(Object.assign({ action: action, callback: callback, _: String(Date.now()) }, params || {}));
        let finished = false;
        const timeout = window.setTimeout(function () { finish(new Error('Google Apps Script timeout')); }, 12000);
        function cleanup() {
            window.clearTimeout(timeout);
            try { delete window[callback]; } catch (error) { window[callback] = undefined; }
            if (script.parentNode) script.parentNode.removeChild(script);
        }
        function finish(error, data) {
            if (finished) return;
            finished = true;
            cleanup();
            if (error) reject(error); else resolve(data);
        }
        window[callback] = function (data) {
            if (!data || data.success !== true) return finish(new Error((data && data.error) || 'Google Apps Script returned an error'));
            finish(null, data);
        };
        script.onerror = function () { finish(new Error('Google Apps Script could not be loaded')); };
        script.src = PUBLIC_CONTENT_URL + '?' + query.toString();
        document.body.appendChild(script);
    });
}

function loadPublicContent() {
    return apiJsonp('publicData').then(function (data) {
        const content = normalizePublicData(data);
        if (!content) throw new Error((data && data.error) || 'No public content returned');
        applySiteContent(content);
        return content;
    });
}

window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin || !event.data || event.data.type !== 'nelli-preview-content') return;
    applySiteContent(event.data.content);
});


// LIGHTBOX
let _previousActiveElement = null;
let _lightboxKeydownHandler = null;

function openLightbox(src, caption) {
    const box = el('#lightbox');
    const img = el('#lightboxImage');
    const cap = el('#lightboxCaption');
    const closeBtn = el('.lightbox-close');
    const main = document.querySelector('main');
    if (!box || !img) return;

    _previousActiveElement = document.activeElement;

    img.src = src;
    img.alt = caption || '';
    if (cap) cap.textContent = caption || '';

    document.body.classList.add('no-scroll');

    // hide main content from assistive tech
    if (main) main.setAttribute('aria-hidden', 'true');

    box.classList.remove('hidden');
    box.setAttribute('aria-hidden', 'false');

    // focus management
    if (closeBtn) {
        closeBtn.focus();
    }

    // trap focus & handle Escape
    _lightboxKeydownHandler = function (e) {
        if (e.key === 'Escape') {
            closeLightbox();
            return;
        }
        if (e.key === 'Tab') {
            // simple focus trap
            const focusable = box.querySelectorAll('a[href], area[href], input:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])');
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    };

    document.addEventListener('keydown', _lightboxKeydownHandler);
}

function closeLightbox() {
    const box = el('#lightbox');
    const img = el('#lightboxImage');
    const main = document.querySelector('main');
    if (!box) return;

    box.classList.add('hidden');
    box.setAttribute('aria-hidden', 'true');

    document.body.classList.remove('no-scroll');

    // restore main aria
    if (main) main.removeAttribute('aria-hidden');

    if (img) img.src = '';

    if (_lightboxKeydownHandler) {
        document.removeEventListener('keydown', _lightboxKeydownHandler);
        _lightboxKeydownHandler = null;
    }

    if (_previousActiveElement && typeof _previousActiveElement.focus === 'function') {
        try { _previousActiveElement.focus(); } catch (e) {}
    }
}

function initLightbox() {
    els('.work').forEach(function (work) {
        const img = work.querySelector('img');
        const info = work.querySelector('.portfolio-info');
        if (img && !img.dataset.lightboxReady) {
            img.dataset.lightboxReady = 'true';
            img.style.cursor = 'pointer';
            img.setAttribute('tabindex', '0');
            img.addEventListener('click', function () {
                openLightbox(img.src, info ? info.innerText.trim() : '');
            });
            img.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(img.src, info ? info.innerText.trim() : '');
                }
            });
        }
    });

    const box = el('#lightbox');
    if (!box) return;
    box.addEventListener('click', function (e) {
        if (e.target.hasAttribute('data-close') || e.target.classList.contains('lightbox-backdrop')) closeLightbox();
    });

    // Close buttons
    els('.lightbox-close').forEach(function (btn) {
        btn.addEventListener('click', closeLightbox);
    });
}


// CONTACT FORM
let formSending = false;

function showFormMessage(text, isError = false) {
    const elMsg = el('#formMessage');
    if (!elMsg) return;
    elMsg.textContent = text;
    elMsg.classList.toggle('is-error', isError);
}

async function submitForm(data) {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.indexOf('PASTE_YOUR_') >= 0) {
        throw new Error('API is not configured');
    }
    return fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(Object.assign({ action: 'createBooking' }, data))
    });
}

async function confirmBooking(requestId) {
    for (let attempt = 0; attempt < 10; attempt += 1) {
        if (attempt) await new Promise(function (resolve) { window.setTimeout(resolve, 700); });
        const result = await apiJsonp('bookingStatus', { id: requestId });
        if (result.received === true) return true;
    }
    return false;
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

        const currentMap = TRANSLATIONS[localStorage.getItem('nelli-lang') || 'uk'];

        if (!name) {
            showFormMessage(currentMap.validationName, true);
            return;
        }
        if (!phone) {
            showFormMessage(currentMap.validationPhone, true);
            return;
        }
        if (!validateEmail(email)) {
            showFormMessage(currentMap.validationEmail, true);
            return;
        }

        const requestId = 'request-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
        const payload = { requestId: requestId, full_name: name, phone, email, message };

        let requestDispatched = false;
        try {
            formSending = true;
            submitBtn.disabled = true;
            showFormMessage(currentMap.sending, false);

            await submitForm(payload);
            requestDispatched = true;
            const confirmed = await confirmBooking(requestId);
            if (confirmed) {
                showFormMessage(currentMap.sent, false);
                form.reset();
            } else {
                showFormMessage(currentMap.sentUnconfirmed || currentMap.sendError, true);
            }

        } catch (err) {
            console.error('Form send error:', err);
            showFormMessage(requestDispatched ? (currentMap.sentUnconfirmed || currentMap.sendError) : currentMap.sendError, true);
        } finally {
            formSending = false;
            submitBtn.disabled = false;
        }

    });
}


// MOBILE NAV
function initMobileNav() {
    const toggle = el('.nav-toggle');
    const body = document.body;
    const nav = el('.nav-links');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
        const open = body.classList.toggle('nav-open');
        body.classList.toggle('no-scroll', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        // When menu opens, move focus into the first link
        if (open) {
            const firstLink = nav.querySelector('a');
            if (firstLink) firstLink.focus();
        }
    });

    // close nav when clicking a link (mobile)
    els('.nav-links a').forEach(function (a) {
        a.addEventListener('click', function () {
            if (body.classList.contains('nav-open')) {
                body.classList.remove('nav-open');
                body.classList.remove('no-scroll');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

function initImageFallbacks() {
    els('.about-photo img, .work img').forEach(function (img) {
        if (img.complete && img.naturalWidth === 0) {
            img.hidden = true;
            return;
        }
        img.addEventListener('error', function () {
            img.hidden = true;
        }, { once: true });
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

    // init form
    initForm();

    // mobile nav
    initMobileNav();

    initImageFallbacks();

    loadPublicContent().catch(function () {
        initLightbox();
    }).then(function () {
        initLightbox();
    });

});

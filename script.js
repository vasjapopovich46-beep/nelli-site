/* =========================================================
   NELLI PHOTOGRAPHY
   Main website script
========================================================= */


/* =========================================================
   GOOGLE APPS SCRIPT
========================================================= */

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxmJELRpugwDjDo_MOlppUq1VZrt1101d_E68XOTUTpUOkVVvlwmLOZA-zilNhRoxc3/exec";


/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {

    uk: {

        aboutNav: "Про мене",
        portfolioNav: "Портфоліо",
        servicesNav: "Послуги",
        contactNav: "Контакти",

        heroEyebrow: "Фотографія · Прага · Європа",
        hero1: "ТВОЯ",
        hero2: "ІСТОРІЯ",
        heroText:
            "Фотографія про людей, почуття та моменти, які хочеться залишити з собою назавжди.",
        heroButton: "Забронювати зйомку",

        aboutEyebrow: "Про мене",
        aboutTitle1: "ПРИВІТ,",
        aboutTitle2: "Я НЕЛЛІ.",

        aboutText1:
            "Я фотографую людей такими, якими вони є — справжніми, живими та різними.",

        aboutText2:
            "Для мене фотографія — це не просто світло та композиція. Це почуття, яке повертає вас у конкретний момент.",

        aboutText3:
            "На моїх зйомках не потрібно вміти позувати. Я допоможу вам розслабитися і бути собою.",

        portfolioEyebrow: "Вибрані роботи",
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

        servicesEyebrow: "Послуги",
        servicesTitle1: "ЩО Я",
        servicesTitle2: "РОБЛЮ",

        portraitTitle: "Портрет",
        portraitText:
            "Індивідуальні портрети, особистий бренд та зйомки для себе.",

        loveTitle: "Історія кохання",
        loveText:
            "Щирі історії двох людей — прогулянки, побачення та особливі моменти.",

        weddingTitle: "Весілля",
        weddingText:
            "Повний день або окремі частини весілля — від деталей до справжніх емоцій.",

        contactEyebrow: "Контакти",
        contactTitle1: "ДАВАЙТЕ",
        contactTitle2: "СТВОРЮВАТИ",

        contactText:
            "Розкажіть мені про вашу ідею. Я особисто зв'яжуся з вами.",

        nameLabel: "Ім'я та прізвище",
        phoneLabel: "Телефон",
        emailLabel: "Електронна пошта",
        messageLabel: "Повідомлення",

        name: "Ваше ім'я",
        phone: "+420...",
        email: "email@example.com",
        message: "Розкажіть про вашу зйомку...",

        submit: "Надіслати заявку",

        sending: "Надсилаємо заявку...",
        success: "Дякуємо! Заявку отримано.",
        error: "Щось пішло не так. Спробуйте ще раз.",

        footer: "© 2026 Nelli Photography"
    },


    ru: {

        aboutNav: "Обо мне",
        portfolioNav: "Портфолио",
        servicesNav: "Услуги",
        contactNav: "Контакты",

        heroEyebrow: "Фотография · Прага · Европа",
        hero1: "ТВОЯ",
        hero2: "ИСТОРИЯ",
        heroText:
            "Фотография о людях, чувствах и моментах, которые хочется сохранить навсегда.",
        heroButton: "Забронировать съёмку",

        aboutEyebrow: "Обо мне",
        aboutTitle1: "ПРИВЕТ,",
        aboutTitle2: "Я НЕЛЛИ.",

        aboutText1:
            "Я фотографирую людей такими, какие они есть — настоящими, живыми и разными.",

        aboutText2:
            "Для меня фотография — это не просто свет и композиция. Это чувство, которое возвращает вас в конкретный момент.",

        aboutText3:
            "На моих съёмках не нужно уметь позировать. Я помогу вам расслабиться и быть собой.",

        portfolioEyebrow: "Избранные работы",
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

        servicesEyebrow: "Услуги",
        servicesTitle1: "ЧТО Я",
        servicesTitle2: "ДЕЛАЮ",

        portraitTitle: "Портрет",
        portraitText:
            "Индивидуальные портреты, личный бренд и съёмки для себя.",

        loveTitle: "История любви",
        loveText:
            "Искренние истории двух людей и ваши особенные моменты.",

        weddingTitle: "Свадьба",
        weddingText:
            "Полный день или отдельные части свадьбы — от деталей до эмоций.",

        contactEyebrow: "Контакты",
        contactTitle1: "ДАВАЙТЕ",
        contactTitle2: "СОЗДАВАТЬ",

        contactText:
            "Расскажите мне о вашей идее. Я лично свяжусь с вами.",

        nameLabel: "Имя и фамилия",
        phoneLabel: "Телефон",
        emailLabel: "Электронная почта",
        messageLabel: "Сообщение",

        name: "Ваше имя",
        phone: "+420...",
        email: "email@example.com",
        message: "Расскажите о вашей съёмке...",

        submit: "Отправить заявку",

        sending: "Отправляем заявку...",
        success: "Спасибо! Заявка получена.",
        error: "Что-то пошло не так. Попробуйте ещё раз.",

        footer: "© 2026 Nelli Photography"
    },


    en: {

        aboutNav: "About me",
        portfolioNav: "Portfolio",
        servicesNav: "Services",
        contactNav: "Contact",

        heroEyebrow: "Photography · Prague · Europe",
        hero1: "YOUR",
        hero2: "STORY",

        heroText:
            "Photography about people, feelings and moments you want to keep forever.",

        heroButton: "Book a session",

        aboutEyebrow: "About me",
        aboutTitle1: "HELLO,",
        aboutTitle2: "I'M NELLI.",

        aboutText1:
            "I photograph people as they really are — authentic, alive and unique.",

        aboutText2:
            "For me, photography is not only about light and composition. It is about a feeling that takes you back to a moment.",

        aboutText3:
            "You don't need to know how to pose. I will help you relax and simply be yourself.",

        portfolioEyebrow: "Selected work",
        portfolioTitle1: "MY",
        portfolioTitle2: "WORK",

        wedding: "Wedding",
        weddingWork: "The day",

        love: "Love story",
        loveWork: "Just us",

        portrait: "Portrait",
        portraitWork: "Her story",

        couple: "Couple",
        coupleWork: "Together",

        youWork: "You",

        servicesEyebrow: "Services",
        servicesTitle1: "WHAT I",
        servicesTitle2: "DO",

        portraitTitle: "Portrait",
        portraitText:
            "Individual portraits, personal branding and photoshoots for yourself.",

        loveTitle: "Love story",
        loveText:
            "Honest stories of two people and your special moments.",

        weddingTitle: "Wedding",
        weddingText:
            "A full wedding day or selected parts — from details to real emotions.",

        contactEyebrow: "Contact",
        contactTitle1: "LET'S",
        contactTitle2: "CREATE",

        contactText:
            "Tell me about your idea. I will personally get back to you.",

        nameLabel: "Full name",
        phoneLabel: "Phone",
        emailLabel: "Email",
        messageLabel: "Message",

        name: "Your name",
        phone: "+420...",
        email: "email@example.com",
        message: "Tell me about your photoshoot...",

        submit: "Send request",

        sending: "Sending your request...",
        success: "Thank you! Your request has been received.",
        error: "Something went wrong. Please try again.",

        footer: "© 2026 Nelli Photography"
    },


    cz: {

        aboutNav: "O mně",
        portfolioNav: "Portfolio",
        servicesNav: "Služby",
        contactNav: "Kontakt",

        heroEyebrow: "Fotografie · Praha · Evropa",
        hero1: "TVŮJ",
        hero2: "PŘÍBĚH",

        heroText:
            "Fotografie o lidech, emocích a okamžicích, které si chcete uchovat navždy.",

        heroButton: "Rezervovat focení",

        aboutEyebrow: "O mně",
        aboutTitle1: "AHOJ,",
        aboutTitle2: "JSEM NELLI.",

        aboutText1:
            "Fotografuji lidi takové, jací skutečně jsou — opravdové, živé a jedinečné.",

        aboutText2:
            "Pro mě fotografie není jen o světle a kompozici. Je o pocitu, který vás vrátí do konkrétního okamžiku.",

        aboutText3:
            "Nemusíte umět pózovat. Pomohu vám uvolnit se a být sami sebou.",

        portfolioEyebrow: "Vybrané práce",
        portfolioTitle1: "MOJE",
        portfolioTitle2: "PRÁCE",

        wedding: "Svatba",
        weddingWork: "Tento den",

        love: "Příběh lásky",
        loveWork: "Jen my",

        portrait: "Portrét",
        portraitWork: "Její příběh",

        couple: "Pár",
        coupleWork: "Spolu",

        youWork: "Ty",

        servicesEyebrow: "Služby",
        servicesTitle1: "CO",
        servicesTitle2: "DĚLÁM",

        portraitTitle: "Portrét",
        portraitText:
            "Individuální portréty, osobní značka a focení pro vás.",

        loveTitle: "Příběh lásky",
        loveText:
            "Upřímné příběhy dvou lidí a vaše výjimečné okamžiky.",

        weddingTitle: "Svatba",
        weddingText:
            "Celý svatební den nebo jeho jednotlivé části.",

        contactEyebrow: "Kontakt",
        contactTitle1: "POJĎME",
        contactTitle2: "TVOŘIT",

        contactText:
            "Napište mi o vašem nápadu. Osobně se vám ozvu.",

        nameLabel: "Jméno a příjmení",
        phoneLabel: "Telefon",
        emailLabel: "E-mail",
        messageLabel: "Zpráva",

        name: "Vaše jméno",
        phone: "+420...",
        email: "email@example.com",
        message: "Napište mi o vašem focení...",

        submit: "Odeslat žádost",

        sending: "Odesíláme žádost...",
        success: "Děkujeme! Vaše žádost byla přijata.",
        error: "Něco se pokazilo. Zkuste to prosím znovu.",

        footer: "© 2026 Nelli Photography"
    }

};


/* =========================================================
   START AFTER HTML LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    let currentLanguage =
        localStorage.getItem("nelli-language") || "uk";


    const form =
        document.getElementById("bookingForm");

    const formMessage =
        document.getElementById("formMessage");

    const submitButton =
        document.getElementById("submitButton");


    let formStatus = "";


    /* =====================================================
       FORM MESSAGE
    ===================================================== */

    function updateFormMessage() {

        if (!formMessage) {
            return;
        }

        const translation =
            translations[currentLanguage];


        if (formStatus === "sending") {

            formMessage.textContent =
                translation.sending;

        } else if (formStatus === "success") {

            formMessage.textContent =
                translation.success;

        } else if (formStatus === "error") {

            formMessage.textContent =
                translation.error;

        } else {

            formMessage.textContent = "";

        }
    }


    /* =====================================================
       LANGUAGE
    ===================================================== */

    function setLanguage(language) {

        if (!translations[language]) {
            language = "uk";
        }


        currentLanguage = language;


        localStorage.setItem(
            "nelli-language",
            language
        );


        document.documentElement.lang =
            language === "cz"
                ? "cs"
                : language;


        document
            .querySelectorAll("[data-t]")
            .forEach(function (element) {

                const key =
                    element.getAttribute("data-t");


                if (
                    translations[language][key] !== undefined
                ) {

                    element.textContent =
                        translations[language][key];

                }

            });


        document
            .querySelectorAll("[data-placeholder]")
            .forEach(function (element) {

                const key =
                    element.getAttribute(
                        "data-placeholder"
                    );


                if (
                    translations[language][key] !== undefined
                ) {

                    element.placeholder =
                        translations[language][key];

                }

            });


        document
            .querySelectorAll(".lang")
            .forEach(function (button) {

                button.classList.toggle(
                    "active",
                    button.getAttribute("data-lang") === language
                );

            });


        updateFormMessage();
    }


    /* =====================================================
       LANGUAGE BUTTONS
    ===================================================== */

    document
        .querySelectorAll(".lang")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const language =
                        button.getAttribute("data-lang");

                    setLanguage(language);

                }
            );

        });


    /* =====================================================
       FORM
    ===================================================== */

    if (form) {

        form.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const name =
                    document
                        .getElementById("name")
                        ?.value
                        .trim() || "";


                const phone =
                    document
                        .getElementById("phone")
                        ?.value
                        .trim() || "";


                const email =
                    document
                        .getElementById("email")
                        ?.value
                        .trim() || "";


                const message =
                    document
                        .getElementById("message")
                        ?.value
                        .trim() || "";


                /* ================================
                   VALIDATION
                ================================= */

                if (!name || !phone) {

                    formStatus = "error";

                    updateFormMessage();

                    return;
                }


                /* ================================
                   SENDING
                ================================= */

                formStatus = "sending";

                updateFormMessage();


                if (submitButton) {
                    submitButton.disabled = true;
                }


                try {

                    /*
                     * ВАЖЛИВО:
                     * no-cors потрібен для GitHub Pages
                     * → Google Apps Script.
                     *
                     * Не додаємо response.ok,
                     * тому що при no-cors відповідь
                     * має opaque-тип.
                     */

                    await fetch(
                        GOOGLE_SCRIPT_URL,
                        {
                            method: "POST",

                            mode: "no-cors",

                            headers: {
                                "Content-Type":
                                    "text/plain;charset=utf-8"
                            },

                            body: JSON.stringify({

                                full_name: name,

                                phone: phone,

                                email: email,

                                message: message

                            })
                        }
                    );


                    /* ================================
                       SUCCESS
                    ================================= */

                    formStatus = "success";

                    updateFormMessage();

                    form.reset();


                } catch (error) {

                    console.error(
                        "Помилка відправки форми:",
                        error
                    );


                    formStatus = "error";

                    updateFormMessage();

                }


                if (submitButton) {
                    submitButton.disabled = false;
                }

            }
        );

    }


    /* =====================================================
       INITIAL LANGUAGE
    ===================================================== */

    setLanguage(currentLanguage);

});

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxmJELRpugwDjDo_MOlppUq1VZrt1101d_E68XOTUTpUOkVVvlwmLOZA-zilNhRoxc3/exec";

document.addEventListener("DOMContentLoaded", () => {

    console.log("Nelli: script.js запущений");

    const form = document.getElementById("bookingForm");
    const formMessage = document.getElementById("formMessage");
    const submitButton = document.getElementById("submitButton");

    if (!form) {
        console.error("Nelli: bookingForm НЕ знайдено");
        return;
    }

    console.log("Nelli: форма знайдена");

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        console.log("Nelli: натиснуто Надіслати");

        const name = document.getElementById("name")?.value.trim() || "";
        const phone = document.getElementById("phone")?.value.trim() || "";
        const email = document.getElementById("email")?.value.trim() || "";
        const message = document.getElementById("message")?.value.trim() || "";

        if (!name || !phone) {
            if (formMessage) {
                formMessage.textContent =
                    "Будь ласка, введіть ім'я та телефон.";
            }
            return;
        }

        const data = {
            full_name: name,
            phone: phone,
            email: email,
            message: message
        };

        console.log("Nelli: дані:", data);

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Надсилаємо...";
        }

        if (formMessage) {
            formMessage.textContent = "Надсилаємо заявку...";
        }

        try {

            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(data)
            });

            /*
             * Для no-cors браузер не дозволяє прочитати
             * відповідь Google Apps Script.
             *
             * Але якщо fetch завершився без помилки,
             * POST-запит був відправлений.
             */

            console.log("Nelli: POST відправлено");

            if (formMessage) {
                formMessage.textContent =
                    "Дякуємо! Заявку отримано.";
            }

            form.reset();

        } catch (error) {

            console.error("Nelli: ПОМИЛКА:", error);

            if (formMessage) {
                formMessage.textContent =
                    "Не вдалося відправити заявку. Спробуйте ще раз.";
            }

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Надіслати заявку";
            }

        }

    });

});

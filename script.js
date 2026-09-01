const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxmJELRpugwDjDo_MOlppUq1VZrt1101d_E68XOTUTpUOkVVvlwmLOZA-zilNhRoxc3/exec";

document.addEventListener("DOMContentLoaded", function () {

    console.log("Nelli script.js ЗАПУЩЕНО");

    const form = document.getElementById("bookingForm");

    if (!form) {
        console.error("ФОРМУ bookingForm НЕ ЗНАЙДЕНО");
        return;
    }

    console.log("Форму знайдено");

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        console.log("=== ФОРМА НАТИСНУТА ===");

        const data = {
            full_name:
                document.getElementById("name")?.value.trim() || "ТЕСТ З САЙТУ",

            phone:
                document.getElementById("phone")?.value.trim() || "+420999999999",

            email:
                document.getElementById("email")?.value.trim() || "site@test.cz",

            message:
                document.getElementById("message")?.value.trim() || "Тест із GitHub"
        };

        console.log("Дані:", data);
        console.log("Відправляємо на:", GOOGLE_SCRIPT_URL);

        fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(data)
        })
        .then(function () {

            console.log("=== ЗАПИТ ВІДПРАВЛЕНО ===");

            alert(
                "Запит відправлено. Тепер перевір таблицю."
            );

        })
        .catch(function (error) {

            console.error(
                "=== ПОМИЛКА FETCH ===",
                error
            );

            alert(
                "Помилка відправки. Дивись Console."
            );

        });

    });

});
console.log("Nelli TEST 123");

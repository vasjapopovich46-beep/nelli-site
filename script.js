const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxmJELRpugwDjDo_MOlppUq1VZrt1101d_E68XOTUTpUOkVVvlwmLOZA-zilNhRoxc3/exec";

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("bookingForm");

    if (!form) {
        console.error("Форму bookingForm не знайдено");
        return;
    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const data = {
            full_name:
                document.getElementById("name")?.value.trim() || "",

            phone:
                document.getElementById("phone")?.value.trim() || "",

            email:
                document.getElementById("email")?.value.trim() || "",

            message:
                document.getElementById("message")?.value.trim() || ""
        };

        console.log("Відправляємо заявку:", data);

        fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(data)
        })
        .then(function () {

            console.log("Заявку відправлено");

            alert("Дякуємо! Заявку отримано.");

            form.reset();

        })
        .catch(function (error) {

            console.error("Помилка:", error);

            alert("Не вдалося відправити заявку.");

        });

    });

});

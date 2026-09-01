const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxmJELRpugwDjDo_MOlppUq1VZrt1101d_E68XOTUTpUOkVVvlwmLOZA-zilNhRoxc3/exec";

document.addEventListener("DOMContentLoaded", function () {

    console.log("=== NELLI SCRIPT START ===");

    const form = document.getElementById("bookingForm");

    if (!form) {
        console.error("FORM bookingForm NOT FOUND");
        return;
    }

    console.log("FORM FOUND");

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        console.log("=== SUBMIT CLICK ===");

        const data = {
            full_name: document.getElementById("name")?.value || "ТЕСТ З GITHUB",
            phone: document.getElementById("phone")?.value || "+420111111111",
            email: document.getElementById("email")?.value || "github@test.cz",
            message: document.getElementById("message")?.value || "Тест з GitHub"
        };

        console.log("DATA:", data);
        console.log("URL:", GOOGLE_SCRIPT_URL);

        try {

            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(data)
            });

            console.log("=== FETCH COMPLETED ===");

            alert(
                "Запит відправлено.\n\n" +
                "Перевір таблицю через 5–10 секунд."
            );

        } catch (error) {

            console.error("FETCH ERROR:", error);

            alert(
                "ПОМИЛКА ВІДПРАВКИ.\n\n" +
                error.message
            );

        }

    });

});

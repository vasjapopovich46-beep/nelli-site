/* =========================================================
   FORM SUBMIT
========================================================= */

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxmJELRpugwDjDo_MOlppUq1VZrt1101d_E68XOTUTpUOkVVvlwmLOZA-zilNhRoxc3/exec";


form.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const name =
            document
                .getElementById("name")
                .value
                .trim();

        const phone =
            document
                .getElementById("phone")
                .value
                .trim();

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const message =
            document
                .getElementById("message")
                .value
                .trim();


        if (!name || !phone) {

            formStatus = "error";

            updateFormMessage();

            return;
        }


        formStatus = "sending";

        updateFormMessage();

        submitButton.disabled = true;


        try {

            await fetch(
                GOOGLE_SCRIPT_URL,
                {
                    method: "POST",

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


            formStatus = "success";

            updateFormMessage();

            form.reset();


        } catch (error) {

            console.error(
                "Помилка відправки:",
                error
            );

            formStatus = "error";

            updateFormMessage();

        }


        submitButton.disabled = false;

    }
);

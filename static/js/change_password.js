
console.log("CHANGE PASSWORD JS LOADED");


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "change-password-form"
            );


        if (!form) {
            return;
        }


        form.addEventListener(
            "submit",
            changePassword
        );

    }
);



// ==============================
// CHANGE PASSWORD
// ==============================

async function changePassword(e) {

    e.preventDefault();



    const old_password =
        document.getElementById(
            "old_password"
        ).value;


    const new_password =
        document.getElementById(
            "new_password"
        ).value;


    const confirm_password =
        document.getElementById(
            "confirm_password"
        ).value;


    const errorBox =
        document.getElementById(
            "error-box"
        );



    // ==============================
    // CHECK NEW PASSWORD
    // ==============================

    if (
        new_password !== confirm_password
    ) {

        if (errorBox) {

            errorBox.textContent =
                "رمز جدید و تکرار آن یکسان نیست.";

        }

        return;

    }



    // ==============================
    // SEND REQUEST
    // ==============================

    const response =
        await apiRequest(
            "/api/accounts/change-password/",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    old_password:
                        old_password,

                    new_password:
                        new_password

                })

            }
        );



    console.log(
        "CHANGE PASSWORD STATUS:",
        response.status
    );



    const data =
        await response.json();



    console.log(
        "CHANGE PASSWORD RESPONSE:",
        data
    );



    // ==============================
    // SUCCESS
    // ==============================

    if (response.ok) {

        alert(
            "رمز عبور با موفقیت تغییر کرد. دوباره وارد شوید."
        );


        document
            .getElementById(
                "change-password-form"
            )
            .reset();


        window.location.href =
            "/login/";


        return;

    }



    // ==============================
    // ERROR
    // ==============================

    if (errorBox) {

        if (data.old_password) {

            errorBox.textContent =
                data.old_password[0];

        }

        else if (data.new_password) {

            errorBox.textContent =
                data.new_password[0];

        }

        else if (data.detail) {

            errorBox.textContent =
                data.detail;

        }

        else {

            errorBox.textContent =
                "خطا در تغییر رمز عبور.";

        }

    }

}


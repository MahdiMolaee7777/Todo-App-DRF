console.log("RESET PASSWORD JS LOADED");


document.addEventListener(
    "DOMContentLoaded",
    () => {


        const form =
            document.getElementById(
                "reset-password-form"
            );


        if (!form) {
            return;
        }


        form.addEventListener(
            "submit",
            resetPassword
        );


    }
);



async function resetPassword(e) {


    e.preventDefault();



    const uid =
        document.getElementById(
            "uid"
        ).value;



    const token =
        document.getElementById(
            "token"
        ).value;



    const newPassword =
        document.getElementById(
            "new_password"
        ).value;



    const confirmPassword =
        document.getElementById(
            "confirm_password"
        ).value;



    const errorBox =
        document.getElementById(
            "error-box"
        );



    errorBox.innerText = "";



    if (newPassword !== confirmPassword) {


        errorBox.innerText =
            "رمزهای وارد شده یکسان نیستند.";

        return;

    }




    const response =
        await fetch(

            `/api/accounts/reset-password/${uid}/${token}/`,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },


                body: JSON.stringify({

                    new_password:
                        newPassword

                })

            }

        );



    const data =
        await response.json();




    if(response.ok){


        alert(
            "رمز عبور با موفقیت تغییر کرد."
        );


        window.location.href =
            "/login/";

    }


    else {


        console.log(data);


        errorBox.innerText =
            data.detail ||
            "خطا در تغییر رمز عبور.";

    }


}
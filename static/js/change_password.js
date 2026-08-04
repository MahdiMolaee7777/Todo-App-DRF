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



    if (
        new_password !== confirm_password
    ) {

        errorBox.textContent =
            "رمز جدید و تکرار آن یکسان نیست.";

        return;

    }





    const response =
        await fetch(
            "/api/accounts/change-password/",
            {

                method: "POST",


                headers: {

                    "Content-Type":
                        "application/json"

                },


                credentials: "include",



                body: JSON.stringify({

                    old_password:
                        old_password,


                    new_password:
                        new_password

                })

            }
        );




    const data =
        await response.json();





    if (response.ok) {

        

        window.location.href="/todos/";

        


        // پاک کردن مقدار input ها
        document
            .getElementById("change-password-form")
            .reset();



        alert(
            "رمز عبور با موفقیت تغییر کرد. دوباره وارد شوید."
        );



        // کمی تاخیر برای جلوگیری از Password Manager
        setTimeout(
            () => {

                window.location.href =
                    "/login/";

            },
            100
        );


    }

    else {


        console.log(data);



        if(errorBox){

            if(data.old_password){

                errorBox.textContent =
                    data.old_password[0];

            }

            else if(data.new_password){

                errorBox.textContent =
                    data.new_password[0];

            }

            else {

                errorBox.textContent =
                    "خطا در تغییر رمز عبور.";

            }

        }

    }


}
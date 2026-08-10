console.log("REGISTER JS LOADED");


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById("register-form");


        if (!form) {

            console.log("Register form not found");

            return;

        }


        form.addEventListener(
            "submit",
            registerUser
        );


    }
);





async function registerUser(e) {

    e.preventDefault();



    const password =
        document.getElementById("password").value;


    const passwordConfirm =
        document.getElementById("password-confirm").value;



    if (password !== passwordConfirm) {

        alert("رمز عبور و تکرار آن یکسان نیست.");

        return;

    }




    const response =
        await fetch(
            "/api/accounts/register/",
            {

                method: "POST",


                headers: {

                    "Content-Type": "application/json"

                },


               


                body: JSON.stringify({

                    email:
                        document.getElementById("email").value,


                    password:
                        password,


                    first_name:
                        document.getElementById("first_name")?.value || "",


                    last_name:
                        document.getElementById("last_name")?.value || ""

                })

            }
        );




    const data =
        await response.json();



    console.log("Register response:", data);




    if (response.ok) {


        alert(
            "ثبت‌نام انجام شد. لطفاً ایمیل خود را برای تأیید حساب بررسی کنید."
        );

        window.location.href =
            data.redirect_url;



    }

    else {


        alert(
            JSON.stringify(data)
        );


    }


}
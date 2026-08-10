console.log("FORGOT PASSWORD JS LOADED");


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "forgot-password-form"
            );


        if (!form) {
            return;
        }


        form.addEventListener(
            "submit",
            forgotPassword
        );

    }
);



async function forgotPassword(e) {

    e.preventDefault();


    const email =
        document.getElementById(
            "email"
        ).value;



    const response =
        await fetch(
            "/api/accounts/forgot-password/",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },


                body: JSON.stringify({

                    email: email

                })

            }
        );



    const data =await response.json();

    console.log("FORGOT PASSWORD STATUS:", response.status);
    console.log("FORGOT PASSWORD DATA:", data);
    



    if(response.ok){


        alert(
            "اگر این ایمیل وجود داشته باشد، لینک بازیابی ارسال شد."
        );


    }

    else {


        console.log(data);


        alert(
            "خطا در ارسال درخواست."
        );

    }

}
console.log("login JS LOADED");

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("login-form");


    if (!form) return;


    form.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const errorBox =
                document.getElementById("error-box");

            const button =
                document.getElementById("login-btn");


            errorBox.classList.add("hidden");

            errorBox.textContent = "";


            button.disabled = true;

            button.textContent =
                "در حال ورود...";


            try {

                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim();


                const password =
                    document
                        .getElementById("password")
                        .value;


                await login(
                    email,
                    password
                );


                window.location.href =
                    "/todos/";

            }


            catch (error) {

                console.log(
                    "LOGIN ERROR:",
                    error
                );


                /*
                 * Email is not verified
                 */

                if (
                    error.errors?.code ===
                    "email_not_verified"
                ) {


                    errorBox.innerHTML = `

                        <div class="space-y-3">

                            <p>
                                ایمیل شما هنوز تأیید نشده است.
                            </p>


                            <button
                                type="button"
                                id="resend-verification-btn"
                                class="text-primary-600 hover:text-primary-700 underline font-bold">

                                ارسال دوباره ایمیل تأیید

                            </button>

                        </div>

                    `;


                    const resendBtn =
                        document.getElementById(
                            "resend-verification-btn"
                        );


                    resendBtn.addEventListener(
                        "click",
                        async () => {


                            resendBtn.disabled = true;


                            resendBtn.textContent =
                                "در حال ارسال...";


                            try {


                                const response =
                                    await fetch(
                                        "/api/accounts/resend-verification/",
                                        {

                                            method: "POST",

                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },

                                            body: JSON.stringify({
                                                email: email
                                            }),

                                        }
                                    );


                                const data =
                                    await response.json();


                                console.log(
                                    "RESEND STATUS:",
                                    response.status
                                );

                                console.log(
                                    "RESEND DATA:",
                                    data
                                );


                                if (!response.ok) {

                                    throw new Error(
                                        data.detail ||
                                        "خطا در ارسال ایمیل"
                                    );

                                }


                                /*
                                 * Replace the error message
                                 * after successful resend.
                                 */

                                errorBox.innerHTML = `

                                    <div class="space-y-3">

                                        <p>
                                            ایمیل تأیید دوباره ارسال شد.
                                        </p>

                                        <p class="text-sm text-slate-500">
                                            لطفاً ایمیل خود را بررسی کنید.
                                        </p>

                                    </div>

                                `;


                            }


                            catch (err) {

                                console.error(
                                    "RESEND ERROR:",
                                    err
                                );


                                errorBox.innerHTML = `

                                    <p>
                                        ارسال ایمیل با خطا مواجه شد.
                                        لطفاً دوباره تلاش کنید.
                                    </p>

                                `;

                            }


                            finally {

                                /*
                                 * بعد از ارسال موفق،
                                 * دکمه دیگر لازم نیست.
                                 */

                                const currentButton =
                                    document.getElementById(
                                        "resend-verification-btn"
                                    );


                                if (currentButton) {

                                    currentButton.disabled =
                                        false;

                                    currentButton.textContent =
                                        "ارسال دوباره ایمیل تأیید";

                                }

                            }

                        }
                    );

                }


                /*
                 * Other login errors
                 */

                else {


                    errorBox.textContent =
                        error.errors?.detail ||
                        error.detail ||
                        "ورود ناموفق بود.";

                }


                errorBox.classList.remove(
                    "hidden"
                );

            }


            finally {

                button.disabled = false;

                button.textContent =
                    "ورود";

            }

        }
    );

});
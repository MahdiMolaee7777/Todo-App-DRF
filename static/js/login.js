console.log("login JS LOADED");
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("login-form");

    if (!form) return;

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const errorBox = document.getElementById("error-box");
        const button = document.getElementById("login-btn");

        errorBox.classList.add("hidden");
        errorBox.textContent = "";

        button.disabled = true;
        button.textContent = "در حال ورود...";

        try {

            const email = document.getElementById("email").value.trim();

            const password = document.getElementById("password").value;

            await login(email, password);

            window.location.href = "/todos/";

        }

        catch (error) {

            errorBox.textContent =
                error.message || "ورود ناموفق بود.";

            errorBox.classList.remove("hidden");

        }

        finally {

            button.disabled = false;
            button.textContent = "ورود";

        }

    });

});
document.addEventListener("DOMContentLoaded", () => {

    loadNavbarUser();

});


async function loadNavbarUser() {

    const response =
        await fetch(
            "/api/accounts/profile/",
            {
                credentials: "include"
            }
        );

    if (!response.ok) {
        return;
    }

    const user =
        await response.json();

    console.log("Navbar User:", user);

    document.getElementById("navbar-name").textContent =
        `${user.first_name || ""} ${user.last_name || ""}`.trim() || "کاربر";

    document.getElementById("navbar-email").textContent =
        user.email || "";

    const avatar =
        document.getElementById("navbar-avatar");

    if (!avatar) {
        return;
    }

    if (user.avatar) {

        avatar.src = user.avatar;

    } else {

        avatar.src =
            "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(user.first_name || user.email || "User");

    }

}
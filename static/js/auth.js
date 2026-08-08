console.log("AUTH JS LOADED");
const API_BASE = "/api/accounts";


async function login(email, password) {

    console.log("LOGIN FUNCTION CALLED");


    const response = await fetch(`${API_BASE}/login/`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
            email,
            password,
        }),

    });



    const data = await response.json();



    if (!response.ok) {

        console.log("LOGIN ERROR RESPONSE:", data);


        throw data;

    }


    return data;

}
async function getCurrentUser() {
    const response = await fetch(`${API_BASE}/me/`, {
        credentials: "include",
    });

    if (!response.ok) {
        return null;
    }

    return await response.json();
}

async function refreshAccessToken() {

    console.log("REFRESH TOKEN FUNCTION CALLED");

    const response = await fetch(
        `${API_BASE}/refresh/`,
        {
            method: "POST",
            credentials: "include",
        }
    );

    const data = await response.json();

    console.log("REFRESH STATUS:", response.status);
    console.log("REFRESH DATA:", data);

    if (!response.ok) {
        return false;
    }

    return true;
}

async function apiFetch(url, options = {}, retry = true) {

    const response = await fetch(
        url,
        {
            ...options,
            credentials: "include",
        }
    );


    // Access Token هنوز معتبر است
    if (response.status !== 401) {

        return response;

    }


    // اگر قبلاً یک بار Refresh کردیم
    // دوباره Refresh نکن
    if (!retry) {

        return response;

    }


    console.log("ACCESS TOKEN EXPIRED");
    console.log("Trying to refresh token...");


    const refreshed =
        await refreshAccessToken();


    if (!refreshed) {

        console.log(
            "REFRESH FAILED - USER MUST LOGIN"
        );

        window.location.href = "/login/";

        return response;

    }


    console.log(
        "TOKEN REFRESHED - RETRYING REQUEST"
    );


    // درخواست اصلی دوباره اجرا می‌شود
    return apiFetch(
        url,
        options,
        false
    );
}


/* ---------- expose globally ---------- */

window.login = login;
window.register = register;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.refreshAccessToken = refreshAccessToken;
window.apiFetch = apiFetch;
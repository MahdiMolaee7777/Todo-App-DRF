console.log("AUTH JS LOADED");
const API_BASE = "/api/accounts";


async function login(email, password) {
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
        throw new Error(data.detail || "Login failed.");
    }

    return data;
}

async function register(userData) {
    const response = await fetch(`${API_BASE}/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
}

async function logout() {
    const response = await fetch(`${API_BASE}/logout/`, {
        method: "POST",
        credentials: "include",
    });

    return response.ok;
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

/* ---------- expose globally ---------- */

window.login = login;
window.register = register;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
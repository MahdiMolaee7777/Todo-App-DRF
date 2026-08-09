
const API_BASE = "/api/accounts";

let refreshPromise = null;


async function refreshAccessToken() {

    if (refreshPromise) {

        console.log(
            "REFRESH ALREADY RUNNING - WAITING"
        );

        return refreshPromise;
    }


    refreshPromise = (async () => {

        console.log(
            "REFRESH TOKEN FUNCTION CALLED"
        );


        try {

            const response =
                await fetch(
                    `${API_BASE}/refresh/`,
                    {
                        method: "POST",
                        credentials: "include",
                    }
                );


            console.log(
                "REFRESH STATUS:",
                response.status
            );


            if (!response.ok) {

                console.log(
                    "REFRESH FAILED"
                );

                return false;
            }


            console.log(
                "REFRESH SUCCESS"
            );


            return true;

        }

        catch (error) {

            console.error(
                "REFRESH ERROR:",
                error
            );

            return false;

        }

        finally {

            refreshPromise = null;

        }

    })();


    return refreshPromise;
}


async function apiRequest(
    url,
    options = {},
    retry = true
) {

    console.log(
        "API REQUEST:",
        url
    );


    const response =
        await fetch(
            url,
            {
                ...options,
                credentials: "include",
            }
        );


    console.log(
        "API STATUS:",
        response.status
    );


    if (response.status !== 401) {

        return response;

    }


    if (!retry) {

        console.log(
            "REQUEST FAILED AFTER REFRESH"
        );

        return response;

    }


    console.log(
        "ACCESS TOKEN EXPIRED"
    );


    const refreshed =
        await refreshAccessToken();


    if (!refreshed) {

        console.log(
            "REFRESH FAILED - LOGIN REQUIRED"
        );


        window.location.href =
            "/login/";


        return response;

    }


    console.log(
        "TOKEN REFRESHED - RETRYING REQUEST"
    );


    return apiRequest(
        url,
        options,
        false
    );
}


window.refreshAccessToken =
    refreshAccessToken;


window.apiRequest =
    apiRequest;


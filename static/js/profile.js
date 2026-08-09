console.log("PROFILE JS LOADED");


document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProfile();


        document
            .getElementById("avatar")
            ?.addEventListener(
                "change",
                previewAvatar
            );


        document
            .getElementById("save-profile")
            ?.addEventListener(
                "click",
                updateProfile
            );

    }
);



// ==============================
// LOAD PROFILE
// ==============================

async function loadProfile() {

    console.log("Loading profile...");


    const response =
        await apiRequest(
            "/api/accounts/profile/"
        );


    console.log(
        "PROFILE STATUS:",
        response.status
    );


    if (!response.ok) {

        console.log(
            "PROFILE LOAD ERROR"
        );

        alert(
            "خطا در دریافت اطلاعات"
        );

        return;

    }


    const user =
        await response.json();


    console.log(
        "PROFILE DATA:",
        user
    );



    document
        .getElementById("email")
        .value =
        user.email || "";


    document
        .getElementById("first_name")
        .value =
        user.first_name || "";


    document
        .getElementById("last_name")
        .value =
        user.last_name || "";


    document
        .getElementById("bio")
        .value =
        user.bio || "";



    // ==========================
    // AVATAR
    // ==========================

    const avatarPreview =
        document.getElementById(
            "avatar-preview"
        );


    if (
        avatarPreview &&
        user.avatar
    ) {

        avatarPreview.src =
            user.avatar;

    }

}



// ==============================
// AVATAR PREVIEW
// ==============================

function previewAvatar(e) {

    const file =
        e.target.files[0];


    if (!file) {

        return;

    }


    
    const image =
        document.getElementById(
            "avatar-preview"
        );



    image.src =
        URL.createObjectURL(file);

}



// ==============================
// UPDATE PROFILE
// ==============================

async function updateProfile() {

    console.log(
        "Updating profile..."
    );


    const formData =
        new FormData();



    const avatar =
        document
            .getElementById("avatar")
            .files[0];


    if (avatar) {

        formData.append(
            "avatar",
            avatar
        );

    }



    formData.append(
        "first_name",
        document
            .getElementById("first_name")
            .value
    );


    formData.append(
        "last_name",
        document
            .getElementById("last_name")
            .value
    );


    formData.append(
        "bio",
        document
            .getElementById("bio")
            .value
    );



    const response =
        await apiRequest(
            "/api/accounts/profile/",
            {
                method: "PATCH",

                body: formData
            }
        );



    console.log(
        "PROFILE UPDATE STATUS:",
        response.status
    );



    const data =
        await response.json();



    console.log(
        "PROFILE UPDATE DATA:",
        data
    );



    if (response.ok) {

        alert(
            "پروفایل با موفقیت ذخیره شد"
        );


        window.location.href =
            "/todos/";

    }
    else {

        console.log(
            "PROFILE UPDATE ERROR:",
            data
        );


        alert(
            "خطا در ذخیره پروفایل"
        );

    }

}
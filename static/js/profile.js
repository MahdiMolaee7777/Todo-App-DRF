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





async function loadProfile(){


    const response =
        await fetch(
            "/api/accounts/profile/",
            {
                credentials:"include"
            }
        );



    if(!response.ok){

        alert("خطا در دریافت اطلاعات");

        return;

    }



    const user =
        await response.json();



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



   const avatar =
    document.getElementById("navbar-avatar");


    if(user.avatar){

        avatar.src = user.avatar;

    }
    else{

        avatar.src =
        "https://ui-avatars.com/api/?name="
        + user.first_name;

    }



}







function previewAvatar(e){


    const file =
        e.target.files[0];



    if(!file){

        return;

    }



    const image =
        document.getElementById(
            "avatar-preview"
        );



    image.src =
        URL.createObjectURL(file);



}










async function updateProfile(){



    const formData =
        new FormData();



    const avatar =
        document
        .getElementById("avatar")
        .files[0];



    if(avatar){

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
        await fetch(
            "/api/accounts/profile/",
            {

                method:"PATCH",

                credentials:"include",


                body:formData

            }
        );





    const data =
        await response.json();





    if(response.ok){


        alert(
            "پروفایل با موفقیت ذخیره شد"
        );



        window.location.href =
            "/todos/";


    }
    else{


        console.log(data);


        alert(
            "خطا در ذخیره پروفایل"
        );


    }




}
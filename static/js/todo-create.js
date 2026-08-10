document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadCategories();


        const form =
        document.getElementById("todo-form");


        form.addEventListener(
            "submit",
            saveTodo
        );

    }
);



async function loadCategories(){

    const response =
    await fetch(
        "/api/categories/",
        {
            credentials:"include"
        }
    );


    const categories =
    await response.json();


    const select =
    document.getElementById("category");


    categories.forEach(category=>{


        const option =
        document.createElement("option");


        option.value =
        category.id;


        option.textContent =
        category.name;


        select.appendChild(option);


    });

}

function jalaliToGregorian(jalaliDate) {

    if (!jalaliDate) {
        return null;
    }

    const parts = jalaliDate
        .replace(/[۰-۹]/g, d =>
            "۰۱۲۳۴۵۶۷۸۹".indexOf(d)
        )
        .split("/");

    if (parts.length !== 3) {
        return null;
    }

    const jy = Number(parts[0]);
    const jm = Number(parts[1]);
    const jd = Number(parts[2]);

    const result =
        jalaali.toGregorian(
            jy,
            jm,
            jd
        );

    return `${result.gy}-${String(result.gm).padStart(2, "0")}-${String(result.gd).padStart(2, "0")}`;
}




async function saveTodo(e){

    e.preventDefault();



    await fetch(
        "/api/todos/",
        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            credentials:"include",

            body:JSON.stringify({

                title:
                document.getElementById("title").value,


                description:
                document.getElementById("description").value,


                priority:
                document.getElementById("priority").value,


                category:
                document.getElementById("category").value || null,


                due_date:
                    jalaliToGregorian(
                        document.getElementById("due_date").value
                    )

            })

        }
    );



    window.location.href="/todos/";

}
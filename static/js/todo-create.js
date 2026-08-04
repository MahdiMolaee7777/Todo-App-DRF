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
                document.getElementById("due_date").value || null

            })

        }
    );



    window.location.href="/todos/";

}
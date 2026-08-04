document.addEventListener(
    "DOMContentLoaded",
    async () => {


        console.log("TODO EDIT JS RUNNING");
        console.log("TODO_ID =", TODO_ID);



        if (TODO_ID) {

            await loadTodo();

        }



        await loadCategories();



        const form =
        document.getElementById("todo-form");


        if (form) {

            form.addEventListener(
                "submit",
                updateTodo
            );

        }


    }
);





async function loadTodo(){


    console.log(
        "loading todo:",
        TODO_ID
    );



    const response =
    await fetch(
        `/api/todos/${TODO_ID}/`,
        {
            credentials:"include"
        }
    );



    const todo =
    await response.json();



    console.log(
        "todo data:",
        todo
    );



    document.getElementById("title").value =
        todo.title;



    document.getElementById("description").value =
        todo.description ?? "";



    document.getElementById("priority").value =
        todo.priority;



    document.getElementById("due_date").value =
        todo.due_date ?? "";



    if(todo.category){

        document.getElementById("category").value =
            todo.category.id;

    }


}







async function loadCategories(){


    const response =
    await fetch(
        "/api/categories/",
        {
            credentials:"include"
        }
    );


    const data =
    await response.json();


    console.log("categories response:", data);



    if(!response.ok){

        console.log("Category error:", data);
        return;

    }



    let categories = [];


    if(Array.isArray(data)){

        categories = data;

    }
    else if(Array.isArray(data.results)){

        categories = data.results;

    }
    else{

        console.log("Unexpected categories format:", data);
        return;

    }



    const select =
    document.getElementById("category");


    select.innerHTML = "";



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







async function updateTodo(e){


    e.preventDefault();



    const response =
    await fetch(

        `/api/todos/${TODO_ID}/`,

        {

            method:"PATCH",


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



    if(response.ok){


        window.location.href =
        "/todos/";


    }
    else{


        console.log(
            await response.json()
        );


    }


}
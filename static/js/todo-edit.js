console.log("TODO EDIT JS LOADED");


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log("TODO EDIT JS RUNNING");
        console.log("TODO_ID =", TODO_ID);


        if (!TODO_ID) {

            console.log("TODO_ID not found");

            return;
        }


        /*
        ========================================
        1. Load Categories
        ========================================
        */

        await loadCategories();


        /*
        ========================================
        2. Load Todo
        ========================================
        */

        await loadTodo();


        /*
        ========================================
        3. Form Submit
        ========================================
        */

        const form =
            document.getElementById(
                "todo-form"
            );


        if (form) {

            form.addEventListener(
                "submit",
                updateTodo
            );

        }

    }
);


/*
========================================
LOAD TODO
========================================
*/

async function loadTodo() {

    console.log(
        "Loading todo:",
        TODO_ID
    );


    const response =
        await apiRequest(
            `/api/todos/${TODO_ID}/`
        );


    const todo =
        await response.json();


    console.log(
        "TODO RESPONSE:",
        todo
    );


    if (!response.ok) {

        console.log(
            "TODO LOAD ERROR:",
            todo
        );

        return;
    }


    /*
    ========================================
    Title
    ========================================
    */

    const titleInput =
        document.getElementById(
            "title"
        );


    if (titleInput) {

        titleInput.value =
            todo.title || "";

    }


    /*
    ========================================
    Description
    ========================================
    */

    const descriptionInput =
        document.getElementById(
            "description"
        );


    if (descriptionInput) {

        descriptionInput.value =
            todo.description || "";

    }


    /*
    ========================================
    Priority
    ========================================
    */

    const prioritySelect =
        document.getElementById(
            "priority"
        );


    if (prioritySelect) {

        prioritySelect.value =
            todo.priority || "medium";

    }


    /*
    ========================================
    Due Date
    ========================================
    */

    const dueDateInput =
        document.getElementById(
            "due_date"
        );


    if (dueDateInput) {

        dueDateInput.value =
            todo.due_date || "";

    }


    /*
    ========================================
    Category
    ========================================
    */

    const categorySelect =
        document.getElementById(
            "category"
        );


    if (!categorySelect) {

        return;
    }


    if (todo.category) {

        categorySelect.value =
            todo.category.id;

    }
    else {

        categorySelect.value =
            "";

    }


    console.log(
        "Selected category:",
        categorySelect.value
    );

}


/*
========================================
LOAD CATEGORIES
========================================
*/

async function loadCategories() {

    console.log(
        "Loading categories..."
    );


    const response =
        await apiRequest(
            "/api/categories/"
        );


    const data =
        await response.json();


    console.log(
        "CATEGORIES RESPONSE:",
        data
    );


    if (!response.ok) {

        console.log(
            "CATEGORY LOAD ERROR:",
            data
        );

        return;
    }


    /*
    ========================================
    Handle DRF pagination
    ========================================
    */

    let categories = [];


    if (Array.isArray(data)) {

        categories = data;

    }
    else if (
        Array.isArray(data.results)
    ) {

        categories =
            data.results;

    }
    else {

        console.log(
            "Unexpected categories format:",
            data
        );

        return;
    }


    /*
    ========================================
    Select
    ========================================
    */

    const select =
        document.getElementById(
            "category"
        );


    if (!select) {

        console.log(
            "Category select not found"
        );

        return;
    }


    /*
    ========================================
    Clear old options
    ========================================
    */

    select.innerHTML = "";


    /*
    ========================================
    Empty option
    ========================================
    */

    const emptyOption =
        document.createElement(
            "option"
        );


    emptyOption.value = "";


    emptyOption.textContent =
        "بدون دسته‌بندی";


    select.appendChild(
        emptyOption
    );


    /*
    ========================================
    Add categories
    ========================================
    */

    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category.id;


            option.textContent =
                category.name;


            select.appendChild(
                option
            );

        }
    );


    console.log(
        "Categories loaded:",
        categories
    );

}


/*
========================================
UPDATE TODO
========================================
*/

async function updateTodo(e) {

    e.preventDefault();


    console.log(
        "Updating todo:",
        TODO_ID
    );


    const title =
        document.getElementById(
            "title"
        ).value;


    const description =
        document.getElementById(
            "description"
        ).value;


    const priority =
        document.getElementById(
            "priority"
        ).value;


    const category =
        document.getElementById(
            "category"
        ).value;


    const dueDate =
        document.getElementById(
            "due_date"
        ).value;


    /*
    ========================================
    PATCH Request
    ========================================
    */

    const response =
        await apiRequest(
            `/api/todos/${TODO_ID}/`,
            {

                method: "PATCH",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    title:
                        title,

                    description:
                        description,

                    priority:
                        priority,

                    category:
                        category || null,

                    due_date:
                        dueDate || null

                })

            }
        );


    const data =
        await response.json();


    console.log(
        "UPDATE RESPONSE:",
        data
    );


    /*
    ========================================
    Success
    ========================================
    */

    if (response.ok) {

        console.log(
            "TODO UPDATED SUCCESSFULLY"
        );


        window.location.href =
            "/todos/";

    }
    else {

        console.log(
            "TODO UPDATE ERROR:",
            data
        );


        const errorBox =
            document.getElementById(
                "error-box"
            );


        if (errorBox) {

            errorBox.classList.remove(
                "hidden"
            );


            errorBox.textContent =
                "خطا در ویرایش کار.";

        }

    }

}
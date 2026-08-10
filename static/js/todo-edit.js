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
================================================
DATE CONVERSION
================================================
*/


/*
    Gregorian
    2026-08-09

    ↓

    Jalali
    1405/05/18
*/
function gregorianToJalali(
    gregorianDate
) {

    if (!gregorianDate) {

        return "";

    }


    const [
        gy,
        gm,
        gd
    ] =
        gregorianDate
            .split("-")
            .map(Number);


    const result =
        jalaali.toJalaali(
            gy,
            gm,
            gd
        );


    return (
        `${result.jy}/` +
        `${String(result.jm).padStart(2, "0")}/` +
        `${String(result.jd).padStart(2, "0")}`
    );

}



/*
    Jalali
    1405/05/18

    ↓

    Gregorian
    2026-08-09
*/
function jalaliToGregorian(
    jalaliDate
) {

    if (!jalaliDate) {

        return "";

    }


    const [
        jy,
        jm,
        jd
    ] =
        jalaliDate
            .split("/")
            .map(Number);


    const result =
        jalaali.toGregorian(
            jy,
            jm,
            jd
        );


    return (
        `${result.gy}-` +
        `${String(result.gm).padStart(2, "0")}-` +
        `${String(result.gd).padStart(2, "0")}`
    );

}



/*
================================================
LOAD TODO
================================================
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

        if (todo.due_date) {

            const jalaliDate =
                gregorianToJalali(
                    todo.due_date
                );


            dueDateInput.value =
                jalaliDate;


            console.log(
                "Gregorian:",
                todo.due_date
            );


            console.log(
                "Jalali:",
                jalaliDate
            );

        }
        else {

            dueDateInput.value =
                "";

        }

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
================================================
LOAD CATEGORIES
================================================
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

        categories =
            data;

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
================================================
UPDATE TODO
================================================
*/

async function updateTodo(e) {

    e.preventDefault();


    console.log(
        "Updating todo:",
        TODO_ID
    );



    /*
    ========================================
    Get Form Values
    ========================================
    */

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


    const jalaliDueDate =
        document.getElementById(
            "due_date"
        ).value;



    /*
    ========================================
    Convert Jalali → Gregorian
    ========================================
    */

    let gregorianDueDate = "";


    if (jalaliDueDate) {

        gregorianDueDate =
            jalaliToGregorian(
                jalaliDueDate
            );

    }


    console.log(
        "Jalali due date:",
        jalaliDueDate
    );


    console.log(
        "Gregorian due date:",
        gregorianDueDate
    );



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
                        gregorianDueDate || null

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
console.log("TODO JS LOADED");


const todoList =
    document.getElementById("todo-list");



/*
================================================
DATE CONVERSION
================================================
*/


function gregorianToJalali(gregorianDate) {

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
================================================
LOAD TODOS
================================================
*/


async function loadTodos() {

    let url =
        "/api/todos/?";


    const search =
        document
            .getElementById(
                "search-input"
            )
            ?.value;


    const status =
        document
            .getElementById(
                "status-filter"
            )
            ?.value;


    const priority =
        document
            .getElementById(
                "priority-filter"
            )
            ?.value;



    if (search) {

        url +=
            `search=${encodeURIComponent(search)}&`;

    }


    if (status) {

        url +=
            `completed=${status}&`;

    }


    if (priority) {

        url +=
            `priority=${priority}&`;

    }



    const response =
        await apiRequest(url);


    const data =
        await response.json();


    if (!response.ok) {

        console.log(
            "TODO LOAD ERROR:",
            data
        );

        return;

    }


    const todos =
        data.results || data;


    updateStats(todos);

    renderTodos(todos);

}



/*
================================================
UPDATE STATS
================================================
*/


function updateStats(todos) {

    const total =
        todos.length;


    const completed =
        todos.filter(
            todo => todo.completed
        ).length;


    const pending =
        total - completed;



    const totalCount =
        document.getElementById(
            "total-count"
        );


    const completedCount =
        document.getElementById(
            "completed-count"
        );


    const pendingCount =
        document.getElementById(
            "pending-count"
        );



    if (totalCount) {

        totalCount.textContent =
            total;

    }


    if (completedCount) {

        completedCount.textContent =
            completed;

    }


    if (pendingCount) {

        pendingCount.textContent =
            pending;

    }

}



/*
================================================
RENDER TODOS
================================================
*/


function renderTodos(todos) {

    console.log(
        "renderTodos",
        todos
    );


    if (!todoList) {

        return;

    }



    const priorityMap = {

        low: {
            text: "کم",
            color: "bg-green-100 text-green-700"
        },

        medium: {
            text: "متوسط",
            color: "bg-yellow-100 text-yellow-700"
        },

        high: {
            text: "زیاد",
            color: "bg-red-100 text-red-700"
        }

    };



    todoList.innerHTML = "";



    todos.forEach(todo => {


        const priority =
            priorityMap[todo.priority]
            ||
            priorityMap.medium;



        const categoryName =
            todo.category
                ?
                todo.category.name
                :
                "بدون دسته";



        const categoryColor =
            todo.category
                ?
                todo.category.color
                :
                "#94a3b8";



        const statusText =
            todo.completed
                ?
                "انجام شده"
                :
                "در حال انجام";



        const statusClass =
            todo.completed
                ?
                "bg-emerald-100 text-emerald-700"
                :
                "bg-slate-100 text-slate-700";



        const toggleText =
            todo.completed
                ?
                "بازگردانی"
                :
                "انجام شد";



        const toggleColor =
            todo.completed
                ?
                "bg-yellow-100 hover:bg-yellow-200"
                :
                "bg-emerald-100 hover:bg-emerald-200";



        /*
        ========================================
        Convert Due Date
        ========================================
        */

        const jalaliDueDate =
            todo.due_date
                ?
                gregorianToJalali(
                    todo.due_date
                )
                :
                "";



        console.log(
            "Todo date:",
            todo.due_date,
            "=>",
            jalaliDueDate
        );



        const div =
            document.createElement(
                "div"
            );



        div.className =
            "bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-5";



        div.innerHTML = `

        <div class="flex justify-between items-start gap-4">


            <div class="flex-1">


                <h3 class="text-xl font-black">

                    ${todo.title}

                </h3>


                <p class="mt-2 text-slate-600">

                    ${todo.description || ""}

                </p>



                <div class="flex flex-wrap gap-3 mt-5">


                    <span
                    class="px-3 py-1 rounded-full text-sm font-bold text-white"
                    style="background:${categoryColor};">

                        ${categoryName}

                    </span>



                    <span
                    class="px-3 py-1 rounded-full text-sm font-bold ${priority.color}">

                        ${priority.text}

                    </span>



                    <span
                    class="px-3 py-1 rounded-full text-sm font-bold ${statusClass}">

                        ${statusText}

                    </span>



                    ${
                        jalaliDueDate
                        ?
                        `
                        <span class="px-3 py-1 rounded-full text-sm bg-slate-100">

                            📅 ${jalaliDueDate}

                        </span>
                        `
                        :
                        ""
                    }


                </div>


            </div>




            <div class="flex flex-col gap-2">


                <button
                onclick="toggleTodo(${todo.id})"
                class="px-4 py-2 rounded-lg ${toggleColor} font-bold">

                    ${toggleText}

                </button>



                <button
                onclick="editTodo(${todo.id})"
                class="px-3 py-2 bg-blue-100 text-blue-700 rounded">

                    ویرایش

                </button>



                <button
                onclick="deleteTodo(${todo.id})"
                class="px-4 py-2 rounded-lg bg-red-100">

                    حذف

                </button>


            </div>


        </div>

        `;



        todoList.appendChild(
            div
        );

    });

}



/*
================================================
TOGGLE TODO
================================================
*/


window.toggleTodo =
    async function(id) {


        const response =
            await apiRequest(

                `/api/todos/${id}/toggle/`,

                {

                    method: "POST"

                }

            );


        if (response.ok) {

            loadTodos();

        }

    };



/*
================================================
DELETE TODO
================================================
*/


window.deleteTodo =
    async function(id) {


        const response =
            await apiRequest(

                `/api/todos/${id}/`,

                {

                    method: "DELETE"

                }

            );


        if (response.ok) {

            loadTodos();

        }

    };



/*
================================================
EDIT TODO
================================================
*/


window.editTodo =
    function(id) {

        window.location.href =
            `/todos/${id}/edit/`;

    };



/*
================================================
LOAD CATEGORIES
================================================
*/


async function loadCategories() {

    const response =
        await apiRequest(
            "/api/categories/"
        );


    if (!response.ok) {

        return;

    }


    const data =
        await response.json();


    const categories =
        data.results || data;


    const select =
        document.getElementById(
            "category"
        );


    if (!select) {

        return;

    }


    select.innerHTML = "";



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

}



/*
================================================
CREATE TODO
================================================
*/


async function createTodo(e) {

    e.preventDefault();



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
        ).value
        ||
        null;



    const due_date =
        document.getElementById(
            "due_date"
        ).value
        ||
        null;



    const response =
        await apiRequest(

            "/api/todos/",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify({

                        title,
                        description,
                        priority,
                        category,
                        due_date

                    })

            }

        );



    const data =
        await response.json();



    if (!response.ok) {


        const errorBox =
            document.getElementById(
                "error-box"
            );


        if (errorBox) {

            errorBox.textContent =
                JSON.stringify(data);


            errorBox.classList.remove(
                "hidden"
            );

        }


        return;

    }



    window.location.href =
        "/todos/";

}



/*
================================================
LOAD USER INFO
================================================
*/


async function loadUserInfo() {

    const response =
        await apiRequest(
            "/api/accounts/profile/"
        );


    if (!response.ok) {

        return;

    }


    const user =
        await response.json();


    const info =
        document.getElementById(
            "username-display"
        );


    if (!info) {

        return;

    }


    const fullName =
        `${user.first_name} ${user.last_name}`
            .trim();


    info.textContent =
        fullName
            ?
            `${fullName} | ${user.email}`
            :
            user.email;

}



/*
================================================
DOM LOADED
================================================
*/


document.addEventListener(
    "DOMContentLoaded",
    () => {


        loadUserInfo();



        const todoForm =
            document.getElementById(
                "todo-form"
            );


        if (todoForm) {


            loadCategories();


            todoForm.addEventListener(
                "submit",
                createTodo
            );

        }



        const logoutBtn =
            document.getElementById(
                "logout-btn"
            );


        if (logoutBtn) {


            logoutBtn.addEventListener(
                "click",
                async () => {


                    await fetch(

                        "/api/accounts/logout/",

                        {

                            method: "POST",

                            credentials:
                                "include"

                        }

                    );


                    window.location.href =
                        "/login/";

                }

            );

        }



        if (todoList) {

            loadTodos();

        }



        document
            .getElementById(
                "search-input"
            )
            ?.addEventListener(
                "input",
                loadTodos
            );



        document
            .getElementById(
                "status-filter"
            )
            ?.addEventListener(
                "change",
                loadTodos
            );



        document
            .getElementById(
                "priority-filter"
            )
            ?.addEventListener(
                "change",
                loadTodos
            );



        document
            .getElementById(
                "filter-btn"
            )
            ?.addEventListener(
                "click",
                loadTodos
            );

    }
);
document.addEventListener(
"DOMContentLoaded",
()=>{


const modal =
document.getElementById(
"category-modal"
);


const openBtn =
document.getElementById(
"create-category-btn"
);



openBtn.onclick = ()=>{

    modal.classList.remove("hidden");

};



document
.getElementById("save-category-btn")
.onclick = async()=>{


const name =
document.getElementById(
"category-name"
).value;


const color =
document.getElementById(
"category-color"
).value;



const response =
await fetch(
"/api/categories/",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

credentials:"include",

body:JSON.stringify({
name,
color
})

});


const category =
await response.json();



addCategory(category);



modal.classList.add("hidden");



};



function addCategory(category){


const select =
document.getElementById(
"category"
);



const option =
document.createElement("option");


option.value =
category.id;


option.textContent =
category.name;


select.appendChild(option);


select.value =
category.id;


}



});
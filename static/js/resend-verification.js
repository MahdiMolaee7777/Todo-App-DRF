document
.addEventListener(
    "DOMContentLoaded",
    () => {


const form =
document.getElementById(
    "resend-form"
);


if(!form) return;



form.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



const email =
document.getElementById(
    "resend-email"
).value;



const response =
await fetch(
"/api/accounts/resend-verification/",
{


method:"POST",


headers:{
"Content-Type":"application/json"
},


body:JSON.stringify({
email
})


});



const data =
await response.json();



alert(data.detail);



});


});
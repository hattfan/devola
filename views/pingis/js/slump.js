// var elements = document.getElementsByClassName("player");
var elements = document.getElementsByClassName("fas fa-user-secret fa-3x");

for (let i = 0; i < elements.length; i++) {
    const btn = elements[i];
    btn.addEventListener("click", function () {
        console.log(btn.className)

        // if(btn.className == "fas fa-user-secret fa-3x") {
        //     btn.className == "fas user-astronaut fa-3x"
        // } else if {
        //     btn.className == "fas user-secret fa-3x"
        // }
        btn.classList.toggle("playerYes");
        
    });
}

document.getElementById('slump').addEventListener("click",function(){
    var slumpas = document.getElementsByClassName("btn-primary");
    for (let i = 0; i < slumpas.length; i++) {
        const element = slumpas[i];
        console.log(element.innerHTML)
    }

})
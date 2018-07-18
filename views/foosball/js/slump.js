var btn = document.getElementById('slump');
var elements = document.querySelectorAll("a");

elements.forEach(btn => {
    btn.addEventListener("click", function () {
        if (btn.innerHTML=="Ej med") {
            btn.innerHTML = "Är med";
            btn.className = "btn btn-success"
        }
        else{
            btn.innerHTML = "Ej med";
            btn.className = "btn btn-danger";
        } 
    });
})

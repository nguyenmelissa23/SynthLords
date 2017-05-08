//FRONT END JS

$(".led-red").on("click", function(){
    $(this).toggleClass("led-red-on");
    switch (this.getAttribute("value")){
        case ("0"):
        this.setAttribute("value", 1);
        console.log("On: " + this);
        break;
        case ("1"):
        this.setAttribute("value", 0);
        console.log("Off: " + this);
        break;
    }
});
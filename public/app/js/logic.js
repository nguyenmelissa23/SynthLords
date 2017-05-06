//FRONT END JS

$(".led-red").on("click", function(){
    $(this).toggleClass("led-red-on");
    if (this.getAttribute("value") == "off"){
   this.setAttribute("value", "on");
   console.log("On: " + this);
    }
    else if (this.getAttribute("value") == "on"){
        this.setAttribute("value", "off");
        console.log("Off: " + this);
    }
});
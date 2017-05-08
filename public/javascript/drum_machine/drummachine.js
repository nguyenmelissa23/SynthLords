


















(function() {
    $(document).ready(function() {
        toffleOnOff();
    });
})();
    //FIXME: HOST WAV FILES ON A SERVER 
var drum;

function playDrumTrack(){   
    console.log("playing...")
    var drumLink = $("#drum-source").find(":selected").data("filename");
    console.log("drum track: ", drumLink);
    drum = new Wad({source: drumLink });
    drum.play();
    // var bell = new Wad({source : '../public/drum_tracks/ambient_120.wav'});
    // bell.play();
}

function stopDrumTrack(){
    console.log("stopping...");
    drum.stop();
    // bell.stop();
}

// drumSwitch();

// function drumSwitch(){
//     $("#drumSwitch").on("click", function(){
//         console.log(this.find("button"));
//     });
// }

// function getToggleData(){
//     $('#drumOnOff').on('change', function() {
//         var isChecked = $(this).is(':checked');
//         var selectedData;
//         var switchLabel = $('.switch-label');
//         console.log('isChecked: ' + isChecked); 

//         if(isChecked) {
//             selectedData = $switchLabel.attr('data-on');
//         } else {
//             selectedData = $switchLabel.attr('data-off');
//         }

//         console.log('Selected data: ' + selectedData);
//     });
// }

// TOGGLE
function toffleOnOff(){
    $("input[type=checkbox]").on("click",function(){
        var content = $('input:checked').css("content");
        console.log(content);
        var drumSwitch = checkSwitch(content);
        console.log(drumSwitch);
        switch(drumSwitch){
            case ("ON"):
                playDrumTrack();
                break;
            case ("OFF"):
                stopDrumTrack();
                break;
        }
    });
}

//Check swith is on or off
function checkSwitch(content){
    if (content === undefined){
        return "OFF";
    } else {
        return "ON";
    }
}
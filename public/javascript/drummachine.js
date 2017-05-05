(function() {
    $(document).ready(function() {
        //getToggleData();
        playDrumTrack();
    });
})();
    //FIXME: Get value from on and off button

function playDrumTrack(){
    $(".playDrum").on("click", function(){
        // var drumLink = $("#drum-source").find(":selected").data("filename");
        // console.log("drum track: ", drumLink);
        // var drum = new Wad({source: ("'" + drumLink + "'") });
        // drum.play();
        var bell = new Wad({source : 'http://www.myserver.com/audio/bell.wav'});
        bell.play();
        
    });

    $(".stopDrum").on("click", function(){
        drum.stop();
        bell.stop();
    });
}


function getToggleData(){
    $('#drumOnOff').on('change', function() {
        var isChecked = $(this).is(':checked');
        var selectedData;
        var switchLabel = $('.switch-label');
        console.log('isChecked: ' + isChecked); 

        if(isChecked) {
            selectedData = $switchLabel.attr('data-on');
        } else {
            selectedData = $switchLabel.attr('data-off');
        }

        console.log('Selected data: ' + selectedData);
    });
}
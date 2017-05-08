console.log("loading playDrumSounds.js");

//===========Links for sample drum sounds=========
// http://freewavesamples.com/

//Create an object with all properties for drum sounds:
var _isPlayingDS = false;
var sourceArrayDS=[];
var contextDS;
var currentSourceDS;
var bufferLoaderDS;
var bufferListDS;
var closed_hihat, open_hihat, kick, snare, tom;

//===Check browser support====
window.addEventListener('load', checkBrowserSupport, false);
function checkBrowserSupport() {
	console.log("checkBrowserSupport");
	try {
        // Fix up for prefixing
        window.Audiocontext = window.Audiocontext||window.webkitAudiocontext;
        contextDS = new AudioContext();
	}
	catch(e) {
	    alert('Web Audio API is not supported in this browser');
	}
}

//====LOADING BUFFER FILES============
window.onload = init;

function init() {
	console.log("window.init()");

	window.Audiocontext = window.Audiocontext || window.webkitAudiocontext;
    contextDS = new AudioContext();
	bufferListDS = [
		'https://s3.amazonaws.com/drumsounds/closed_hihat.wav',
        'https://s3.amazonaws.com/drumsounds/kick.wav',
        'https://s3.amazonaws.com/drumsounds/open_hihat.wav',
        'https://s3.amazonaws.com/drumsounds/snare.wav',
        'https://s3.amazonaws.com/drumsounds/tom.wav'
	];

	bufferLoaderDS = new BufferLoader(
	contextDS,
	bufferListDS,
	finishedLoading
	);

	bufferLoaderDS.load();
};

function finishedLoading (bufferListDS) {
  // Create two sources and play them both together
  	console.log("finishedLoading()");
    closed_hihat = contextDS.createBufferSource();
    kick = contextDS.createBufferSource();
    open_hihat = contextDS.createBufferSource();
    snare = contextDS.createBufferSource();
    tom = contextDS.createBufferSource();

	closed_hihat.buffer = bufferListDS[0];
    kick.buffer = bufferListDS[1];
    open_hihat.buffer = bufferListDS[2];
    snare.buffer = bufferListDS[3];
    tom.buffer = bufferListDS[4];

    pushSoundtoArray("Closed Hihat", closed_hihat);
    pushSoundtoArray("Kick", kick);
    pushSoundtoArray("Open Hihat", open_hihat);
    pushSoundtoArray("Snare", snare);
    pushSoundtoArray("Tom", tom);

    if (sourceArrayDS[0]){
		console.log("sourceArrayDS is not empty");
	} else console.log("sourceArrayDS is empty");

    console.log("sourceArrayDS", sourceArrayDS);

    createDrumSoundBtns();
};

//TODO: ======== KEY EVENTS =====================
$(".drumSoundBtns").on("click", ".drumBtn", function(){
    _isPlayingDS = $(this).attr("data-playing");
    if(_isPlayingDS === false){
        startSound(this);
    } else {
        stopSound(this);
    }
});



//============= FUNCTIONS ====================

//PLAYING/STOPING
function startSound(soundBtn){
    console.log("start sound....");
    console.log(soundBtn);
	var soundName = $(soundBtn).attr("data-btn-val");
    console.log(soundName);
    if (_isPlayingDS === false){
        for (var i = 0; i < sourceArray.length; i ++){
            if (sourceArray[i].name === soundName){
                currentSourceDS = sourceArrayDS[i].source;
                currentSourceDS.connect(contextDS.destination);
                currentSourceDS.start();
                _isPlayingDS = true;
            }
        }
    }
	console.log("_isPlayingDS", _isPlayingDS);
}

function stopSound(){
    console.log("stopTrack()");
	if (_isPlayingDS === true){
		currentSourceDS.stop(2);
		_isPlayingDS = false;
	}
	console.log("_isPlayingDS", _isPlayingDS);
}

//Others Functs
function pushSoundtoArray(soundName, buffer){
    var sourceObj = 
        {
			name: soundName,
			source: buffer
		};
    sourceArrayDS.push(sourceObj);
};

function createDrumSoundBtns(){
    console.log('createDrumSoundBtns');
    for (var i = 0; i < sourceArrayDS.length; i++){
        var currentDrumSound = sourceArrayDS[i];
        var htmlDSBtn  = "<div class='drumBtnDiv'>";
            htmlDSBtn +=  "<button data-btn-val='" + currentDrumSound.name +"' "; 
            htmlDSBtn += "data-playing='false' class='drumBtn btn btn-default'>";
            htmlDSBtn += currentDrumSound.name;
            htmlDSBtn += "</button> </div> <br>";
        //console.log(htmlDSBtn);
        $(".drumSoundBtns").append(htmlDSBtn);
    }
}
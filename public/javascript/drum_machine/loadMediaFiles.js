console.log("running loadMediaFiles.js");
//==========Links for codes======================
//https://www.html5rocks.com/en/tutorials/webaudio/intro/

// https://dev.opera.com/articles/drum-sounds-webaudio/

//=========== Links for Drum Tracks MP3 ===============
// http://audiosoundclips.com/audio-sound-clips-drums/


//===========Links for sample drum sounds=========
//http://freewavesamples.com/sample-type/cymbals/hi-hat

//===========Links for sample drum sounds=========
// http://freewavesamples.com/

var context;
var bufferLoader;
var bufferList;

var sourceArray = [];
var sourceArrayDS = [];
var _isPlaying = false;
var _isPlayingDS;
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
    
    //=======Drum Tracks ========
    context = new AudioContext();
    bufferList = [
		'https://s3.amazonaws.com/drumtracks/Drum1.mp3',
		'https://s3.amazonaws.com/drumtracks/Drum2.mp3', 
		'https://s3.amazonaws.com/drumtracks/Drum3.mp3',
		'https://s3.amazonaws.com/drumtracks/Drum4.mp3',
		'https://s3.amazonaws.com/drumtracks/Drum5.mp3',
		'https://s3.amazonaws.com/drumtracks/Drum6.mp3',
		'https://s3.amazonaws.com/drumtracks/Drum7.mp3',
		'https://s3.amazonaws.com/drumtracks/Drum8.mp3',
		'https://s3.amazonaws.com/drumtracks/Drum9.mp3',
		'https://s3.amazonaws.com/drumtracks/Drum10.mp3',
		'https://s3.amazonaws.com/drumtracks/Drum11.mp3',
		'https://s3.amazonaws.com/drumtracks/Drum12.mp3',
		'https://s3.amazonaws.com/drumtracks/Drum13.mp3',
		'https://s3.amazonaws.com/drumtracks/Drum14.mp3',
		'https://s3.amazonaws.com/drumtracks/Drum15.mp3', 
        'https://s3.amazonaws.com/drumsounds/closed_hihat.wav',
        'https://s3.amazonaws.com/drumsounds/kick.wav',
        'https://s3.amazonaws.com/drumsounds/open_hihat.wav',
        'https://s3.amazonaws.com/drumsounds/snare.wav',
        'https://s3.amazonaws.com/drumsounds/tom.wav'
	];
    bufferLoader = new BufferLoader(
	context,
	bufferList,
	finishedLoading
	);

    bufferLoader.load();

}


function finishedLoading(bufferList) {
  // Create two sources and play them both together
  	console.log("finishedLoading()");

    //===============Drum Tracks =======================
	for (var i = 0; i < 15; i++){
		var newSource = context.createBufferSource();
		newSource.buffer = bufferList[i];
		var trackNum = i+1;
		var sourceObj = {
			name: ("Drum" + trackNum), 
			source: newSource
		};
		sourceArray.push(sourceObj);
	}
    

    //===============Drum Sounds==========================
    closed_hihat = contextDS.createBufferSource();
    kick = contextDS.createBufferSource();
    open_hihat = contextDS.createBufferSource();
    snare = contextDS.createBufferSource();
    tom = contextDS.createBufferSource();

	closed_hihat.buffer = bufferList[15];
    kick.buffer = bufferList[16];
    open_hihat.buffer = bufferList[17];
    snare.buffer = bufferList[18];
    tom.buffer = bufferList[19];

    pushSoundtoArray("Closed Hihat", closed_hihat);
    pushSoundtoArray("Kick", kick);
    pushSoundtoArray("Open Hihat", open_hihat);
    pushSoundtoArray("Snare", snare);
    pushSoundtoArray("Tom", tom);

	console.log("sourceArray", sourceArray);
    console.log("sourceArrayDS", sourceArrayDS);
    createDrumSoundBtns();
    createOptionElement();
	// createOptionElement();
}

// ======FINISH LOADING ==================

// ======== START/STOP TRACKS=========================
//if change track, stop current and play the new one
$("#trackDropBar").on("input", function(){
	console.log("changing track to", $("#trackDropBar").val());
	if (_isPlaying === true){
		stopTrack();
		startTrack();
	}
});

$("#startTrack").on("click", function(){
	startTrack();
});

$("#stopTrack").on("click", function(){
	stopTrack();
});
//=======================================================




//==============TRACKS FUNCTIONS=====================
function startTrack(){
	console.log("_isPlaying", _isPlaying)
	var trackName = $("#trackDropBar").val();
	if (trackName === 0){
		alert("Pick a drum track to start playing");
		return;
	} else {
		if (_isPlaying === false){
			for (var i = 0; i < sourceArray.length; i ++){
				if (sourceArray[i].name === trackName){
					currentSource = sourceArray[i].source;
					currentSource.connect(context.destination);
					currentSource.loop = true;
					currentSource.start();
					_isPlaying = true;
				}
			}
		}
	}
	console.log("_isPlaying", _isPlaying);
}

function stopTrack(){
	console.log("stopTrack()");
	if (_isPlaying === true){
		currentSource.stop(2);
		_isPlaying = false;
	}
	console.log("_isPlaying", _isPlaying);
}
//==============================================


//======== DRUM SOUNDS KEY EVENTS =====================
$(".drumSoundBtns").on("click", ".drumBtn", function(){
    console.log("Click on sound button....");
    _isPlayingDS = $(this).attr("data-playing");
    
    if(_isPlayingDS === 'false'){
        startSound(this);
    } else if (_isPlayingDS === 'true') {
        stopSound(this);
    }
});

//TODO: Create key events



//============= DRUM SOUND FUNCTIONS ====================

//PLAYING/STOPING
function startSound(soundBtn){
    console.log("start sound....");
    console.log(soundBtn);
	var soundName = $(soundBtn).attr("data-btn-val");
    console.log(soundName);
    if (_isPlayingDS === 'false'){
        for (var i = 0; i < sourceArrayDS.length; i ++){
            if (sourceArrayDS[i].name === soundName){
                currentSourceDS = sourceArrayDS[i].source;
                currentSourceDS.connect(contextDS.destination);
                currentSourceDS.start();
                _isPlayingDS = "true";
            }
        }
    }
    $(soundBtn).attr("data-playing", _isPlayingDS);
	console.log("_isPlayingDS", _isPlayingDS);
}

function stopSound(soundBtn){
    _isPlayingDS = $(soundBtn).attr("data-playing");
    console.log("stopSound()");
	if (_isPlayingDS === 'true'){
		currentSourceDS.stop(2);
		_isPlayingDS = 'false';
	}
    $(soundBtn).attr("data-playing", _isPlayingDS)
	console.log("_isPlayingDS", _isPlayingDS);
}



// =====DYNAMICALLY GENERATED ELEMENTS
function createOptionElement(){
	console.log("createOptionElement");
	for ( var i = 0; i < sourceArray.length; i++){
		var optionHTML = "<option>"+ sourceArray[i].name +"</option>";
		//console.log(optionHTML);
		$("#trackDropBar").append(optionHTML);
	}
}

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
//=====================================================

//==========Helper functions ================
function pushSoundtoArray(soundName, buffer){
    var sourceObj = 
        {
			name: soundName,
			source: buffer
		};
    sourceArrayDS.push(sourceObj);
};
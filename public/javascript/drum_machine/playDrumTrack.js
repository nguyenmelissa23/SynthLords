console.log("loading tone_player.js");

//=========== Links for Drum MP3 ===============
// http://audiosoundclips.com/audio-sound-clips-drums/

var context;
var _isPlaying=false;
var currentSource;

window.addEventListener('load', checkBrowserSupport, false);
function checkBrowserSupport() {
	console.log("checkBrowserSupport");
	try {
	// Fix up for prefixing
	window.AudioContext = window.AudioContext||window.webkitAudioContext;
	context = new AudioContext();
	}
	catch(e) {
	alert('Web Audio API is not supported in this browser');
	}
}


//====LOADING BUFFER FILES============
window.onload = init;
var context;
var bufferLoader;
var bufferList;
var sourceArray = [];

function init() {
	console.log("window.init()");
  // Fix up prefixing
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
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
		'https://s3.amazonaws.com/drumtracks/Drum15.mp3'
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
	for (var i = 0; i < bufferList.length; i++){
		var newSource = context.createBufferSource();
		newSource.buffer = bufferList[i];
		var trackNum = i+1;
		var sourceObj = {
			name: ("Drum" + trackNum), 
			source: newSource
		};
		sourceArray.push(sourceObj);
	}
	if (sourceArray[0]){
		console.log("sourceArray is not empty");
	} else console.log("sourceArray is empty");
	createOptionElement();
}
//===================finished loading================


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
	if (_isPlaying == true){
		currentSource.stop(2);
		_isPlaying = false;
	}
	console.log("_isPlaying", _isPlaying);
}

// Append option elements from the sourceArray:
function createOptionElement(){
	console.log("createOptionElement");
	// for (var i = 0; i < bufferList.length; i++){
	// 	var newSource = context.createBufferSource();
	// 	newSource.buffer = bufferList[i];
	// 	var trackNum = i+1;
	// 	var sourceObj = {
	// 		name: ("Drum" + trackNum), 
	// 		source: newSource
	// 	};
	// 	sourceArray.push(sourceObj);
	// }
	for ( var i = 0; i < sourceArray.length; i++){
		var optionHTML = "<option>"+ sourceArray[i].name +"</option>";
		//console.log(optionHTML);
		$("#trackDropBar").append(optionHTML);
	}
}
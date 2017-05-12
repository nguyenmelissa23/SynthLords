

/**
 * sampleArray contains all links of sounds and tracks - use for the buffer-loader
 * samples contains all links of sounds and tracks in Obj - easier to find specific sounds
 */
var sampleArray=[];
var samples = {};

/**
 * sourceArr, sourceObj, sampleId contain only SOUNDS
 */
var sampleId = [ 'closed_hihat','open_hihat', 'kick', 'snare','tom'];
var sourceArr = [], sourceObj = {};
var currentSource, currentSampleId;

/**
 * sourceArr_Track , sourceObj_Track, sampleId_Track contain only TRACKS
 */
var sampleId_Track = ['Drum1', 'Drum2', 'Drum3', 'Drum4', 'Drum5', 'Drum6', 'Drum7', 'Drum8', 'Drum9', 'Drum10', 'Drum11', 'Drum12', 'Drum13', 'Drum14', 'Drum15'];
var sourceObj_Track = {}; sourceArr_Track = [];
var currentSource_Track, currentSampleId_Track;

var list = [ 'Closed Hihat', 'Open Hihat', 'Kick', 'Snare','Tom']
var pressedBtn;
var _isPlaying = false;
var currentVol;

//user can playing as many times 
// without reloading the whole page, just the files
var allowedStart = 1;

var audioContext = new AudioContext();
var analyser = audioContext.createAnalyser();
var analyser_Track = audioContext.createAnalyser();
var gainNode = audioContext.createGain();
var App = {
    
    _checkBrowserSupport: function(){
        //console.log("check Browser Support");
        try {
            // Fix up for prefixing
            window.Audiocontext = window.Audiocontext||window.webkitAudiocontext;
            var cxt = new AudioContext();
        }
        catch(e) {
             console.error('Web Audio API is not supported in this browser');
        } 
        this._sampleObjArr();
    }, 

    _sampleObjArr: function(){
        sampleId.forEach(function(id){
            samples[id] = 'https://s3.amazonaws.com/drumsounds/' + id + '.wav';
            sampleArray.push(samples[id]);
        });
        sampleId_Track.forEach(function(id){
            samples[id] = 'https://s3.amazonaws.com/drumsounds/' + id + '.mp3';
            sampleArray.push(samples[id]);
        });
        //console.log("sampleArray", sampleArray);
        this._loadFiles(audioContext, finishedLoading);
    }, 

    _loadFiles: function(context, callback){
        allowedStart = 1; 
        //console.log("reload files, ok to play. allowedStart:", allowedStart);
        bufferLoader = new BufferLoader(
            context,
            sampleArray, 
            callback
        );

        bufferLoader.load();
    }
};


// var drumSound = new DrumSound(audioContext, samples , sampleArray, sampleId);


window.onload = App._checkBrowserSupport();


function finishedLoading(sampleArray){
    sourceObj = {}; sourceArr = []; sourceObj_Track={};

    for (var i = 0; i < sampleArray.length; i++){
        var source = audioContext.createBufferSource();
        source.buffer = sampleArray[i];
        sourceArr.push(source);
    };

    sourceObj_Track = {}; sourceArr_Track = [];

    //console.log("sourceArr", sourceArr);
    sourceObj ={
        'closed_hihat'  : sourceArr[0], 
        'open_hihat'    : sourceArr[1], 
        'kick'          : sourceArr[2],
        'snare'         : sourceArr[3],
        'tom'           : sourceArr[4]
    };
    sourceObj_Track = {
        'Drum1'        : sourceArr[5],
        'Drum2'        : sourceArr[6],
        'Drum3'        : sourceArr[7],
        'Drum4'        : sourceArr[8],
        'Drum5'        : sourceArr[9],
        'Drum6'        : sourceArr[10],
        'Drum7'        : sourceArr[11],
        'Drum8'        : sourceArr[12],
        'Drum9'        : sourceArr[13],
        'Drum10'       : sourceArr[14],
        'Drum11'       : sourceArr[15],
        'Drum12'       : sourceArr[16],
        'Drum13'       : sourceArr[17],
        'Drum14'       : sourceArr[18],
        'Drum15'       : sourceArr[19],
    }
    ////console.log(sourceObj);
//    if (sourceObj.length && sourceObj_Track.length){
        _createOptionElement();
        _createDrumSoundBtns();
//    }
    
}

$(document).on("keydown", function(keyEvent){
    switch(keyEvent.keyCode){
        case 52: $("#closed_hihat").addClass("drumlit");  startDrum('closed_hihat'); break;
        case 53: $('#open_hihat').addClass("drumlit");    startDrum('open_hihat'); break;
        case 54: $('#kick').addClass("drumlit");          startDrum('kick'); break;
        case 55: $('#snare').addClass("drumlit");         startDrum('snare'); break;
        case 56: $('#tom').addClass("drumlit");           startDrum('tom'); break;
        default: //console.log("Press key 4, 5, 6, 7, 8 to start playing.");
    }
   
});

$(document).on("keyup", function(keyEvent){
    //console.log(keyEvent.keyCode);
    switch(keyEvent.keyCode ){
        case 52: $("#closed_hihat").removeClass("drumlit");  stopDrum('closed_hihat'); break;
        case 53: $('#open_hihat').removeClass("drumlit");    stopDrum('open_hihat'); break;
        case 54: $('#kick').removeClass("drumlit");          stopDrum('kick'); break;
        case 55: $('#snare').removeClass("drumlit");         stopDrum('snare'); break;
        case 56: $('#tom').removeClass("drumlit");           stopDrum('tom'); break;
    } 
});

function startDrum(id){
    // pressedBtn.addClass("drumlit");
    currentSource = sourceObj[id];
    currentSource.connect(audioContext.destination);
    currentSource.start();
     
}

function stopDrum(){
    currentSource.stop(3);
    App._loadFiles(audioContext, finishedLoading);
    pressedBtn.removeClass("drumlit");
}

function _createOptionElement(){
    $("#trackDropBar").html("");
    //console.log("createOptionElement()");
    var placeholder = "<option id='drumTrackplaceholder' disabled selected='selected' class='drumTrack'>Select a drum track to start</option>";
    $("#trackDropBar").append(placeholder);
    for (var i = 0; i < sampleId_Track.length; i++){
        var optionHTML = "<option id='"+ sampleId_Track[i] +"' class='drumTrack'>" + sampleId_Track[i] + "</option>";
        $("#trackDropBar").append(optionHTML);
    }
}

function _afterloading_createOptionElement(currentTrack){
    $("#trackDropBar").html("");
    //console.log("createOptionElement()");
    var placeholder = "<option id='drumTrackplaceholder' disabled class='drumTrack'>Select a drum track to start</option>";
    $("#trackDropBar").append(placeholder);
    for (var i = 0; i < sampleId_Track.length; i++){
        var optionHTML;
        if (sampleId_Track[i] === currentTrack){
            optionHTML = "<option id='"+ sampleId_Track[i] +"' selected='selected' class='drumTrack'>" + sampleId_Track[i] + "</option>";
        } else {
            optionHTML = "<option id='"+ sampleId_Track[i] +"' class='drumTrack'>" + sampleId_Track[i] + "</option>";
        }
        $("#trackDropBar").append(optionHTML);
    }
}

function _createDrumSoundBtns(){
     $(".drumSoundBtns").html("");
    //console.log('createDrumSoundBtns()');
    for (var i = 0; i < sampleId.length; i++){
        //console.log("sound in sourceObj", sampleId[i]);
        var buttonHTML  = "<div class='drumBtnDiv'>";
            buttonHTML += "<button id='" + sampleId[i] + "'";
            buttonHTML += "class='drumBtn btn btn-default'>";
            buttonHTML += list[i] + "</button></div><br>";
        //console.log("buttonHTML",buttonHTML);
        $(".drumSoundBtns").append(buttonHTML);
    }
}

/**
 * 
 * START TRACKS 
 * 
*/ 

$("#startTrack").on("click", function(){
    if (allowedStart === 1){
        startTrack();
    } else {
        App._loadFiles(audioContext, finishedLoading);
    }
});

$("#stopTrack").on("click", function(){
	stopTrack();
    if (allowedStart < 1){
        App._loadFiles(audioContext, finishedLoading);
    }
});

$("#trackDropBar").on("input", function(){
	//console.log("changing track to", $("#trackDropBar").val());
	if (_isPlaying === true){
		stopTrack();
		startTrack();
    } else {
        // startTrack();
    }
});

$("#drum-track-gain").change(function(){
    //console.log("changing the gain of drum");
    if (_isPlaying === true){
        stopTrack();
        //Set drum info to localStorage 
        localStorage.setItem("drumTrack", JSON.stringify
                        ({
                            'name': $("#trackDropBar").val(),
                            'source': currentSource_Track, 
                            'gain': $("#drum-track-gain").val(), 
                            '_isPlaying': true
                        }));
        App._loadFiles(audioContext, finishedLoading);
        //Get drum info
        var drum = localStorage.getItem("drumTrack");
        drum = JSON.parse(drum);
        //FIXME: remember and select the drum track again: 
        _afterloading_createOptionElement(drum.name);
        drum.source.connect(audioContext.destination);
        drum.source.gain.value = drum.gain;
        drum.source.loop = true;
        _isPlaying = drum._isPlaying;
        startTrack();
    } else {
        localStorage.setItem("drumTrack", JSON.stringify
                        ({
                            'name': $("#trackDropBar").val(),
                            'source': currentSource_Track, 
                            'gain': $("#drum-track-gain").val(), 
                            '_isPlaying': true
                        }));
        App._loadFiles(audioContext, finishedLoading);
        //Get drum info
        var drum = localStorage.getItem("drumTrack");
        drum = JSON.parse(drum);
        //FIXME: remember and select the drum track again: 
        _afterloading_createOptionElement(drum.name);
        drum.source.connect(drum.source.destination);
        drum.source.gain.value = drum.gain;
        drum.source.loop = true;
        _isPlaying = drum._isPlaying;
    }
    //console.log("_isPlaying", _isPlaying);    
});

function startTrack(){
    allowedStart--; 
    //console.log("_isPlaying", _isPlaying);
    var trackName = $("#trackDropBar").val();
    if (trackName == 'Select a drum track to start'){
        alert("Pick a drum track to start playing");
        return;
    } 
    if (_isPlaying === false){
        sampleId_Track.forEach(function(name){
            if ( name == trackName){
                currentSource_Track = sourceObj_Track[name];
                currentSource_Track.loop = true;
                currentSource_Track.connect(gainNode);
                gainNode.connect(audioContext.destination);
                gainNode.gain.value = $("#drum-track-gain").val();
                currentSource_Track.start();
                _isPlaying = true;
                startVis();
            }
        });
    } 
    //console.log("_isPlaying", _isPlaying);
    
}

// else {allowedStart++};
// //Error management: 
// if (allowedStart === 1){App._loadFiles(audioContext, finishedLoading);}

function stopTrack(){
    // //console.log("_isPlaying", _isPlaying);
    if (_isPlaying === true ){
        currentSource_Track.stop(2);
        _isPlaying = false;
    } 
    //console.log("_isPlaying", _isPlaying);
}
/**** VISUALIZER ***
 * 
 * Tracks
*/

var WIDTH = 640;
var HEIGHT = 100;
var canvas = document.querySelector('#myCanvas');
var myCanvas = canvas.getContext("2d");
var dataArray, bufferLength;
var dataArray_Track, bufferLength_Track;

// startVis(currentSource_Track, analyser_Track, dataArray_Track, bufferLength_Track);
// startVis(currentSource, analyser, dataArray, bufferLength);
// startVis(dataArrayDS, bufferLengthDS, currentSourceDS);
startVis();

// function startVis(source, analyser, dataArray, bufferLength){
function startVis(){
	// if ( source != undefined){
    if (currentSource_Track != undefined){
		myCanvas.clearRect(0, 0, WIDTH, HEIGHT);
		// source.connect(analyser);
        currentSource_Track.connect(analyser_Track);
        // analyser.fftSize = 2048;
		analyser_Track.fftSize = 2048;
		bufferLength = analyser.frequencyBinCount; //an unsigned long value half that of the FFT size. This generally equates to the number of data values you will have to play with for the visualization
		dataArray = new Uint8Array(bufferLength);

		// draw(source, analyser, dataArray, bufferLength);
        draw();
	} else {
		//console.log("no current source yet");
	}
}

// function draw(source, analyser, dataArray, bufferLength){
function draw(){
	var drawVisual = requestAnimationFrame(draw);
	analyser_Track.getByteTimeDomainData(dataArray);

	myCanvas.fillStyle = 'rgb(0, 0, 0)';
	myCanvas.fillRect(0, 0, WIDTH, HEIGHT);
	myCanvas.lineWidth = 2;
	myCanvas.strokeStyle = 'rgb(0, 255, 0)';

	myCanvas.beginPath();
	var sliceWidth = WIDTH * 1.0 / bufferLength;
	var x = 0;

	for (var i = 0; i < bufferLength; i++) {

		var v = dataArray[i] / 128.0;
		var y = v * HEIGHT / 2;

		if (i === 0) {
			myCanvas.moveTo(x, y);
		} else {
			myCanvas.lineTo(x, y);
		}

		x += sliceWidth;
	}
	myCanvas.stroke();
}

/**** VISUALIZER ***
 * 
 * Sounds
*/

// var WIDTH = 640;
// var HEIGHT = 100;
// var canvas = document.querySelector('#myCanvas');
// var myCanvas = canvas.getContext("2d");
// var dataArray, bufferLength;
// var dataArray_Track, bufferLength_Track;

// // startVis(currentSource_Track, analyser_Track, dataArray_Track, bufferLength_Track);
// // startVis(currentSource, analyser, dataArray, bufferLength);
// // startVis(dataArrayDS, bufferLengthDS, currentSourceDS);
// startVis();

// // function startVis(source, analyser, dataArray, bufferLength){
// function startVis(){
// 	// if ( source != undefined){
//     if (currentSource_Track != undefined){
// 		myCanvas.clearRect(0, 0, WIDTH, HEIGHT);
// 		// source.connect(analyser);
//         currentSource_Track.connect(analyser_Track);
//         // analyser.fftSize = 2048;
// 		analyser_Track.fftSize = 2048;
// 		bufferLength = analyser.frequencyBinCount; //an unsigned long value half that of the FFT size. This generally equates to the number of data values you will have to play with for the visualization
// 		dataArray = new Uint8Array(bufferLength);

// 		// draw(source, analyser, dataArray, bufferLength);
//         draw();
// 	} else {
// 		//console.log("no current source yet");
// 	}
// }

// // function draw(source, analyser, dataArray, bufferLength){
// function draw(){
// 	var drawVisual = requestAnimationFrame(draw);
// 	analyser_Track.getByteTimeDomainData(dataArray);

// 	myCanvas.fillStyle = 'rgb(0, 0, 0)';
// 	myCanvas.fillRect(0, 0, WIDTH, HEIGHT);
// 	myCanvas.lineWidth = 2;
// 	myCanvas.strokeStyle = 'rgb(0, 255, 0)';

// 	myCanvas.beginPath();
// 	var sliceWidth = WIDTH * 1.0 / bufferLength;
// 	var x = 0;

// 	for (var i = 0; i < bufferLength; i++) {

// 		var v = dataArray[i] / 128.0;
// 		var y = v * HEIGHT / 2;

// 		if (i === 0) {
// 			myCanvas.moveTo(x, y);
// 		} else {
// 			myCanvas.lineTo(x, y);
// 		}

// 		x += sliceWidth;
// 	}
// 	myCanvas.stroke();
// }
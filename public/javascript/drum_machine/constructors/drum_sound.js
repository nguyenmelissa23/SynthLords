// https://dev.opera.com/articles/drum-sounds-webaudio/

console.log("loading drum_sound.js");

// ================= KICK ==================== 
function Kick(context){
	this.context = context;
}

Kick.prototype.setup = function(){
	this.osc = this.context.createOscillator();
	this.gain = this.context.createGain();
	this.osc.connect(this.gain);
	this.gain.connect(this.context.destination);
};

Kick.prototype.trigger = function(time) {
  this.setup();

  this.osc.frequency.setValueAtTime(150, time);
  this.gain.gain.setValueAtTime(1, time);

  this.osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
  this.gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

  this.osc.start(time);

  this.osc.stop(time + 0.5);
};



// ============== SNARE ================================

function Snare(context){
	this.context = context;
}

Snare.prototype.setup = function(){
	//CREATE BUFFER SOURCE - NOISE
	this.noise = this.context.createBufferSource();
	this.noise.buffer = this.noiseBuffer();
	
	//CREATE BIQUAD - FILTER 
	var noiseFilter = this.context.createBiquadFilter();
	noiseFilter.type = 'highpass';
	//take out noise below 1000 Hz 
	noiseFilter.frequency.value = 1000;
	this.noise.connect(noiseFilter);

	//CREATE GAIN - VOLUME
	this.noiseEnvelope = this.context.createGain();
	//connect the noise filter with the noise envelope 
	noiseFilter.connect(this.noiseEnvelope);
	
	//CONNECT NOISE ENVELOPE TO SPEAKER
	this.noiseEnvelope.connect(this.context.destination);

	//OSCILLATOR? --- THE FREQ OF THE DRUM? 
	this.osc = this.context.createOscillator();
	this.osc.type = 'triangle';

	//CREATE GAIN FOR OSC
	this.oscEnvelope = this.context.createGain();
	this.osc.connect(this.oscEnvelope);
	this.oscEnvelope.connect(this.context.destination);
};


//SNARE NOISE BUFFER
Snare.prototype.noiseBuffer = function(){
	var bufferSize = this.context.sampleRate;
	var buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
	var output = buffer.getChannelData(0);
	
	for (var i = 0; i < bufferSize; i++){
		output[i] = Math.random() * 2 - 1; 
	}

	return buffer;
};


Snare.prototype.trigger = function(time){
	this.setup();

	// set value equal 1 at time 'time'
	this.noiseEnvelope.gain.setValueAtTime(1,time);
	//decrease or increase to value of 0.01 at "time + 0.2"
	this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time  + 0.2);
	this.buffer.start(time);

	this.osc.stop(time + 0.2);
	this.buffer.stop(time + 0.2)
}; 


//======== HIHAT ===================

function HiHat(context, buffer){
	this.context = context; 
	this.buffer = buffer; 
}

//CREATE BUFFER SOURCE and CONNECTION
HiHat.prototype.setup = function(){
	this.source = this.context.createBufferSource();
	this.source.buffer = this.buffer;
	this.source.connect(this.connect.destination);
};

HiHat.prototype.trigger = function(time){
	this.setup();
	
	this.source.start(time);
}; 


//================SAMPLE LOADER ======================
var sampleLoader = function(url, context, callback){
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	request.onload = function(){
		context.decodeAudioData(request.response, function(buffer){
			window.buffer = buffer;
			callback();
		});
	};
	request.send();
};

//=========CREATE AUDIO CONTEXT =========
var context = new AudioContext();

var setup = function(){
	var kick = new Kick(context);
	var snare = new Snare(context);
	var hihat = new HiHat(context, window.buffer);

	Tone.Transport.bpm.value = 120;

	Tone.Transport.scheduleRepeat(function(time){kick.trigger(time);}, "4n");
	Tone.Transport.scheduleRepeat(function(time){snare.trigger(time);}, "2n");
	Tone.Transport.scheduleRepeat(function(time){snare.trigger(time);}, "8t");

	//$("#play").removeClass('pure-button-disabled');
};

$("#stopDrum").on("click", function() {
	console.log("Stop...");
  if (window.playing == true) {
	window.playing = false;
	Tone.Transport.stop();
  }
});

$("#playDrum").on("click", function() {
	console.log("Play....")
  if (window.playing == false) {
	window.playing = true;
	Tone.Transport.start();
  }
});

window.playing = false;
sampleLoader('https://s3.amazonaws.com/drumsounds/open_hihat.wav', context, setup);
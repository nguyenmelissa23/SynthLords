// https://dev.opera.com/articles/drum-sounds-webaudio/


var context = new AudioContext;
// console.log(context.sampleRate);
// console.log(context.destination.channelCount);

// var oscillator = context.createOscillator();
// oscillator.frequency = 261.6;

// oscillator.connect(context.destination);

// oscillator.start(0);

// var oscillator = context.createOscillator();
// oscillator.frequency=150;

// var gain = context.createGain();

// oscillator.connect(gain);
// gain.connect(context.destination);

// var now = context.currentTime;

// gain.gain.setValueAtTime(1,now);
// gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

// oscillator.start(now);
// oscillator.stop(now + 0.5);

// oscillator.frequency.setValueAtTime(150, now);

// oscillator.frequency.exponentialRampToValueAtTime(0.001, now + 0.5);


// KICK 
function Kick(context){
    this.context = context;
}

Kick.prototype.setup = function(){
    this.osc = this.context.createOscillator();
    this.gain = this.context.createGain();
    this.osc.connect(this.gain);
    this.gain.connect(this.context.destination)
};

Kick.prototype.trigger = function(time){
    this.setup();
    
    this.osc.frequency.setValueAtTime(150, time); 
    this.gain.gain.setValueAtTime(1, time);

    this.osc.frequency.exponentialRampToValueAtTime(0.01, time+0.5);
    this.gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

    this.osc.start(time);
    
    this.osc.stop(time + 0.5);
};

var kick = new Kick(context);
var now = context.currentTime;
kick.trigger(now);
kick.trigger(now + 0.5);
kick.trigger(now + 1);



//SNARE

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
    this.noiseBuffer.start(time);

    this.osc.stop(time + 0.2);
    this.noiseBuffer.stop(time + 0.2)
}; 


// HIHAT

function HiHat(context, buffer){
    
}
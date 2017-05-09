// Create the Audio Context

var context = new AudioContext();
var analyser = context.createAnalyser();
var WIDTH = 640;
var HEIGHT = 100;

// Create your oscillator, filter and gain node by declaring them as variables

var osc = context.createOscillator();

// osc.frequency.value = 500;

// Connect the nodes together

function makeConnection() {
    osc.connect(analyser);
}

// Play the sound inside of Chrome

function playSound() {
    var osc = context.createOscillator();
    osc.frequency.value = $("#frequencySlider").val();
    console.log(osc.frequency.value);
    osc.type = $("#waveform").val().toLowerCase();
    

    oscGain = context.createGain();
    oscGain.gain.value = 0.2;

    osc.start(context.currentTime);
    osc.stop(context.currentTime + 3);

    osc.connect(oscGain);   
    oscGain.connect(analyser); /*Connect oscillator to analyser node*/
    analyser.connect(context.destination);
}




var canvas = document.querySelector('#myCanvas');
var myCanvas = canvas.getContext("2d");

analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount; //an unsigned long value half that of the FFT size. This generally equates to the number of data values you will have to play with for the visualization
// var bufferLength = 2000;
var dataArray = new Uint8Array(bufferLength);

// analyser.getByteTimeDomainData(dataArray); 

console.log(dataArray);

myCanvas.clearRect(0, 0, WIDTH, HEIGHT);

function draw() {
  drawVisual = requestAnimationFrame(draw);
  analyser.getByteTimeDomainData(dataArray);
  
  myCanvas.fillStyle = 'rgb(0, 0, 0)';
  myCanvas.fillRect(0, 0, WIDTH, HEIGHT);
  myCanvas.lineWidth = 2;
      myCanvas.strokeStyle = 'rgb(0, 255, 0)';

      myCanvas.beginPath();
  var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;
  
  for(var i = 0; i < bufferLength; i++) {
   
        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;

        if(i === 0) {
          myCanvas.moveTo(x, y);
        } else {
          myCanvas.lineTo(x, y);
        }

        x += sliceWidth;
      };
  
//   myCanvas.lineTo(canvas.width, canvas.height/2);
      myCanvas.stroke();
    }
    

$("#playSound").on("click", function(){
makeConnection();
playSound();
});

draw();

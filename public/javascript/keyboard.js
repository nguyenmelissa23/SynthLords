/**
 * @file creates a keyboard that creates a PolyWad with the synth's current settings whenever a key is pressed down.
 * The PolyWad is stopped when the key is released.
 * 
 * TODO:
 * --- Must Have ---
 * Upload to hosting service with database (heroku/cleardb).
 * CSS.
 * Store presets in MYSQL database.
 * Drum Machine.
 * Remove unused settings in html (eg: interval).
 * 
 * --- Nice To Have ---
 * Record and download tracks.
 * Upload your own audio files to play in drum machine.
 * Arpeggiator.
 * Tuna Convolver.
 */

// localStorage.clear();
//if first time page is loaded then use default settings
var settings = localStorage.getItem("settings");
if (!settings) {
    console.log("First time loading page - loading default settings");
    //Initialize wadContainer
    var defaultSettings = getSettings();
    var wadContainer = createWadContainers(defaultSettings);
    //store settings in local storage
    localStorage.setItem("settings", JSON.stringify(defaultSettings));
}
//if settings saved in local storage then use those
else {
    console.log("Using settings from localstorage");
    var storedSettings = localStorage.getItem("settings");
    storedSettings = JSON.parse(storedSettings);
    var wadContainer = createWadContainers(storedSettings);
    //TODO: update html corresponding to stored settings
    updateHtml(storedSettings);
}

//creates the keyboard that is displayed in the html
var keyboard = new QwertyHancock({
    id: 'keyboard',
    width: 1873,
    height: 350,
    octaves: 2,
    startNote: 'C3',
    whiteNotesColour: 'white',
    blackNotesColour: 'black',
    hoverColour: '#f3e939'
});

//execute when piano key is pressed
keyboard.keyDown = function (note, frequency) {
    //Adjust the current note to the octave setting
    var keyboardNoteOctave = parseInt(note[note.length - 1]);
    var adjustedOctave = (octaveSetting + keyboardNoteOctave).toString();
    var currentNote = note.replace(/.$/, adjustedOctave);
    //play WAD corresponding to note
    var myWad = getWadStart();
    myWad.note = note;
    myWad.inUse = true;
    // console.log(myWad.obj);
    myWad.obj.play({ pitch: currentNote });
};

//Stop playing note when key is released
keyboard.keyUp = function (note, frequency) {
    //find the WAD that's in use with the given note
    var myWad = getWadStop(note);
    myWad.obj.stop();
    myWad.note = null;
    myWad.inUse = false;
};

/** return a WAD that is not being used */
function getWadStart() {
    for (var i in wadContainer) {
        if (wadContainer[i].inUse === false) {
            return wadContainer[i];
        }
    }
    return "Error: Can only press 6 keys at once";
}

/**
 * Return the WAD with the given note
 * @param note - identifies the WAD we're trying to find
 */
function getWadStop(note) {
    for (var i in wadContainer) {
        if (wadContainer[i].note === note) {
            return wadContainer[i];
        }
    }
}

/**
 * Creates an object to store 6 wadContainer initialized with the default settings.
 * This allows us to only play 6 notes at once since the WAD objects consume
 * a large amount of processing power.
 */
function createWadContainers(settings) {
    var wadContainer = {
        one: {
            note: null,
            obj: null,
            inUse: false
        },
        two: {
            note: null,
            obj: null,
            inUse: false
        },
        three: {
            note: null,
            obj: null,
            inUse: false
        },
        four: {
            note: null,
            obj: null,
            inUse: false
        },
        five: {
            note: null,
            obj: null,
            inUse: false
        },
        six: {
            note: null,
            obj: null,
            inUse: false
        }
    };
    // var initialSettings = getSettings();
    for (var property in wadContainer) {
        if (wadContainer.hasOwnProperty(property)) {
            var osc1 = new Wad(settings.osc1Settings);
            var osc2 = new Wad(settings.osc2Settings);
            //combine the oscillators
            var doubleOsc = new Wad.Poly(settings.masterSettings);
            //set master volume
            doubleOsc.setVolume(parseFloat(settings.volume));
            doubleOsc.add(osc1).add(osc2);

            wadContainer[property].obj = doubleOsc;
        }
    }
    console.log("Finished loading page.");
    return wadContainer;
}

/** Get the settings from the index.html elements */
function getSettings() {
    var result = {
        volume: parseFloat($("#master-volume").val()),
        octave: parseInt($("#octave").val()),
        osc1Settings: {
            source: $("#osc1-source").val().toLowerCase(),
            volume: $("#osc1-volume").val().toLowerCase(),   // Peak volume can range from 0 to an arbitrarily high number, but you probably shouldn't set it higher than 1.
            detune: parseFloat($("#osc1-detune").val()),     // Set a default detune on the constructor if you don't want to set detune on play(). Detune is measured in cents. 100 cents is equal to 1 semitone.
        },

        osc2Settings: {
            source: $("#osc2-source").val().toLowerCase(),
            volume: $("#osc2-volume").val().toLowerCase(),   // Peak volume can range from 0 to an arbitrarily high number, but you probably shouldn't set it higher than 1.
            detune: parseFloat($("#osc2-detune").val()),     // Set a default detune on the constructor if you don't want to set detune on play(). Detune is measured in cents. 100 cents is equal to 1 semitone.
        },

        masterSettings: {
            delay: {
                delayTime: parseFloat($("#delay-rate").val()),  // Time in seconds between each delayed playback.
                wet: parseFloat($("#delay-wet").val()), // Relative volume change between the original sound and the first delayed playback.
                feedback: parseFloat($("#delay-feedback").val()), // Relative volume change between each delayed playback and the next. 
            },
            tuna: {
                Filter: {
                    frequency: parseFloat($("#filter-frequency").val()), //20 to 22050
                    Q: parseFloat($("#filter-q").val()), //0.001 to 100
                    gain: parseFloat($("#filter-gain").val()), //-40 to 40 (in decibels)
                    filterType: $("#filter-type").val().toLowerCase(), //lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
                    bypass: parseInt($("#filter-bypass").val())
                },
                Chorus: {
                    rate: parseFloat($("#chorus-rate").val()),         //0.01 to 8+
                    feedback: parseFloat($("#chorus-feedback").val()),     //0 to 1+
                    delay: parseFloat($("#chorus-delay").val()),     //0 to 1
                    bypass: parseInt($("#chorus-bypass").val())         //the value 1 starts the effect as bypassed, 0 or 1
                },
                Phaser: {
                    rate: parseFloat($("#phaser-rate").val()), //0.01 to 8 is a decent range, but higher values are possible
                    depth: parseFloat($("#phaser-depth").val()), //0 to 1
                    feedback: parseFloat($("#phaser-feedback").val()), //0 to 1+
                    stereoPhase: 30, //0 to 180
                    baseModulationFrequency: 700, //500 to 1500
                    bypass: parseInt($("#phaser-bypass").val())
                },
                Overdrive: {
                    outputGain: 1, //0 to 1+
                    drive: 1, //0 to 1
                    curveAmount: parseFloat($("#master-drive").val()), //0 to 1
                    algorithmIndex: 0, //0 to 5, selects one of our drive algorithms
                    bypass: 0
                },
                Tremolo: {
                    intensity: parseFloat($("#tremolo-intensity").val()), //0 to 1
                    rate: parseFloat($("#tremolo-rate").val()), //0.001 to 8
                    stereoPhase: parseFloat($("#tremolo-phase").val()), //0 to 180
                    bypass: parseInt($("#tremolo-bypass").val())
                },
                Bitcrusher: {
                    bits: parseFloat($("#bitcrusher-bits").val()),          //1 to 16
                    normfreq: parseFloat($("#bitcrusher-normfreq").val()),    //0 to 1
                    bufferSize: 256,  //256 to 16384
                    bypass: parseInt($("#bitcrusher-bypass").val())
                }
                //FIXME: Error loading impulse
                //     Convolver: {
                //     highCut: parseFloat($("#convolver-high").val()), //20 to 22050
                //     lowCut: parseFloat($("#convolver-low").val()), //20 to 22050
                //     dryLevel: parseFloat($("#convolver-dry").val()), //0 to 1+
                //     wetLevel: parseFloat($("#convolver-wet").val()), //0 to 1+
                //     level: parseFloat($("#convolver-level").val()), //0 to 1+, adjusts total output of both wet and dry
                //     impulse: "http://www.openairlib.net/sites/default/files/auralization/data/olivermcintyre/tvisongur-sound-sculpture-iceland-model/stereo/source1domefareceiver2domelabinaural.wav", //the path to your impulse response
                //     bypass: parseInt($("#convolver-bypass").val())
                // }
            }
        }
    };
    return result;
}

/**
 * Updates the html synth setting elements to reflect the given settings.
 * Called when the page loads with stored settings
 * @param settings - the settings that the html will reflect
 */
function updateHtml(settings) {
    $("#master-volume").val(settings.volume);
    $("#octave").val(settings.octave);

    //osc1
    $("#osc1-source").val(settings.osc1Settings.source);
    $("#osc1-volume").val(settings.osc1Settings.volume);
    $("#osc1-detune").val(settings.osc1Settings.detune);

    //osc2
    $("#osc2-source").val(settings.osc2Settings.source);
    $("#osc2-volume").val(settings.osc2Settings.volume);
    $("#osc2-detune").val(settings.osc2Settings.detune);

    //delay
    $("#delay-rate").val(settings.masterSettings.delay.delayTime);
    $("#delay-wet").val(settings.masterSettings.delay.wet);
    $("#delay-feedback").val(settings.masterSettings.delay.feedback);

    //TUNA
    //filter
    $("#filter-frequency").val(settings.masterSettings.tuna.Filter.frequency);
    $("#filter-q").val(settings.masterSettings.tuna.Filter.Q);
    $("#filter-gain").val(settings.masterSettings.tuna.Filter.gain);
    $("#filter-type").val(settings.masterSettings.tuna.Filter.filterType);
    $("#filter-bypass").val(settings.masterSettings.tuna.Filter.bypass);
    //chorus
    $("#chorus-rate").val(settings.masterSettings.tuna.Chorus.rate);
    $("#chorus-feedback").val(settings.masterSettings.tuna.Chorus.feedback);
    $("#chorus-delay").val(settings.masterSettings.tuna.Chorus.delay);
    $("#chorus-bypass").val(settings.masterSettings.tuna.Chorus.bypass);
    //phaser
    $("#phaser-rate").val(settings.masterSettings.tuna.Phaser.rate);
    $("#phaser-depth").val(settings.masterSettings.tuna.Phaser.depth);
    $("#phaser-feedback").val(settings.masterSettings.tuna.Phaser.feedback);
    $("#phaser-bypass").val(settings.masterSettings.tuna.Phaser.bypass);
    //overdrive
    $("#master-drive").val(settings.masterSettings.tuna.Overdrive.curveAmount);
    //tremolo
    $("#tremolo-intensity").val(settings.masterSettings.tuna.Tremolo.intensity);
    $("#tremolo-rate").val(settings.masterSettings.tuna.Tremolo.rate);
    $("#tremolo-phase").val(settings.masterSettings.tuna.Tremolo.stereoPhase);
    $("#tremolo-bypass").val(settings.masterSettings.tuna.Tremolo.bypass);
    //bitcrusher
    $("#bitcrusher-bits").val(settings.masterSettings.tuna.Bitcrusher.bits);
    $("#bitcrusher-normfreq").val(settings.masterSettings.tuna.Bitcrusher.normfreq);
    $("#bitcrusher-bypass").val(settings.masterSettings.tuna.Bitcrusher.bypass);
}


/************ EVENT LISTENERS FOR CHANGING SETTINGS ************/

// //store the current octave setting (default to 3)
var octaveSetting = parseInt($("#octave").val());

/**
 * Detects when a synth setting is changed and updates the wadContainer objects.
 * If the changed setting was from tuna then the wads must be recreated
 */
$(".setting").change(function () {
    var id = $(this).attr('id');
    switch (id) {
        case 'octave':
            octaveSetting = parseInt($(this).val());
            break;
        case 'osc1-source':
            for (let property in wadContainer) {
                wadContainer[property].obj.wads[0].source = $(this).val().toString();
            }
            break;
        case 'osc2-source':
            for (let property in wadContainer) {
                wadContainer[property].obj.wads[1].source = $(this).val().toString();
            }
            break;
        case 'osc1-detune':
            for (let property in wadContainer) {
                wadContainer[property].obj.wads[0].detune = parseFloat($(this).val());
            }
            break;
        case 'osc2-detune':
            for (let property in wadContainer) {
                wadContainer[property].obj.wads[1].detune = parseFloat($(this).val());
            }
            break;
        case 'osc1-volume':
            for (let property in wadContainer) {
                wadContainer[property].obj.wads[0].setVolume($(this).val().toString());
                wadContainer[property].obj.wads[0].stop();
            }
            break;
        case 'osc2-volume':
            for (let property in wadContainer) {
                wadContainer[property].obj.wads[1].setVolume($(this).val().toString());
                wadContainer[property].obj.wads[1].stop();
            }
            break;
        case 'master-volume':
            for (let property in wadContainer) {
                wadContainer[property].obj.setVolume($(this).val().toString());
            }
            break;
        default:
            console.log("Error: setting id not found in switch");
    }
});

/** Stores settings in localstorage and reloads the page
 * This is necessary because some settings such as TUNA requires the 
 * WADs to be recreated, which spikes the CPU usage unless the page is reloaded.
 */
$(".tuna-setting").change(function () {
    localStorage.setItem("settings", JSON.stringify(getSettings()));
    location.reload();
});

/**** VISUALIZER ****/

// var WIDTH = 640;
// var HEIGHT = 100;
// var canvas = document.querySelector('#myCanvas');
// var myCanvas = canvas.getContext("2d");

// myCanvas.clearRect(0, 0, WIDTH, HEIGHT);

// function connectVisualizer(wad) {
//     console.log(wad);
//     wad.prototype.setUpExternalFxOnPlay = function (arg, context) {

//         var analyser = context.createAnalyser();
//         analyser.fftSize = 2048;
//         var bufferLength = analyser.frequencyBinCount; //an unsigned long value half that of the FFT size. This generally equates to the number of data values you will have to play with for the visualization
//         var dataArray = new Uint8Array(bufferLength);

//         drawVisual = requestAnimationFrame(draw);
//         analyser.getByteTimeDomainData(dataArray);

//         myCanvas.fillStyle = 'rgb(0, 0, 0)';
//         myCanvas.fillRect(0, 0, WIDTH, HEIGHT);
//         myCanvas.lineWidth = 2;
//         myCanvas.strokeStyle = 'rgb(0, 255, 0)';

//         myCanvas.beginPath();
//         var sliceWidth = WIDTH * 1.0 / bufferLength;
//         var x = 0;

//         for (var i = 0; i < bufferLength; i++) {

//             var v = dataArray[i] / 128.0;
//             var y = v * HEIGHT / 2;

//             if (i === 0) {
//                 myCanvas.moveTo(x, y);
//             } else {
//                 myCanvas.lineTo(x, y);
//             }

//             x += sliceWidth;
//         }
//         myCanvas.stroke();
//     };
// }


// var tuna;
// Wad.prototype.constructExternalFx = function(arg, context){
//     this.tuna   = new Tuna(context);
//     this.chorus = arg.chorus;
//     this.analyser = context.createAnalyser();
// };

// Wad.prototype.setUpExternalFxOnPlay = function(arg, context){
//     var chorus = new tuna.Chorus({
//         rate     : arg.chorus.rate     || this.chorus.rate,
//         feedback : arg.chorus.feedback || this.chorus.feedback,
//         delay    : arg.chorus.delay    || this.chorus.delay,
//         bypass   : arg.chorus.bypass   || this.chorus.bypass
//     });
//     chorus.input.connect = chorus.connect.bind(chorus); // we do this dance because tuna exposes its input differently.
//     this.nodes.push(chorus.input); // you would generally want to do this at the end unless you are working with something that does not modulate the sound (i.e, a visualizer)
// };


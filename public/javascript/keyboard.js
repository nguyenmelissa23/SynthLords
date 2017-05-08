/**
 * @file creates a keyboard that creates a PolyWad with the synth's current settings whenever a key is pressed down.
 * The PolyWad is stopped when the key is released.
 * 
 * TODO:
 * --- Must Have ---
 * Upload to hosting service with database (heroku/cleardb).
 * CSS.
 * STORE SETTINGS IN GLOBAL OBJECT AND UPDATE DYNAMICALLY WHEN SETTING CHANGES INSTEAD OF USING getSettings().
 * Store presets in MYSQL database.
 * Drum Machine.
 * Remove unused settings in html (eg: interval).
 * 
 * --- Nice To Have ---
 * Record and download tracks.
 * Upload your own audio files to play in drum machine.
 * Arpeggiator.
 * 
 * FIXME: 
 * Tuna Convolver error
 */

//creates the keyboard that is displayed in the html
var keyboard = new QwertyHancock({
    id: 'keyboard',
    width: 600,
    height: 150,
    octaves: 2,
    startNote: 'C3',
    whiteNotesColour: 'white',
    blackNotesColour: 'black',
    hoverColour: '#f3e939'
});

//Initialize WADS
var WADS = createWads();
//execute when key is pressed
keyboard.keyDown = function (note, frequency) {
    console.log(WADS[note]);
    console.log(WADS[note].wads[0].source);
    //Adjust the current note to the octave setting
    var keyboardNoteOctave = parseInt(note[note.length - 1]);
    var adjustedOctave = (octaveSetting + keyboardNoteOctave).toString();
    var currentNote = note.replace(/.$/, adjustedOctave);
    //play WAD corresponding to note
    WADS[note].play({ pitch: currentNote });
};

//Stop playing note when key is released
keyboard.keyUp = function (note, frequency) {
    WADS[note].stop();
};

function createWads() {
    var wads = {
        'C3': null,
        'C#3': null,
        'D3': null,
        'D#3': null,
        'E3': null,
        'F3': null,
        'F#3': null,
        'G3': null,
        'G#3': null,
        'A3': null,
        'A#3': null,
        'B3': null,
        'C4': null,
        'C#4': null,
        'D4': null,
        'D#4': null,
        'E4': null,
        'F4': null,
        'F#4': null,
        'G4': null,
        'G#4': null,
        'A4': null,
        'A#4': null,
        'B4': null,
    };
    var currentSettings = initializeSettings();
    for (var note in wads) {
        if (wads.hasOwnProperty(note)) {
            var osc1 = new Wad(currentSettings.osc1Settings);
            var osc2 = new Wad(currentSettings.osc2Settings);
            //combine the oscillators
            var doubleOsc = new Wad.Poly(currentSettings.masterSettings);
            //set master volume
            doubleOsc.setVolume(parseFloat($("#master-volume").val()));
            doubleOsc.add(osc1).add(osc2);
            wads[note] = doubleOsc;
        }
    }
    console.log("Done creating wads.");
    return wads;
}

/** Get the settings from the index.html elements */
function initializeSettings() {
    var result = {
        osc1Settings: {
            source: $("#osc1-source").val().toLowerCase(),
            volume: $("#osc1-gain").val().toLowerCase(),   // Peak volume can range from 0 to an arbitrarily high number, but you probably shouldn't set it higher than 1.
            //TODO: may need to change range on detune
            detune: parseFloat($("#osc1-detune").val()),     // Set a default detune on the constructor if you don't want to set detune on play(). Detune is measured in cents. 100 cents is equal to 1 semitone.
        },

        osc2Settings: {
            source: $("#osc2-source").val().toLowerCase(),
            volume: $("#osc2-gain").val().toLowerCase(),   // Peak volume can range from 0 to an arbitrarily high number, but you probably shouldn't set it higher than 1.
            //TODO: may need to change range on detune
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
                    bufferSize: 0,  //256 to 16384
                    bypass: parseInt($("#bitcrusher-bypass").val())
                }
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


/************ EVENT LISTENERS FOR CHANGING SETTINGS ************/

// //store the current octave setting (default to 3)
// var octaveSetting = 0;
// $("#octave").change(function () {
//     octaveSetting = parseInt($(this).val());
// });

// $(".setting").change(function () {
//     var id = $(this).attr('id');
//     console.log("---------\n");
//     console.log("id: " + id);
//     console.log("value: " + $(this).val() + " | type: " + typeof $(this).val());

//     switch (id) {
//         case 'osc1-source':
//             console.log($(this).val());
//             break;
//         case 'osc2-source':
//             console.log($(this).val());
//             break;
//         default:
//             // console.log("Error: setting id not found in switch");
//     }
// });

// function updateWads(setting, newValue){
//     for(var note in WADS){
//         console.log(WADS[note].wads[0].source);
//     }
// }

// updateWads();
/**
 * @file creates a keyboard that creates a PolyWad with the synth's current settings whenever a key is pressed down.
 * The PolyWad is stopped when the key is released.
 * 
 * TODO:
 * Set default values in html based on the github library.
 * Consider adding other settings listed in github (eg: vibrato, tuna).
 * Remove unused settings in html (eg: interval).
 * Change input value range in html for elements that do not range btwn 0.0 - 1.0 (eg: detune).
 * Set max and min input values in html to be decimals rather than integers.
 * FIXME: 
 * The volume is fidgety - sometimes if you have the volume down on both oscillators you will randomly hit a note that is much louder.
 * The reverb setting gives an error.
 */

//stores the WADs that are currently in use
var sounds = {};
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
//store the current octave setting (default to 3)
var currentOctave = '3';
$("#octave").change(function() {
  currentOctave = $( this ).val().toString();
});


//execute when key is pressed
keyboard.keyDown = function (note, frequency) {
    console.log(sounds);
    //Adjust the current note to the octave setting
    var currentNote = note.replace(/.$/,currentOctave);
    //create new oscillators with synth settings
    var currentSettings = getSettings();
    var osc1 = new Wad(currentSettings.osc1Settings);
    var osc2 = new Wad(currentSettings.osc2Settings);
    //combine the oscillators, add them to the object of sounds, and play the currentNote
    var doubleOsc = new Wad.Poly(currentSettings.masterSettings);
    //set master volume
    doubleOsc.setVolume(parseFloat($("#master-volume").val()));
    doubleOsc.add(osc1).add(osc2);
    sounds[currentNote] = doubleOsc;
    sounds[currentNote].play({ pitch: currentNote });
};


//execute when key is released
keyboard.keyUp = function (note, frequency) {
    var currentNote = note.replace(/.$/,currentOctave);
    //stop the given note on keyUp
    sounds[currentNote].stop();
    sounds[currentNote] = null;
};

/** Get the settings from the index.html elements */
function getSettings() {
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
            env: {      // This is the ADSR envelope.
                attack: parseFloat($("#filter-attack").val()),  // Time in seconds from onset to peak volume.  Common values for oscillators may range from 0.05 to 0.3.
                decay: parseFloat($("#filter-decay").val()),  // Time in seconds from peak volume to sustain volume.
                sustain: parseFloat($("#filter-sustain").val()),  // Sustain volume level. This is a percent of the peak volume, so sensible values are between 0 and 1.
                release: parseFloat($("#filter-release").val()),     // Time in seconds from the end of the hold period to zero volume, or from calling stop() to zero volume.
                hold: 3.14, // Time in seconds to maintain the sustain volume level. If this is not set to a lower value, oscillators must be manually stopped by calling their stop() method.

            },
            filter: {
                type: $("#filter-type").val().toLowerCase(), // What type of filter is applied.
                frequency: parseFloat($("#filter-frequency").val()),       // The frequency, in hertz, to which the filter is applied.
                q: parseFloat($("#filter-q").val()),         // Q-factor.  No one knows what this does. The default value is 1. Sensible values are from 0 to 10.
                env: {          // Filter envelope.
                    frequency: parseFloat($("#filter-env-freq").val()), // If this is set, filter frequency will slide from filter.frequency to filter.env.frequency when a note is triggered.
                    attack: parseFloat($("#filter-env-atk").val())  // Time in seconds for the filter frequency to slide from filter.frequency to filter.env.frequency
                }
            },

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
                    bypass: parseInt($("#chorus-bypass").val())          //the value 1 starts the effect as bypassed, 0 or 1
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
                // Convolver: {
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
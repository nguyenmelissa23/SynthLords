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
    width: 900,
    height: 150,
    octaves: 2
});

//execute when key is pressed
keyboard.keyDown = function (note, frequency) {
    console.log(parseFloat($("#filter-release").val()));
    //create new oscillators with synth settings
    var currentSettings = getSettings();
    var osc1 = new Wad(currentSettings.osc1Settings);
    var osc2 = new Wad(currentSettings.osc2Settings);
    //combine the oscillators, add them to the object of sounds, and play the note
    var doubleOsc = new Wad.Poly(currentSettings.masterSettings);
    //set master volume
    doubleOsc.setVolume(parseFloat($("#master-volume").val()));
    doubleOsc.add(osc1).add(osc2);
    sounds[note] = doubleOsc;
    sounds[note].play({ pitch: note });
};

//execute when key is released
keyboard.keyUp = function (note, frequency) {
    //stop the given note on keyUp
    sounds[note].stop();
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
            // reverb: {
            //     wet: parseFloat($("#master-reverb").val())                                            // Volume of the reverberations.
            // },
            delay: {
                delayTime: parseFloat($("#delay-rate").val()),  // Time in seconds between each delayed playback.
                wet: parseFloat($("#delay-wet").val()), // Relative volume change between the original sound and the first delayed playback.
                feedback: parseFloat($("#delay-feedback").val()), // Relative volume change between each delayed playback and the next. 
            },
            vibrato: { // A vibrating pitch effect.  Only works for oscillators.
                shape: 'sine', // shape of the lfo waveform. Possible values are 'sine', 'sawtooth', 'square', and 'triangle'.
                magnitude: 3,      // how much the pitch changes. Sensible values are from 1 to 10.
                speed: 4,      // How quickly the pitch changes, in cycles per second.  Sensible values are from 0.1 to 10.
                attack: 0       // Time in seconds for the vibrato effect to reach peak magnitude.
            },
            tremolo: { // A vibrating volume effect.
                shape: 'sine', // shape of the lfo waveform. Possible values are 'sine', 'sawtooth', 'square', and 'triangle'.
                magnitude: 3,      // how much the volume changes. Sensible values are from 1 to 10.
                speed: 4,      // How quickly the volume changes, in cycles per second.  Sensible values are from 0.1 to 10.
                attack: 0       // Time in seconds for the tremolo effect to reach peak magnitude.
            }
        }
    };
    return result;
}
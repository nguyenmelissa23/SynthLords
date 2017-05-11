/**
 * @file creates a keyboard that creates a PolyWad with the synth's current settings whenever a key is pressed down.
 * The PolyWad is stopped when the key is released.
 * 
 * TODO:
 * --- Must Have ---
 * Upload to hosting service with database (heroku/cleardb).
 * Drum Machine.
 * Visualizer
 * TEST TEST TEST TEST TEST
 * 
 * --- Nice To Have ---
 * Documentation in README
 * Unit Tests
 * Sustain notes until key is lifted up
 * Validation for preset name input
 * Record and download tracks.
 * Upload your own audio files to play in drum machine.
 * Arpeggiator.
 * Tuna Convolver.
 * Add link to github and copyright at bottom or top of page
 */

// localStorage.clear();
//if first time page is loaded then use default settings
var settings = localStorage.getItem("settings");
if (!settings) {
    // console.log("First time loading page - loading default settings");
    //Initialize WAD
    var defaultSettings = getSettings();
    var WAD = createWAD(defaultSettings);
    //store settings in local storage
    localStorage.setItem("settings", JSON.stringify(defaultSettings));
}
//if settings saved in local storage then use those
else {
    // console.log("Using settings from localstorage");
    var storedSettings = localStorage.getItem("settings");
    storedSettings = JSON.parse(storedSettings);
    var WAD = createWAD(storedSettings);
    //TODO: update html corresponding to stored settings
    updateHtml(storedSettings);
}

$(document).ready(function() {
    //when page loads get presets from synth db and add them to presets selector
    $.get("/api/preset/all", function(data) {
        for (var preset in data) {
            $('#preset-picker').append($('<option>', {
                value: data[preset].name,
                text: data[preset].name
            }));
        }
    });
});

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

//Only play notes when modals are closed
var modalOpen = false;
//execute when piano key is pressed
keyboard.keyDown = function(note, frequency) {
    if (!modalOpen) {
        //Adjust the current note to the octave setting
        var keyboardNoteOctave = parseInt(note[note.length - 1]);
        var adjustedOctave = (octaveSetting + keyboardNoteOctave).toString();
        var currentNote = note.replace(/.$/, adjustedOctave);
        //play WAD corresponding to note
        WAD.play({ pitch: currentNote, label : currentNote });
    }
};

//Stop playing note when key is released
keyboard.keyUp = function(note, frequency) {
    if (!modalOpen) {
        WAD.stop(note);
    }
};

function createWAD(settings) {
    var osc1 = new Wad(settings.osc1Settings);
    var osc2 = new Wad(settings.osc2Settings);
    //combine the oscillators
    var doubleOsc = new Wad.Poly(settings.masterSettings);
    //set master volume
    //TODO:
    // doubleOsc.setVolume(parseFloat(settings.volume));
    doubleOsc.add(osc1).add(osc2);
    return doubleOsc;
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
 * Detects when a synth setting is changed and updates the WAD settings.
 * If the changed setting was from tuna then the wads must be recreated
 */
$(".setting").change(function() {
    var id = $(this).attr('id');
    switch (id) {
        case 'octave':
            octaveSetting = parseInt($(this).val());
            break;
        case 'osc1-source':
            WAD.wads[0].source = $(this).val().toString();
            break;
        case 'osc2-source':
            WAD.wads[1].source = $(this).val().toString();
            break;
        case 'osc1-detune':
            WAD.wads[0].detune = parseFloat($(this).val());
            break;
        case 'osc2-detune':
            WAD.wads[1].detune = parseFloat($(this).val());
            break;
        case 'osc1-volume':
            WAD.wads[0].setVolume($(this).val().toString());
            WAD.wads[0].stop();
            break;
        case 'osc2-volume':
            WAD.wads[1].setVolume($(this).val().toString());
            WAD.wads[1].stop();
            break;
        case 'master-volume':
            WAD.setVolume($(this).val().toString());
            break;
        /** when a new preset is selected get it's settings from db and reload page */
        case 'preset-picker':
            var presetName = $(this).val().toString();
            var query = "/api/preset/" + presetName;
            $.get(query, function(preset) {
                localStorage.setItem("settings", preset.settings);
                location.reload();
            });
            break;
        default:
            console.log("Error: setting id not found in switch");
    }
});

/** Stores settings in localstorage and reloads the page
 * This is necessary because some settings such as TUNA requires the 
 * WADs to be recreated, which spikes the CPU usage unless the page is reloaded.
 */
$(".tuna-setting").change(function() {
    localStorage.setItem("settings", JSON.stringify(getSettings()));
    location.reload();
});

/** Toggle modalOpen when the modal loads so that notes aren't played on key presses */
$("#preset-modal").on('shown.bs.modal', function() {
    modalOpen = true;
});
$('#preset-modal').on('hidden.bs.modal', function() {
    modalOpen = false;
});

/** (in modal) Create new preset with current settings and post to synth db */
$("#preset-save").click(function() {
    var settings = getSettings();
    var currentSettings = JSON.stringify(settings);
    var newPreset = {
        name: $("#preset-name").val().toString().trim(),
        settings: currentSettings,
        creator: $("#preset-creator").val().toString().trim()
    };
    $.post("/api/preset", newPreset, function(preset) {
        //add preset to dropdown when done posting
        $('#preset-picker').append($("<option></option>")
            .attr("value", preset.name)
            .attr("id", preset.name)
            .text(preset.name));
    });

});

/**** VISUALIZER ****/


/** MIDI */

// midiMap = function(event){
//         console.log(event.receivedTime, event.data);
//         if ( event.data[0] === 144 ) { // 144 means the midi message has note data
//             // console.log('note')
//             if ( event.data[2] === 0 ) { // noteOn velocity of 0 means this is actually a noteOff message
//                 console.log('|| stopping note: ', Wad.pitchesArray[event.data[1]-12]);
//                 Wad.midiInstrument.stop(Wad.pitchesArray[event.data[1]-12]);
//             }
//             else if ( event.data[2] > 0 ) {
//                 console.log('> playing note: ', Wad.pitchesArray[event.data[1]-12]);
//                 Wad.midiInstrument.play({pitch : Wad.pitchesArray[event.data[1]-12], label : Wad.pitchesArray[event.data[1]-12], callback : function(that){
//                 }});
//             }
//         }
//         else if ( event.data[0] === 128 ) { // 144 means the midi message has note data
//             // console.log('note')
//             if ( event.data[2] === 0 ) { // noteOn velocity of 0 means this is actually a noteOff message
//                 console.log('|| stopping note: ', Wad.pitchesArray[event.data[1]-12]);
//                 Wad.midiInstrument.stop(Wad.pitchesArray[event.data[1]-12]);
//             }
//             else if ( event.data[2] > 0 ) {
//                 console.log('> playing note: ', Wad.pitchesArray[event.data[1]-12]);
//                 Wad.midiInstrument.play({pitch : Wad.pitchesArray[event.data[1]-12], label : Wad.pitchesArray[event.data[1]-12], callback : function(that){
//                 }});
//             }
//         }
//         else if ( event.data[0] === 176 ) { // 176 means the midi message has controller data
//             console.log('controller');
//             if ( event.data[1] == 46 ) {
//                 if ( event.data[2] == 127 ) { Wad.midiInstrument.pedalMod = true; }
//                 else if ( event.data[2] == 0 ) { Wad.midiInstrument.pedalMod = false; }
//             }
//         }
//         else if ( event.data[0] === 224 ) { // 224 means the midi message has pitch bend data
//             console.log('pitch bend');
//         }
//     };
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
        .then(success, failure);
}
 
function success (midi) {
    var inputs = midi.inputs.values();
    // inputs is an Iterator
 
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = onMIDIMessage;
    }
}
 
function failure () {
    console.error('No access to your midi devices.')
}
 
function onMIDIMessage (message) {
    var frequency = midiNoteToFrequency(message.data[1]);
 
    if (message.data[0] === 144 && message.data[2] > 0) {
        playNote(frequency);
    }
 
    if (message.data[0] === 128 || message.data[2] === 0) {
        stopNote(frequency);
    }
}
 
function midiNoteToFrequency (note) {
    return Math.pow(2, ((note - 69) / 12)) * 440;
}
 
function playNote (frequency) {
    // //Adjust the current note to the octave setting
    // var currentNote = note.replace(/.$/,currentOctave);
    //create new oscillators with synth settings
    var currentSettings = getSettings();
    var osc1 = new Wad(currentSettings.osc1Settings);
    var osc2 = new Wad(currentSettings.osc2Settings);
   var polyWad = new Wad.Poly(currentSettings.masterSettings);
    //combine the oscillators, add them to the object of sounds, and play the currentNote
    //set master volume
    polyWad.setVolume(parseFloat($("#master-volume").val()));
    Wad.midiInstrument.add(osc1).add(osc2);
    Wad.midiInstrument.play();
 
};

function stopNote (frequency) {
    Wad.midiInstrument.stop(frequency);
    Wad.midiInstrument.stop(frequency);
};
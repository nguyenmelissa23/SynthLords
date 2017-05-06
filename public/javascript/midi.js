midiMap = function (event) {

    console.log('hi');
    //create new oscillators with synth settings
    var currentSettings = getSettings();
    var osc1 = new Wad(currentSettings.osc1Settings);
    var osc2 = new Wad(currentSettings.osc2Settings);
    //combine the oscillators, add them to the object of sounds, and play the note
    Wad.midiInstrument = new Wad.Poly(currentSettings.masterSettings);
    //set master volume
    Wad.midiInstrument.add(osc1).add(osc2);
    Wad.midiInstrument.setVolume(parseFloat($("#master-volume").val()));

    console.log(event.receivedTime, event.data);


    if (event.data[0] === 144) { // 144 means the midi message has note data
        // console.log('note')
        if (event.data[2] === 0) { // noteOn velocity of 0 means this is actually a noteOff message
    var notePressed = Wad.pitchesArray[event.data[1] - 12];
            console.log('|| stopping note: ', notePressed);
            Wad.midiInstrument.stop();
        }
        else if (event.data[2] > 0) {
            var notePressed = Wad.pitchesArray[event.data[1] - 12];
            console.log('> playing note: ', notePressed);
            Wad.midiInstrument.play({
                pitch: notePressed, label: notePressed
            });
        }
    }
    if (event.data[0] === 128) {
        console.log('|| stopping note: ', Wad.pitchesArray[event.data[1] - 12]);
        Wad.midiInstrument.stop();
    }
    if (event.data[0] === 176) { // 176 means the midi message has controller data
        console.log('controller');
        if (event.data[1] == 46) {
            if (event.data[2] == 127) { Wad.midiInstrument.pedalMod = true; }
            else if (event.data[2] == 0) { Wad.midiInstrument.pedalMod = false; }
        }
    }
    if (event.data[0] === 224) { // 224 means the midi message has pitch bend data
        console.log('pitch bend');
    }

};

Wad.midiInputs[0].onmidimessage = midiMap;
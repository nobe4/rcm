// Global variables to use the interface.
var synth = new Synth();
var tick = new Tick();

// Defaults settings
var tempo = 120;
var loopDuration = 32;
var volume = 80/2.5;
var showNotes = false;


// Lists and default values.
var modulationListNames = ['root', 'simple', 'augmtd', '7 smpl', 'full'];
var currentModulationName = 1;
var rhythmMethods = ['equal', 'random', 'binary'];
var currentRythmMethods = 0;

// List of chords, set in reload.
var chords = [];

// Init the looper without chords, will change in reload.
var looper = new Looper(synth, tick, chords, tempo, volume, showCurrentChord);

reload();

document.getElementById('chords').innerHTML = chordsToHTML(chords);

/* Update the current shown chord, called inside the looper.
 */
function showCurrentChord(index){
	// Remove the active, can fail if none is found.
	try{
		document.querySelector('.chord.active').classList.remove('active');
	} catch(e) { /* ignore */ }

	// Add active to the currently playgin chord.
	document.querySelector('.chord:nth-child(' + (index + 1) + ')').classList.add('active');
}

// All those functions are called from the HTML, look at index.html, inside the buttons' onclick.
// They mostly toggle a state and update the looper/chords state.

/* playPause: Play/Pause the chord progression.
 */
function playPause(){
	looper.playPause();
	document.getElementById('playPause').classList.toggle('on', looper.playing);
}

/* reload: Reload the current rhythm and chords.
 */
function reload(){
	let r = new RhythmBox(loopDuration, rhythmMethods[currentRythmMethods]);
	chords = randomChords(r.durations, modulationListNames[currentModulationName]);

	// Update the chords and start from the first one, can be used without pausing.
	looper.chords = chords;
	looper.currentChord = 0;

	document.getElementById('chords').innerHTML = chordsToHTML(chords);
}

/* updateTempo: Update the looper tempo.
 */
function updateTempo(){
	// Cast the tempo into an integer
	tempo = +document.getElementById('tempo').value;
	document.getElementById('help-tempo').innerHTML = tempo;
	looper.tempo = tempo;
}

/* displayNotes: Display the notes making the chords below.
 */
function displayNotes(){
	showNotes = !showNotes;
	document.getElementById('chords').classList.toggle('showNotes', showNotes);
	document.getElementById('notes').classList.toggle('on', showNotes);
}

/* updateMetronome: On/Off the metronome.
 */
function updateMetronome(){
	looper.activeTick = !looper.activeTick;
	document.getElementById('metronome').classList.toggle('on', looper.activeTick);
}

/* updateDuration: Update the total duration of the loop, in sixteenth.
 */
function updateDuration(){
	loopDuration = document.getElementById('duration').value;
	document.getElementById('help-duration').innerHTML = loopDuration;
	reload();
}

/* updateRandom: Update the random generation method.
 */
function updateRandom(){
	currentRythmMethods = (currentRythmMethods + 1)%rhythmMethods.length;
	document.getElementById('random').innerHTML = rhythmMethods[currentRythmMethods];
	document.getElementById('help-random').innerHTML = rhythmMethods[currentRythmMethods];
	reload();
}

/* updateVolume: Update the volume. Apply a 2.5 ratio on it to prevent any overhead.
 */
function updateVolume(){
	volume = document.getElementById('volume').value;
	document.getElementById('help-volume').innerHTML = volume;
	looper.setVolume(volume/2.5); // scale the volume to preserve 
}

/* updateModulation: Update the modulation generation method.
 */
function updateModulation() {
	currentModulationName = (currentModulationName + 1)%modulationListNames.length;
	document.getElementById('modulation').innerHTML = modulationListNames[currentModulationName];
	document.getElementById('help-modulation').innerHTML = modulationListNames[currentModulationName];
	reload();
}

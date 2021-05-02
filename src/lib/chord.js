import { mtnn, mtf } from '@/lib/midi.js'
import { ratioToString } from '@/lib/time.js'

/* All the available modulations defined for a chord.
 * The integers are distances from the root note, e.g. a Major Triade is 0, 4, 7
 */
const chordModulations = {
	'': [0], // only the root note
	maj: [0, 4, 7],
	min: [0, 3, 7],
	dim: [0, 3, 6],
	aug: [0, 4, 8],
	5: [0, 5],
	7: [0, 4, 7, 10],
	maj7: [0, 4, 7, 11],
	min7: [0, 3, 7, 10],
	minmaj7: [0, 3, 7, 11],
	dim7: [0, 3, 6, 9],
	hdim7: [0, 3, 6, 10],
	dom7: [0, 4, 7, 10],
	aug7: [0, 4, 8, 11],
}

/* Different list of modulations available to the user, from the simplest, to
 * the most complete.
 */
const modulationLists = {
	root: [''],
	simple: ['', 'maj', 'min'],
	augmtd: ['', 'maj', 'min', 'dim', 'aug', '5'],
	'7 smpl': ['', 'maj', 'min', 'dim', 'aug', '5', '7', 'maj7', 'min7', 'minmaj7'],
	full: [
		'',
		'maj',
		'min',
		'dim',
		'aug',
		'5',
		'7',
		'maj7',
		'min7',
		'minmaj7',
		'dim7',
		'hdim7',
		'dom7',
		'aug7',
	],
}

/* randomChords: Generate a random chord sequence to fit the
 * defined duration.
 * params:
 *     durations: An array of durations to fit the chords in.
 *     modulationListName: The modulation list name to use.
 * returns: An array of chords.
 */
function randomChords(durations, modulationListName = 'simple') {
	return durations.map((duration) => Chord.random(duration, modulationListName))
}

/* modulationToNoteNames: Return all the notes making the defined chord.
 * params:
 *     root: The chord root note.
 *     modulation: The chord modulation.
 * returns: An array of notes.
 */
function modulationToNoteNames(root, modulation) {
	// For silence, return nothing
	if (root === -1) {
		return []
	}

	// Ensure the modulation exist.
	if (!Object.prototype.hasOwnProperty.call(chordModulations, modulation))
		throw `Invalid chord name: '${modulation}'.`

	// Get the modulation's construction and map each semitone to a new note.
	var chordConstruction = chordModulations[modulation]

	return chordConstruction.map((semitoneCount) => {
		return mtnn(root + semitoneCount)
	})
}

/* chordsToHTML: Convert a list of chords to their HTML representation.
 * params:
 *     chords: The list of chords.
 * returns: The HTML string representing the chords.
 */
function chordsToHTML(chords) {
	return chords
		.map((chord) => {
			const note = mtnn(chord.root)
			return `<li class="chord">
      <span class="rhythm">
	${chord.durationString
		.split('')
		.map((a) => `<i class='${a}'></i>`)
		.join('')}
      </span>
      <span class="note">
	<span class="name">${note[0]}</span>
	<span class="accidental">${note[1]}</span>
      </span>
      <span class="modulation">
	${chord.modulation}
      </span>
      <ul class="details">
      ${modulationToNoteNames(chord.root, chord.modulation)
			.map((note) => {
				return `<li>${note.join('')}</li>`
			})
			.join('')}
      </ul>
      </li>`
		})
		.join('')
}

/* Multiple defined pitch playing for a defined period of time.
 */
class Chord {
	/* Create a new chord.
	 * arguments:
	 *   root: Root note to base the chord on
	 *   modulation: Modulation of the chord (maj, min, ...)
	 *   duration: A number based ratio of the chord duration. (2 is half note, 4
	 *             a quarter, ...)
	 */
	constructor(root, modulation = '', duration = 2) {
		this.pitches = this.importChord(root, modulation)

		this.duration = duration

		// Used for display
		this.root = root
		this.modulation = modulation
		this.durationString = ratioToString(duration)
	}

	/* importChord: Transform a string into the defined notes forming the chord.
	 * params:
	 *     root: The midi root note.
	 *     modulation: The modulation to apply on the chord.
	 * returns: The list of the frequencies making the chord.
	 */
	importChord(root, modulation) {
		// Ensure the modulation exist.
		if (!Object.prototype.hasOwnProperty.call(chordModulations, modulation))
			throw `Invalid chord name: '${modulation}'.`

		// Get the modulation's construction and map each semitone to a new note.
		var chordConstruction = chordModulations[modulation]

		return chordConstruction.map((semitoneCount) => {
			return mtf(root + semitoneCount)
		})
	}

	/* play: Play the current chord, for the audio context, at a defined tempo,
	 *       from a defined time.
	 * arguments:
	 *   synth: The synth to play the notes on.
	 *   tempo: The tempo, in BPM.
	 *   time:  The time to start the chord in the audio context.
	 * returns: The next time to play a chord (the time + the current duration)
	 */
	play(synth, tempo, time) {
		// The effective duration of the chord is based on the number of beat, and
		// the time per beat, because the tempo is passed in Beat Per Minute, the
		// reference is 15 (60 / 4 for a quarter note reference).
		var endTime = time + this.duration * (15.0 / tempo)

		// Play all the pitches at the same time.
		this.pitches.map((pitch) => {
			synth.play(pitch, time, endTime)
		})

		return endTime
	}

	/* Generate a random chord, based on the passed parameters.
	 * params:
	 *     duration: The duration of the chord, default to random one.
	 *     modulationListName: The current modulation list to use.
	 * returns: A new randomly-created chord.
	 */
	static random(duration = undefined, modulationListName = 'simple') {
		// Generate a silence in 10% of the chords.
		if (Math.random() * 100 <= 10) {
			return new Chord(-1, undefined, duration)
		}

		// Possible notes range: A3-A4
		const root = 57 + ((Math.random() * 12) | 0)

		const modulationList = modulationLists[modulationListName]
		const modulation = modulationList[Math.floor(Math.random() * modulationList.length)]

		return new Chord(root, modulation, duration)
	}
}

export { Chord, chordsToHTML, randomChords, modulationToNoteNames }

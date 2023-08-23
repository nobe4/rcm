import { GuitarShapes, shapeToObject } from '@/lib/guitar.js'

class Note {
	// All note names with absolute positions, same "value" will be in the same position.
	static names = [
		['G##', 'A', 'Bbb'],
		['A#', 'Bb', 'Cbb'],
		['A##', 'B', 'Cb'],
		['B#', 'C', 'Dbb'],
		['B##', 'C#', 'Db'],
		['C##', 'D', 'Ebb'],
		['D#', 'Eb', 'Fbb'],
		['D##', 'E', 'Fb'],
		['E#', 'F', 'Gbb'],
		['E##', 'F#', 'Gb'],
		['F##', 'G', 'Abb'],
		['G#', 'Ab'],
	]

	// All natural names.
	static naturals = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

	// All note names without position, used for quick validity check.
	static allNames = [].concat.apply([], Note.names)
	static basicNames = Note.allNames.filter((a) => a.length !== 3)
	// There are 12 tones in standard western tuning.
	static count = 12

	// List of accidentals per key, only sharps. Flats can be computed from 12-sharps
	// Sharps are generally below 6, flats above.
	static accidentals = [3, 10, 5, 0, 7, 2, 9, 4, 11, 6, 1, 8]

	constructor(note, octave, accidental) {
		this.accidental = '' // Default, will be updated below
		this.octave = octave !== 0 && !octave ? 4 : octave // Default to octave 4

		let index = 0

		// Handle the note
		if (isFinite(String(note)) && note >= 0 && note <= 12) {
			// Note is an index, e.g. '1'
			index = parseInt(note, 10)
			this.natural = Note.names[index][1][0]
		} else {
			// Note is a name, e.g. 'A'
			Note.validate(note)
			index = Note.nameToIndex(note)
			this.natural = note[0]
		}

		if (accidental === '#') {
			index = (index + 1) % 12
		} else if (accidental === '##') {
			index = (index + 2) % 12
		} else if (accidental === 'b') {
			index = (index + 11) % 12
		} else if (accidental === 'bb') {
			index = (index + 10) % 12
		} else {
			// If the parametered accidental is nil but the given note name had one,
			// we need to keep it into account. It doesn't shift the index, just
			// might change the note name.
			if (note.length > 1) {
				accidental = note.slice(1, note.length)
			}
		}

		this.index = index
		this.name = Note.indexToName(index, this.natural)

		if (this.name.length > 1) {
			this.accidental = this.name.slice(1, this.name.length)
		}
	}

	// Index compute the index relative to the note names.
	static nameToIndex(name) {
		Note.validate(name)
		for (let index = 0; index < Note.count; index++) {
			if (Note.names[index].includes(name)) {
				return index
			}
		}
	}

	// Name computes a note name from the index and the natural.
	static indexToName(index, natural) {
		const candidates = Note.names[index]
		if (!candidates) {
			throw new Error(`invalid note index: ${index}`)
		}

		return candidates.filter((name) => name[0] === natural)[0]
	}

	// fromMidi create a note from the midi value.
	static fromMidi(midi) {
		if (midi < 21 || midi > 108) throw new Error(`invalid midi ${midi}`)

		// List all possible note to simplify the computation to a single modulo.
		const names = this.names[(midi - 21) % 12]

		// Use the same method but move the change to the note between B and C
		const octave = Math.floor((midi - 12) / 12)

		return new Note(names[0], octave)
	}

	// Return the accidental signature of the key, e.g. 4b, 0, 6#
	signature() {
		const count = Note.accidentals[this.index]

		if (count === 0) return '0'

		if (this.accidental === '') {
			if (count <= 6) return count + '#'
			return 12 - count + 'b'
		}

		return (this.accidental === '#' ? count : 12 - count) + this.accidental
	}

	// midi exports the midi value of the note
	midi() {
		return (
			// Change of octave happens between B and C, shift 9 semitones to reflect
			// that.
			((this.index + 9) % 12) +
			// Add the octave value
			12 * (this.octave + 1)
		)
	}

	// frequency converts the note to its Hertz frequency.
	frequency() {
		// Using http://www.glassarmonica.com/science/frequency_midi.php
		// f = 27.5 * 2 ^ ((midi - 21)/12)
		// Midi notes are from 21 (A0, 27.5Hz) to 108 (C8, 4186Hz)
		return 27.5 * Math.pow(2, (this.midi() - 21.0) / 12.0)
	}

	static random() {
		return Note.basicNames[(Math.random() * Note.basicNames.length) << 0]
	}

	static isValid(name) {
		return Note.allNames.includes(name)
	}

	static validate(name) {
		if (!Note.isValid(name)) {
			throw new Error(`invalid note name: ${name}`)
		}
	}

	toString(includeOctave) {
		const name = this.name
			.replaceAll('bb', '𝄫')
			.replaceAll('##', '𝄪')
			.replace('b', '♭')
			.replace('#', '♯')
		return `${name}${includeOctave ? this.octave : ''}`
	}
}

class Interval {
	// List of all main intervals with their names.
	static names = [
		'unison',
		'minor 2nd',
		'major 2nd',
		'minor 3rd',
		'major 3rd',
		'perfect 4th',
		'tritone',
		'perfect 5th',
		'minor 6th',
		'major 6th',
		'minor 7th',
		'major 7th',
		'octave',
		'minor 9th',
		'major 9th',
		'minor 10th',
		'major 10th',
		'perfect 11th',
	]

	constructor(root, data) {
		// Treat the root
		if (!root) return

		if (root instanceof Note) {
			this.notes = [root]
		} else {
			Note.validate(root)
			this.notes = [new Note(root)]
		}

		// Treat the data
		if (data === 0 || data) this.setData(data)
	}

	setData(data) {
		// Data is a the second note, compute the interval.
		if (Note.isValid(data)) {
			this.notes.push(new Note(data))

			let diff = this.notes[1].index - this.notes[0].index
			if (diff < 0) diff += 12
			this.interval = diff

			return
		}

		if (Interval.names.includes(data)) {
			// Data is the interval name, compute the new note.
			this.interval = Interval.names.indexOf(data)
		} else {
			// Data is the number of steps from the root.
			this.interval = Number(data)
			if (!this.interval && this.interval !== 0) throw new Error(`invalid data: '${data}'`)
		}

		// Compute the new note index from the interval.
		const noteIndex = this.notes[0].index + this.interval

		// Add the note with the default octave, use %12 to get the right note name.
		this.notes.push(new Note(noteIndex % 12))

		// Check if there is an octave change.
		if (
			// interval is above an octave
			this.interval > 12 ||
			// index is above 15, it needs to be above 15 to go around. e.g.:
			// E + minor 6th = C => 7 + 8 => 15
			// G + perfect 4th = C => 10 + 5 => 15
			noteIndex >= 15 ||
			// If the starting note is below C and the second note is above C.
			(this.notes[0].index < 3 && noteIndex >= 3)
		) {
			this.notes[1].octave = this.notes[0].octave + 1
		}
	}

	name() {
		return Interval.names[this.interval]
	}

	static random(root, allowed) {
		if (!root) root = Note.random()

		let interval = null
		if (!allowed || allowed.length === 0) {
			interval = (Math.random() * Interval.names.length) << 0
		} else {
			interval = allowed[(Math.random() * allowed.length) << 0]
		}

		return new Interval(root, interval)
	}

	frequencies() {
		return this.notes.map((x) => x.frequency())
	}

	toString() {
		return `${this.notes[0]} ${this.notes[1]}: ${Interval.names[this.interval]}`
	}
}

// List of all main chords with their interval and tones from the root.
class Chord {
	static names = {
		'': {
			// only the root note
			tones: [],
			intervals: [],
		},
		major: { tones: [4, 7], intervals: [4, 3] },
		minor: { tones: [3, 7], intervals: [3, 4] },
		diminished: { tones: [3, 6], intervals: [3, 3] },
		augmented: { tones: [4, 8], intervals: [4, 4] },
		5: { tones: [7], intervals: [7] },
		'dominant 7': { tones: [4, 7, 10], intervals: [4, 3, 3] },
		'major 7': { tones: [4, 7, 11], intervals: [4, 3, 4] },
		'minor 7': { tones: [3, 7, 10], intervals: [4, 3, 3] },
		'minor major 7': { tones: [3, 7, 11], intervals: [4, 4, 3] },
		'diminished 7': { tones: [3, 6, 9], intervals: [3, 3, 3] },
		'half diminished 7': { tones: [3, 6, 10], intervals: [3, 3, 4] },
		'augmented 7': { tones: [4, 8, 11], intervals: [4, 4, 4] },
	}

	constructor(root, ...data) {
		// Treat the root
		if (!root) return

		Note.validate(root)

		this.notes = [new Note(root)]
		this.name = '' // default name

		// Treat the data
		if (data !== 0 && (!data || data.length === 0)) return

		if (data.length === 1) {
			// Data is the chord name, compute the notes
			const chord = Chord.names[data[0]]
			if (chord) {
				this.name = data[0]
				for (let i = 0, j = chord.tones.length; i < j; i++) {
					this.notes.push(new Note((this.notes[0].index + chord.tones[i]) % 12))
				}
			} else {
				throw new Error(`invalid arguments: ${data}`)
			}
		} else {
			// Data is the list of notes names, TODO
			throw new Error("doesn't handle multiple arguments yet")
		}
	}

	static random(root) {
		if (!root) root = Note.random()

		const names = Object.keys(Chord.names)
		const name = names[(Math.random() * names.length) << 0]

		return new Chord(root, name)
	}

	static allMod() {
		return Object.keys(this.names).map((m) => new Chord('A', m))
	}

	// Convert to a list of possible guitar positions.
	toGuitarPosition() {
		// compute the neck position for the note
		const position = (this.notes[0].midi() - 16) % 12

		if (this.name in GuitarShapes) {
			return GuitarShapes[this.name].map((s) => {
				const o = shapeToObject(s)
				o.position = (o.position + position) % 12
				return o
			})
		}

		return {}
	}

	toString(detailed) {
		let ret = `${this.notes[0]} ${this.name}`
		if (detailed) {
			ret += `: ${this.notes.join(' ')}`
		}
		return ret
	}
}

// List of all main scales with their interval and tones from the root.
class Scale {
	static names = {
		major: { tones: [2, 4, 5, 7, 9, 11], intervals: [2, 2, 1, 2, 2, 2, 1] },
		ionian: { tones: [2, 4, 5, 7, 9, 11], intervals: [2, 2, 1, 2, 2, 2, 1] },
		dorian: { tones: [2, 3, 5, 7, 9, 10], intervals: [2, 1, 2, 2, 2, 1, 2] },
		phrygian: { tones: [1, 3, 5, 7, 8, 10], intervals: [1, 2, 2, 2, 1, 2, 2] },
		// continue in https://en.wikipedia.org/wiki/Mode_(music)#Analysis
		'harmonic minor': { tones: [2, 3, 5, 7, 8, 10], intervals: [2, 1, 2, 2, 1, 2, 2] },
		pentatonic: { tones: [2, 4, 7, 9], intervals: [2, 2, 3, 2, 2, 3] },
		// Not yet well supported
		// 'whole-tone': { tones: [2, 4, 6, 8, 10], intervals: [2, 2, 2, 2, 2, 2] },
		// chromatic: { tones: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], intervals: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] }
	}

	static allNames = Object.keys(Scale.names)

	constructor(root, ...data) {
		// Treat the root
		if (!root) return

		if (root instanceof Note) {
			this.notes = [root]
		} else {
			Note.validate(root)
			this.notes = [new Note(root)]
		}

		this.name = 'major' // default name

		// Treat the data
		if (data !== 0 && (!data || data.length === 0)) return

		if (data.length === 1) {
			// Data is the scale name, compute the notes
			if (Scale.names[data[0]]) {
				this.name = data[0]
			} else {
				throw new Error(`invalid scale arguments: ${data}`)
			}
		} else {
			// Data is the list of notes names, TODO
			throw new Error("doesn't handle multiple arguments yet")
		}

		this.noteList()
	}

	// Create the list of notes for the current scale
	noteList() {
		const rootIndex = this.notes[0].index
		// const rootAccidental = this.notes[0].accidental
		const tones = Scale.names[this.name].tones
		const intervals = Scale.names[this.name].intervals

		let previousNote = this.notes[0]
		let natural = Note.naturals.indexOf(this.notes[0].name[0])
		let octave = 4

		for (let i = 0, j = tones.length; i < j; i++) {
			const newNoteIndex = (rootIndex + tones[i]) % 12
			let newNote = new Note(newNoteIndex, octave)

			// Skipping a note when jumping by a third.
			if (intervals[i] === 3) {
				natural++
			}

			const expectedNatural = Note.naturals[++natural % 7]

			// The expected natural isn't right, we need to switch it.
			if (expectedNatural !== newNote.name[0]) {
				const newName = Note.names[newNote.index].filter(
					(name) => name[0] === expectedNatural
				)[0]
				if (newName) newNote = new Note(newName, octave)
			}

			// Check that the midi notes are only increasing
			if (newNote.midi() < previousNote.midi()) {
				// Switch octave if we ever get a smaller midi note.
				newNote.octave = ++octave
			}

			previousNote = newNote
			this.notes.push(newNote)
		}
	}

	static random(root, allowed) {
		if (!root) root = Note.random()

		let index = null
		if (!allowed || allowed.length === 0) {
			index = (Math.random() * Scale.allNames.length) << 0
		} else {
			index = allowed[(Math.random() * allowed.length) << 0]
		}
		const name = Scale.allNames[index]

		return new Scale(root, name)
	}

	toString() {
		return `${this.notes[0]} ${this.name}: ${this.notes.join(' ')}`
	}
}

export { Note, Interval, Chord, Scale }

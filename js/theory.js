class Note {
  // All note names with absolute positions, same "value" will be in the same position.
  static names = [['A'], ['A#', 'Bb'], ['B', 'Cb'], ['C', 'B#'], ['C#', 'Db'], ['D'], ['D#', 'Eb'], ['E', 'Fb'], ['F', 'E#'], ['F#', 'Gb'], ['G'], ['G#', 'Ab']]
  // All note names without position, used for quick validity check.
  static allNames = [].concat.apply([], Note.names)
  // There are 12 tones in standard western tuning.
  static count = 12

  constructor (note, octave) {
    if (isFinite(String(note)) && note >= 0 && note <= 12) {
      // Name is a number, try to add it from the name list.
      this.name = note
    } else {
      // Name is the note name, add it directly.
      Note.validate(note)
      this.name = Note.index(note)
    }
    this.octave = (octave !== 0 && !octave) ? 4 : octave // default to octave 4
  }

  // Index compute the index relative to the note names.
  static index (name) {
    Note.validate(name)
    for (let index = 0; index < Note.count; index++) {
      if (Note.names[index].includes(name)) {
        return index
      }
    }
  }

  // Name computes a note name from index with the right accidental if specified.
  static name (index, accidental) {
    const candidates = Note.names[index]
    if (!candidates) {
      throw new Error(`invalid note index: ${index}`)
    }

    if (candidates.length === 1 || !accidental) {
      // Return the note name iff there's only one possibility, or if the
      // accidental is not specified.
      return candidates[0]
    } else {
      // TODO, have some logic here to return `b` or `#` when better.
      return candidates[0]
    }
  }

  // fromMidi create a note from the midi value.
  static fromMidi (midi) {
    if (midi < 21 || midi > 108) throw new Error(`invalid midi ${midi}`)

    // List all possible note to simplify the computation to a single modulo.
    const names = this.names[(midi - 21) % 12]

    // Use the same method but move the change to the note between B and C
    const octave = Math.floor((midi - 12) / 12)

    return new Note(names[0], octave)
  }

  // toMidi exports the midi value of the note
  toMidi () {
    return (
      // Change of octave happens between B and C, shift 9 semitones to reflect
      // that.
      ((this.name + 9) % 12) +

      // Add the octave value
      (12 * (this.octave + 1))
    )
  }

  // frequency converts the note to its Hertz frequency.
  frequency () {
    // Using http://www.glassarmonica.com/science/frequency_midi.php
    // f = 27.5 * 2 ^ ((midi - 21)/12)
    // Midi notes are from 21 (A0, 27.5Hz) to 108 (C8, 4186Hz)
    return 27.5 * Math.pow(2, ((this.toMidi() - 21.0) / 12.0))
  }

  static random () {
    return Note.allNames[Math.random() * Note.count << 0]
  }

  static isValid (name) {
    return Note.allNames.includes(name)
  }

  static validate (name) {
    if (!Note.isValid(name)) {
      throw new Error(`invalid note name: ${name}`)
    }
  }

  toString (includeOctave) {
    return `${Note.names[this.name][0]}${includeOctave ? this.octave : ''}`
  }
}

class Interval {
  // List of all main intervals with their names.
  static names = [
    'unison', 'minor 2nd', 'major 2nd', 'minor 3rd', 'major 3rd',
    'perfect 4th', 'tritone', 'perfect 5th', 'minor 6th', 'major 6th',
    'minor 7th', 'major 7th', 'octave', 'minor 9th', 'major 9th',
    'minor 10th', 'major 10th', 'perfect 11th']

  constructor (root, data) {
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

  setData (data) {
    // Data is a the second note, compute the interval.
    if (Note.isValid(data)) {
      this.notes.push(new Note(data))

      let diff = Note.index(data) - Note.index(this.notes[0].name)
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

    // Compute the new note name from the interval.
    const noteIndex = this.notes[0].name + this.interval

    // Add the note with the default octave, use %12 to get the right note name.
    this.notes.push(new Note(noteIndex % 12))

    // Check if there is an octave change.
    if (
      // interval is above an octave
      (this.interval > 12) ||

      // index is above 15, it needs to be above 15 to go around. e.g.:
      // E + minor 6th = C => 7 + 8 => 15
      // G + perfect 4th = C => 10 + 5 => 15
      (noteIndex >= 15) ||

      // If the starting note is below C and the second note is above C.
      (this.notes[0].name < 3 && noteIndex >= 3)
    ) {
      this.notes[1].octave = this.notes[0].octave + 1
    }
  }

  name () {
    return Interval.names[this.interval]
  }

  static random (root, allowedIntervals) {
    if (!root) root = Note.random()

    let interval = null
    if (!allowedIntervals || allowedIntervals.length === 0) {
      interval = Math.random() * Interval.names.length << 0
    } else {
      interval = allowedIntervals[Math.random() * allowedIntervals.length << 0]
    }

    return new Interval(root, interval)
  }

  frequencies () {
    return this.notes.map(x => x.frequency())
  }

  toString () {
    return `${this.notes[0]} ${this.notes[1]}: ${Interval.names[this.interval]}`
  }
}

// List of all main chords with their interval and tones from the root.
class Chord {
  static names = {
    '': { // only the root note
      tones: [], intervals: []
    },
    major: { tones: [4, 7], intervals: [4, 3] },
    minor: { tones: [3, 7], intervals: [3, 4] },
    diminished: { tones: [3, 6], intervals: [3, 3] },
    augmented: { tones: [4, 8], intervals: [4, 4] },
    '5th': { tones: [7], intervals: [7] },
    'dominant 7th': { tones: [4, 7, 10], intervals: [4, 3, 3] },
    'major 7': { tones: [4, 7, 11], intervals: [4, 3, 4] },
    'minor 7': { tones: [3, 7, 10], intervals: [4, 3, 3] },
    'minor major 7': { tones: [3, 7, 11], intervals: [4, 4, 3] },
    'diminished 7': { tones: [3, 6, 9], intervals: [3, 3, 3] },
    'half diminished 7': { tones: [3, 6, 10], intervals: [3, 3, 4] },
    'augmented 7': { tones: [4, 8, 11], intervals: [4, 4, 4] }
  }

  constructor (root, ...data) {
    // Treat the root
    if (!root) return

    Note.validate(root)

    this.notes = [root]
    this.name = '' // default name

    // Treat the data
    if (data !== 0 && (!data || data.length === 0)) return

    if (data.length === 1) {
      // Data is the chord name, compute the notes
      const chord = Chord.names[data[0]]
      if (chord) {
        this.name = data
        const rootIndex = Note.index(root)
        for (let i = 0, j = chord.tones.length; i < j; i++) {
          this.notes.push(Note.name((rootIndex + chord.tones[i]) % 12))
        }
      } else {
        throw new Error(`invalid arguments: ${data}`)
      }
    } else {
      // Data is the list of notes names, TODO
      throw new Error('doesn\'t handle multiple arguments yet')
    }
  }

  static random (root) {
    if (!root) root = Note.random()

    const names = Object.keys(Chord.names)
    const name = names[Math.random() * names.length << 0]

    return new Chord(root, name)
  }

  toString () {
    return `${this.notes[0]} ${this.name}: ${this.notes.join(' ')}`
  }
}

// List of all main scales with their interval and tones from the root.
class Scale {
  static names = {
    major: { tones: [2, 4, 5, 7, 9, 11], intervals: [2, 2, 1, 2, 2, 2, 1] },
    'harmonic minor': { tones: [2, 3, 5, 7, 8, 10], intervals: [2, 1, 2, 2, 1, 2, 2] },
    pentatonic: { tones: [2, 4, 7, 9], intervals: [2, 2, 3, 2, 2, 3] }
  }

  static allNames = Object.keys(Scale.names)

  constructor (root, ...data) {
    // Treat the root
    if (!root) return

    Note.validate(root)

    this.notes = [root]
    this.name = 'major' // default name

    // Treat the data
    if (data !== 0 && (!data || data.length === 0)) return

    if (data.length === 1) {
      // Data is the scale name, compute the notes
      const scale = Scale.names[data[0]]
      if (scale) {
        this.name = data
        const rootIndex = Note.index(root)
        for (let i = 0, j = scale.tones.length; i < j; i++) {
          this.notes.push(Note.name((rootIndex + scale.tones[i]) % 12))
        }
      } else {
        throw new Error(`invalid arguments: ${data}`)
      }
    } else {
      // Data is the list of notes names, TODO
      throw new Error('doesn\'t handle multiple arguments yet')
    }
  }

  static random (root) {
    if (!root) root = Note.random()

    const name = Scale.allNames[Math.random() * Scale.allNames.length << 0]

    return new Scale(root, name)
  }

  toString () {
    return `${this.notes[0]} ${this.name}: ${this.notes.join(' ')}`
  }
}
